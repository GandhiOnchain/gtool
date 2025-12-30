// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { FixedPointMathLib } from "solady/src/utils/FixedPointMathLib.sol";
import { VieMarketInventory } from "./VieMarketInventory.sol";

/**
 * @title ViePredictionMarketUSDCV1
 * @notice LMSR market (fixed liquidity parameter) where each outcome share is minted as a 6-decimal ERC-1155 token.
 */
contract ViePredictionMarketUSDCV1 is UUPSUpgradeable, OwnableUpgradeable {
    /**
     * @notice Encapsulates the core configuration and accounting for a market ID (inventory address).
     * @param resolver Account authorized to resolve the market.
     * @param closeTime UNIX timestamp after which trading halts.
     * @param isResolved Flag indicating whether a winning outcome has been declared.
     * @param winningOutcomeId One-based ID of the winning outcome when resolved.
     * @param collateralBalance Total USDC held on behalf of the market.
     * @param liquidityParameterWad LMSR liquidity parameter `b` in WAD precision.
     * @param virtualSeedPerOutcome Virtual seed shares applied to every outcome for LMSR stability.
     * @param initialRulesUri URI that references the canonical market rules text.
     * @param initialRulesHash Hash of the market rules text for integrity verification.
     */
    struct CoreMarketState {
        address resolver;
        uint48 closeTime;
        bool isResolved;
        uint16 winningOutcomeId;
        uint256 collateralBalance;
        uint256 liquidityParameterWad;
        uint256 virtualSeedPerOutcome;
        string initialRulesUri;
        bytes32 initialRulesHash;
    }

    /**
     * @notice Off-chain permit payload required for gasless collateral approvals.
     * @param v ECDSA recovery ID.
     * @param r ECDSA R parameter.
     * @param s ECDSA S parameter.
     * @param deadline UNIX timestamp indicating permit expiry.
     */
    struct PermitSignaturePayload {
        uint8 v;
        bytes32 r;
        bytes32 s;
        uint256 deadline;
    }

    /**
     * @notice Mapping of inventory address (market ID) to the persisted core state.
     */
    mapping(address => CoreMarketState) private marketById;

    /**
     * @notice Tracks per-user USDC contributions that can be reclaimed when resolution is overdue.
     */
    mapping(address => mapping(address => uint256)) private collateralContributed;

    /**
     * @notice Conversion factor from 6-decimal shares to WAD (1e18) precision.
     */
    uint256 private constant SHARE_TO_WAD_FACTOR = 1e12;

    /**
     * @notice Implementation address used for cloning new inventory contracts.
     */
    address public inventoryImplementation;

    /**
     * @notice Custom USDC address used on non-first-class supported networks.
     */
    address private _customUSDCAddress;

    /**
     * @notice Emitted when a prediction market is created.
     * @param marketId Inventory contract address that acts as the unique market identifier.
     * @param resolver Address authorized to resolve the market.
     * @param closeTime UNIX timestamp after which trading halts.
     * @param liquidityParameterWad LMSR parameter `b` in WAD precision.
     * @param outcomesCount Number of outcomes configured for the market.
     */
    event MarketCreated(
        address indexed marketId,
        address indexed resolver,
        uint256 closeTime,
        uint256 liquidityParameterWad,
        uint256 outcomesCount
    );

    /**
     * @notice Emitted whenever outcome inventory changes through a buy or sell.
     * @param marketId Inventory contract (market identifier).
     * @param user Trader executing the order.
     * @param outcomeId One-based ID of the traded outcome.
     * @param isBuy True when buying shares, false when selling shares.
     * @param shares Number of shares transacted (6 decimals).
     * @param usdcAmount USDC spent or received (6 decimals).
     * @param price Marginal price after the trade (WAD probability converted to 6-decimal USD equivalent).
     * @param outcomeInventory Virtual inventory (real supply + seed) post trade (6 decimals).
     */
    event OutcomeTraded(
        address indexed marketId,
        address indexed user,
        uint256 indexed outcomeId,
        bool isBuy,
        uint256 shares,
        uint256 usdcAmount,
        uint256 price,
        uint256 outcomeInventory
    );

    /**
     * @notice Emitted whenever a resolver finalizes a market.
     * @param marketId Inventory contract (market identifier).
     * @param winningOutcomeId One-based winning outcome ID.
     */
    event Resolved(address indexed marketId, uint256 winningOutcomeId);

    /**
     * @notice Emitted whenever a user redeems shares after resolution.
     * @param marketId Inventory contract (market identifier).
     * @param user Address receiving the payout.
     * @param outcomeId One-based redeemed outcome ID.
     * @param shares Number of shares redeemed (6 decimals).
     * @param payout USDC paid to the user (6 decimals).
     */
    event Redeemed(
        address indexed marketId,
        address indexed user,
        uint256 indexed outcomeId,
        uint256 shares,
        uint256 payout
    );

    /**
     * @notice Ensures trading is only possible before the close time and prior to resolution.
     * @param marketId Inventory contract (market identifier).
     */
    modifier tradingOpen(address marketId) {
        CoreMarketState storage market = _requireMarket(marketId);
        require(!market.isResolved && block.timestamp < market.closeTime, "market closed");
        _;
    }

    /**
     * @notice Restricts callers to the market resolver.
     * @param marketId Inventory contract (market identifier).
     */
    modifier onlyResolver(address marketId) {
        require(msg.sender == marketById[marketId].resolver, "not resolver");
        _;
    }

    /* -------------------------------------------------------------------------- */
    /*                               External (state)                            */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice Initializes upgradeability metadata and USDC configuration.
     * @dev Must be invoked exactly once by the proxy constructor.
     * @param owner_ Address receiving contract ownership.
     * @param inventoryImplementation_ Address of the inventory implementation to clone.
     * @param customUSDC Address of USDC to use when not on first-class supported networks.
     */
    function initialize(address owner_, address inventoryImplementation_, address customUSDC)
        external
        initializer
    {
        __Ownable_init(owner_);
        __UUPSUpgradeable_init();
        inventoryImplementation = inventoryImplementation_;
        _customUSDCAddress = customUSDC;
    }

    /**
     * @notice Updates the stored inventory implementation for future markets.
     * @dev Callable by the contract owner to rotate the implementation address.
     * @param newImplementation Address of the new inventory implementation contract.
     */
    function updateInventoryImplementation(address newImplementation) external onlyOwner {
        require(newImplementation != address(0), "inventory impl");
        inventoryImplementation = newImplementation;
    }

    /**
     * @notice Updates the fallback USDC address for non-first-class supported networks.
     * @dev Callable by the contract owner to point to a new collateral token.
     * @param newAddress Address of the custom USDC token contract.
     */
    function updateCustomUSDC(address newAddress) external onlyOwner {
        _customUSDCAddress = newAddress;
    }

    /**
     * @notice Creates a new LMSR market and deploys its inventory contract.
     * @dev Caller provides metadata, rules URI/hash, and virtual seed parameters.
     * @param salt CREATE2 salt used to deploy the inventory clone deterministically.
     * @param resolver Address authorized to resolve the market.
     * @param closeTime UNIX timestamp when trading stops.
     * @param question Primary human-readable market question.
     * @param initialRulesUri URI pointing to the initial market rules text.
     * @param initialRulesHash Hash of the rules text for auditability.
     * @param outcomeNames Outcome names aligned with outcome IDs (index + 1).
     * @param outcomeImageUris Optional media URIs aligned with outcomes (empty string uses SVG fallback).
     * @param liquidityParameterWad LMSR `b` parameter in WAD precision.
     * @param virtualSeedPerOutcome Virtual seed (in shares) added to each outcome for numerical stability.
     * @return marketId Address of the deployed inventory, used as the market identifier.
     */
    function createMarket(
        bytes32 salt,
        address resolver,
        uint256 closeTime,
        string calldata question,
        string calldata initialRulesUri,
        bytes32 initialRulesHash,
        string[] calldata outcomeNames,
        string[] calldata outcomeImageUris,
        uint256 liquidityParameterWad,
        uint256 virtualSeedPerOutcome
    ) external returns (address marketId) {
        require(inventoryImplementation != address(0), "inventory impl");
        require(liquidityParameterWad > 0, "b>0");
        require(closeTime <= type(uint48).max, "closeTime too big");

        uint256 outcomesCount = outcomeNames.length;
        require(outcomesCount >= 2, "N>=2");
        require(outcomesCount <= type(uint8).max, "too many");
        require(outcomesCount == outcomeImageUris.length, "images mismatch");

        string[] memory namesCopy = new string[](outcomesCount);
        string[] memory imageUrisCopy = new string[](outcomesCount);
        for (uint256 i = 0; i < outcomesCount; i++) {
            namesCopy[i] = outcomeNames[i];
            imageUrisCopy[i] = outcomeImageUris[i];
        }

        marketId = Clones.cloneDeterministic(inventoryImplementation, salt);
        VieMarketInventory(marketId).initialize(address(this), question, namesCopy, imageUrisCopy);

        CoreMarketState storage market = marketById[marketId];
        require(market.resolver == address(0), "exists");

        market.resolver = resolver;
        market.closeTime = uint48(closeTime);
        market.isResolved = false;
        market.winningOutcomeId = 0;
        market.collateralBalance = 0;
        market.liquidityParameterWad = liquidityParameterWad;
        market.virtualSeedPerOutcome = virtualSeedPerOutcome;
        market.initialRulesUri = initialRulesUri;
        market.initialRulesHash = initialRulesHash;

        emit MarketCreated(marketId, resolver, closeTime, liquidityParameterWad, outcomesCount);
    }

    /**
     * @notice Purchases outcome shares using the caller's existing USDC allowance.
     * @dev Caller must pre-approve the contract to transfer USDC or use `buyWithPermitSignature`.
     * @param marketId Inventory contract (market identifier).
     * @param outcomeId One-based outcome ID to buy.
     * @param sharesToBuy Number of shares to purchase (6 decimals).
     * @param maxCost Maximum USDC the caller is willing to spend (6 decimals).
     * @return usdcCost USDC spent (6 decimals).
     */
    function buy(address marketId, uint256 outcomeId, uint256 sharesToBuy, uint256 maxCost)
        external
        tradingOpen(marketId)
        returns (uint256 usdcCost)
    {
        return _buy(marketId, outcomeId, sharesToBuy, maxCost, msg.sender);
    }

    /**
     * @notice Purchases outcome shares while authorizing USDC via an EIP-2612 permit signature.
     * @dev Caller signs a permit for the exact USDC cost prior to invoking this function.
     * @param marketId Inventory contract (market identifier).
     * @param outcomeId One-based outcome ID to buy.
     * @param sharesToBuy Number of shares to purchase (6 decimals).
     * @param maxCost Maximum USDC the caller is willing to spend (6 decimals).
     * @param sig Struct containing the permit signature data.
     * @return usdcCost USDC spent (6 decimals).
     */
    function buyWithPermitSignature(
        address marketId,
        uint256 outcomeId,
        uint256 sharesToBuy,
        uint256 maxCost,
        PermitSignaturePayload calldata sig
    ) external tradingOpen(marketId) returns (uint256 usdcCost) {
        IERC20Permit(_usdcAddress()).permit(
            msg.sender,
            address(this),
            maxCost,
            sig.deadline,
            sig.v,
            sig.r,
            sig.s
        );

        return _buy(marketId, outcomeId, sharesToBuy, maxCost, msg.sender);
    }

    /**
     * @notice Sells outcome shares back to the LMSR pool for USDC.
     * @dev Caller must approve the inventory contract via `setApprovalForAll` beforehand.
     * @param marketId Inventory contract (market identifier).
     * @param outcomeId One-based outcome ID to sell.
     * @param sharesToSell Number of shares to sell (6 decimals).
     * @param minPayout Minimum USDC the caller is willing to accept (6 decimals).
     * @return usdcPayout USDC received (6 decimals).
     */
    function sell(address marketId, uint256 outcomeId, uint256 sharesToSell, uint256 minPayout)
        external
        tradingOpen(marketId)
        returns (uint256 usdcPayout)
    {
        CoreMarketState storage market = _requireMarket(marketId);
        VieMarketInventory inventory = VieMarketInventory(marketId);
        uint256[] memory minted = inventory.totalShares();
        uint256 idx = _validateOutcomeId(minted.length, outcomeId);

        require(sharesToSell > 0, "shares");
        require(minted[idx] >= sharesToSell, "inventory");

        uint256[] memory virtualShares = _virtualSharesFromMinted(minted, market.virtualSeedPerOutcome);
        uint256[] memory q = _sharesToWadArray(virtualShares);
        uint256 bWad = market.liquidityParameterWad;
        uint256 c0 = _cost(q, bWad);
        q[idx] -= _shareToWad(sharesToSell);
        uint256 c1 = _cost(q, bWad);

        uint256 payout = _wadToToken(c0 - c1);
        require(payout >= minPayout, "slippage");

        inventory.burnShares(msg.sender, outcomeId, sharesToSell);

        require(market.collateralBalance >= payout, "bank");
        market.collateralBalance -= payout;

        uint256 contributed = collateralContributed[marketId][msg.sender];
        if (payout >= contributed) {
            collateralContributed[marketId][msg.sender] = 0;
        } else {
            collateralContributed[marketId][msg.sender] = contributed - payout;
        }

        IERC20 usdc = IERC20(_usdcAddress());
        require(usdc.transfer(msg.sender, payout), "transfer out");

        virtualShares[idx] = minted[idx] + market.virtualSeedPerOutcome - sharesToSell;
        emit OutcomeTraded(
            marketId,
            msg.sender,
            outcomeId,
            false,
            sharesToSell,
            payout,
            _priceFromShares(virtualShares, idx, bWad),
            virtualShares[idx]
        );

        return payout;
    }

    /**
     * @notice Declares the winning outcome for a market.
     * @dev Callable solely by the registered resolver before the overdue window elapses.
     * @param marketId Inventory contract (market identifier).
     * @param winningOutcomeId One-based ID of the winning outcome.
     */
    function resolve(address marketId, uint256 winningOutcomeId) external onlyResolver(marketId) {
        CoreMarketState storage market = _requireMarket(marketId);
        require(!market.isResolved, "resolved");
        require(!_resolutionIsOverdueOnMarket(market), "overdue");

        uint256 outcomesCount = VieMarketInventory(marketId).outcomesCount();
        _validateOutcomeId(outcomesCount, winningOutcomeId);

        market.isResolved = true;
        market.winningOutcomeId = uint16(winningOutcomeId);

        emit Resolved(marketId, winningOutcomeId);
    }

    /**
     * @notice Redeems shares for USDC once a market is resolved.
     * @dev Caller must approve the inventory contract via `setApprovalForAll` beforehand.
     * @param marketId Inventory contract (market identifier).
     * @param outcomeId One-based outcome ID being redeemed.
     * @param shares Number of shares to redeem (6 decimals).
     */
    function redeem(address marketId, uint256 outcomeId, uint256 shares) external {
        CoreMarketState storage market = _requireMarket(marketId);
        require(market.isResolved, "not resolved");

        VieMarketInventory inventory = VieMarketInventory(marketId);
        uint256[] memory minted = inventory.totalShares();
        uint256 idx = _validateOutcomeId(minted.length, outcomeId);
        require(shares > 0, "shares");
        require(minted[idx] >= shares, "inventory");

        inventory.burnShares(msg.sender, outcomeId, shares);

        uint256 payout = (outcomeId == market.winningOutcomeId) ? shares : 0;
        if (payout > market.collateralBalance) {
            payout = market.collateralBalance;
        }

        market.collateralBalance -= payout;

        if (payout > 0) {
            IERC20 usdc = IERC20(_usdcAddress());
            require(usdc.transfer(msg.sender, payout), "transfer out");
        }

        emit Redeemed(marketId, msg.sender, outcomeId, shares, payout);
    }

    /**
     * @notice Returns a user's remaining collateral when the resolver failed to act in time.
     * @dev Callable by any address once 14 days have passed after the close time without resolution.
     * @param marketId Inventory contract (market identifier).
     * @param user Address whose collateral should be refunded.
     */
    function returnCollateralDueToOverdueResolution(address marketId, address user) external {
        CoreMarketState storage market = _requireMarket(marketId);
        require(!market.isResolved, "resolved");
        require(_resolutionIsOverdueOnMarket(market), "not overdue");

        uint256 contribution = collateralContributed[marketId][user];
        require(contribution > 0, "nothing to return");

        collateralContributed[marketId][user] = 0;
        require(market.collateralBalance >= contribution, "bank");
        market.collateralBalance -= contribution;

        IERC20 usdc = IERC20(_usdcAddress());
        require(usdc.transfer(user, contribution), "transfer out");
    }

    /* -------------------------------------------------------------------------- */
    /*                              External (view)                               */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice Returns the current LMSR probabilities for all outcomes.
     * @dev Probabilities are expressed as WAD-scaled values summing to ~1e18.
     * @param marketId Inventory contract (market identifier).
     * @return probabilities Array of WAD-scaled probabilities.
     */
    function prices(address marketId) external view returns (uint256[] memory probabilities) {
        CoreMarketState storage market = _requireMarket(marketId);
        uint256[] memory virtualShares = _virtualShares(marketId, market);
        uint256 n = virtualShares.length;
        if (n == 0) {
            return new uint256[](0);
        }

        (uint256 sumExp, , uint256[] memory expTerms) =
            _lseTermsFromShares(virtualShares, market.liquidityParameterWad);

        probabilities = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            probabilities[i] = FixedPointMathLib.divWad(expTerms[i], sumExp);
        }
    }

    /**
     * @notice Quotes the USDC required to purchase additional shares.
     * @dev Intended for off-chain slippage calculations prior to calling `buy`.
     * @param marketId Inventory contract (market identifier).
     * @param outcomeId One-based outcome ID to buy.
     * @param sharesToBuy Number of shares the user wishes to purchase.
     * @return cost USDC required to complete the buy (6 decimals).
     */
    function quoteBuy(address marketId, uint256 outcomeId, uint256 sharesToBuy)
        public
        view
        returns (uint256 cost)
    {
        CoreMarketState storage market = _requireMarket(marketId);
        uint256[] memory minted = VieMarketInventory(marketId).totalShares();
        uint256 idx = _validateOutcomeId(minted.length, outcomeId);
        require(sharesToBuy > 0, "shares");

        uint256[] memory virtualShares = _virtualSharesFromMinted(minted, market.virtualSeedPerOutcome);
        uint256[] memory q = _sharesToWadArray(virtualShares);
        uint256 bWad = market.liquidityParameterWad;
        uint256 c0 = _cost(q, bWad);
        q[idx] += _shareToWad(sharesToBuy);
        uint256 c1 = _cost(q, bWad);

        cost = _wadToToken(c1 - c0);
    }

    /**
     * @notice Quotes the USDC the user would receive when selling shares.
     * @dev Intended for off-chain slippage calculations prior to calling `sell`.
     * @param user Address of the user selling the shares.
     * @param marketId Inventory contract (market identifier).
     * @param outcomeId One-based outcome ID to sell.
     * @param sharesToSell Number of shares the user wishes to sell.
     * @return payout USDC the user would receive (6 decimals).
     */
    function quoteSell(address user, address marketId, uint256 outcomeId, uint256 sharesToSell)
        public
        view
        returns (uint256 payout)
    {
        CoreMarketState storage market = _requireMarket(marketId);
        VieMarketInventory inventory = VieMarketInventory(marketId);
        uint256[] memory minted = inventory.totalShares();
        uint256 idx = _validateOutcomeId(minted.length, outcomeId);
        require(sharesToSell > 0, "shares");
        require(minted[idx] >= sharesToSell, "inventory");
        require(inventory.balanceOf(user, outcomeId) >= sharesToSell, "balance");

        uint256[] memory virtualShares = _virtualSharesFromMinted(minted, market.virtualSeedPerOutcome);
        uint256[] memory q = _sharesToWadArray(virtualShares);
        uint256 bWad = market.liquidityParameterWad;
        uint256 c0 = _cost(q, bWad);
        q[idx] -= _shareToWad(sharesToSell);
        uint256 c1 = _cost(q, bWad);

        payout = _wadToToken(c0 - c1);
    }

    /**
     * @notice Fetches consolidated market metadata, inventory, and pricing snapshots.
     * @dev Includes both real inventory totals and derived price probabilities.
     * @param marketId Inventory contract (market identifier).
     * @return resolver Address authorized to resolve the market.
     * @return closeTime UNIX timestamp after which trading halts.
     * @return liquidityParameterWad LMSR `b` parameter in WAD precision.
     * @return collateralBalance USDC currently held by the market (6 decimals).
     * @return resolved Boolean flag indicating whether the market is resolved.
     * @return failedToResolveInTime Boolean flag indicating the resolver missed the 14-day deadline.
     * @return winningOutcomeId One-based winning outcome ID (0 when unresolved).
     * @return sharePrices Marginal share prices expressed as 6-decimal USDC.
     * @return question Market question string.
     * @return outcomeNames Array of outcome names.
     * @return outcomeImageUris Array of outcome image URIs.
     * @return totalShares Array of real ERC-1155 supplies per outcome (6 decimals).
     * @return initialRulesUri URI referencing the market rules text.
     * @return initialRulesHash Hash of the market rules text.
     */
    function getMarket(address marketId)
        external
        view
        returns (
            address resolver,
            uint48 closeTime,
            uint256 liquidityParameterWad,
            uint256 collateralBalance,
            bool resolved,
            bool failedToResolveInTime,
            uint16 winningOutcomeId,
            uint256[] memory sharePrices,
            string memory question,
            string[] memory outcomeNames,
            string[] memory outcomeImageUris,
            uint256[] memory totalShares,
            string memory initialRulesUri,
            bytes32 initialRulesHash
        )
    {
        CoreMarketState storage market = _requireMarket(marketId);

        resolver = market.resolver;
        closeTime = market.closeTime;
        liquidityParameterWad = market.liquidityParameterWad;
        collateralBalance = market.collateralBalance;
        resolved = market.isResolved;
        failedToResolveInTime = _resolutionIsOverdueOnMarket(market);
        winningOutcomeId = market.winningOutcomeId;
        initialRulesUri = market.initialRulesUri;
        initialRulesHash = market.initialRulesHash;

        VieMarketInventory inventory = VieMarketInventory(marketId);
        VieMarketInventory.InventoryState memory state = inventory.inventoryState();

        totalShares = state.totalShares;
        outcomeNames = state.outcomeNames;
        outcomeImageUris = state.outcomeImageUris;
        question = state.question;

        uint256 n = state.totalShares.length;
        sharePrices = new uint256[](n);
        if (n > 0) {
            uint256[] memory virtualShares = _virtualSharesFromMinted(state.totalShares, market.virtualSeedPerOutcome);
            (uint256 sumExp, , uint256[] memory terms) =
                _lseTermsFromShares(virtualShares, market.liquidityParameterWad);
            for (uint256 i = 0; i < n; i++) {
                sharePrices[i] = _wadToPrice(FixedPointMathLib.divWad(terms[i], sumExp));
            }
        }
    }

    /**
     * @notice Returns the total minted supply per outcome for the specified market.
     * @dev Convenience wrapper around `VieMarketInventory.totalShares()`.
     * @param marketId Inventory contract (market identifier).
     * @return totals Array of ERC-1155 total supplies per outcome (6 decimals).
     */
    function inventorySnapshot(address marketId) external view returns (uint256[] memory totals) {
        _requireMarket(marketId);
        totals = VieMarketInventory(marketId).totalShares();
    }

    /**
     * @notice Returns a user's share balances and outstanding collateral contribution.
     * @dev Uses the inventory contract for share balances and the market ledger for collateral totals.
     * @param marketId Inventory contract (market identifier).
     * @param user Address whose balances will be returned.
     * @return outcomeBalances Array of ERC-1155 balances per outcome (6 decimals).
     * @return currentUserCollateralContribution Outstanding USDC contributed by the user (6 decimals).
     */
    function getUserBalances(address marketId, address user)
        external
        view
        returns (uint256[] memory outcomeBalances, uint256 currentUserCollateralContribution)
    {
        _requireMarket(marketId);
        outcomeBalances = VieMarketInventory(marketId).balancesOf(user);
        currentUserCollateralContribution = collateralContributed[marketId][user];
    }

    /**
     * @notice Predicts the inventory address for a market without deploying it.
     * @dev Mirrors the CREATE2 deployment address calculation used in `createMarket`.
     * @param salt CREATE2 salt passed to `createMarket`.
     * @return predicted Address the inventory clone will be deployed to.
     */
    function predictInventoryAddress(bytes32 salt) external view returns (address predicted) {
        predicted = Clones.predictDeterministicAddress(inventoryImplementation, salt, address(this));
    }

    /* -------------------------------------------------------------------------- */
    /*                            Internal (state-mutating)                       */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice Authorizes contract upgrades.
     * @dev Restricts implementation upgrades to the contract owner.
     * @param newImplementation Address of the new implementation contract.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @notice Executes the core buy logic shared by both buy paths.
     * @dev Assumes the caller has already arranged any required permit or approval.
     * @param marketId Inventory contract (market identifier).
     * @param outcomeId One-based outcome ID to buy.
     * @param sharesToBuy Number of shares to purchase (6 decimals).
     * @param maxCost Maximum USDC the caller is willing to spend (6 decimals).
     * @param buyer Address paying for the shares and receiving the minted ERC-1155 tokens.
     * @return usdcCost USDC spent (6 decimals).
     */
    function _buy(
        address marketId,
        uint256 outcomeId,
        uint256 sharesToBuy,
        uint256 maxCost,
        address buyer
    ) private returns (uint256 usdcCost) {
        CoreMarketState storage market = _requireMarket(marketId);
        VieMarketInventory inventory = VieMarketInventory(marketId);
        uint256[] memory minted = inventory.totalShares();
        uint256 idx = _validateOutcomeId(minted.length, outcomeId);

        require(sharesToBuy > 0, "shares");

        uint256[] memory virtualShares = _virtualSharesFromMinted(minted, market.virtualSeedPerOutcome);
        uint256[] memory q = _sharesToWadArray(virtualShares);
        uint256 bWad = market.liquidityParameterWad;
        uint256 c0 = _cost(q, bWad);
        q[idx] += _shareToWad(sharesToBuy);
        uint256 c1 = _cost(q, bWad);

        uint256 cost = _wadToToken(c1 - c0);
        require(cost <= maxCost, "slippage");

        IERC20 usdc = IERC20(_usdcAddress());
        require(usdc.transferFrom(buyer, address(this), cost), "transfer in");

        market.collateralBalance += cost;
        collateralContributed[marketId][buyer] += cost;

        inventory.mintShares(buyer, outcomeId, sharesToBuy);

        virtualShares[idx] = minted[idx] + market.virtualSeedPerOutcome + sharesToBuy;
        emit OutcomeTraded(
            marketId,
            buyer,
            outcomeId,
            true,
            sharesToBuy,
            cost,
            _priceFromShares(virtualShares, idx, bWad),
            virtualShares[idx]
        );

        return cost;
    }

    /* -------------------------------------------------------------------------- */
    /*                             Internal (view/pure)                           */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice Returns true when the resolver missed their 14-day resolution window.
     * @param market Stored market state.
     * @return overdue True if the market is overdue for resolution.
     */
    function _resolutionIsOverdueOnMarket(CoreMarketState storage market) private view returns (bool overdue) {
        overdue = block.timestamp > uint256(market.closeTime) + 14 days;
    }

    /**
     * @notice Reads and validates market storage, reverting when the market does not exist.
     * @param marketId Inventory contract (market identifier).
     * @return market Mutable pointer to the market state.
     */
    function _requireMarket(address marketId) internal view returns (CoreMarketState storage market) {
        market = marketById[marketId];
        require(market.resolver != address(0), "market");
    }

    /**
    /**
     * @notice Ensures an outcome ID is within bounds.
     * @param outcomesCount Total number of outcomes configured for the market.
     * @param outcomeId One-based outcome ID to validate.
     * @return idx Zero-based outcome index used internally.
     */
    function _validateOutcomeId(uint256 outcomesCount, uint256 outcomeId) internal pure returns (uint256 idx) {
        require(outcomeId >= 1 && outcomeId <= outcomesCount, "outcomeId");
        idx = outcomeId - 1;
    }

    /**
     * @notice Builds a virtual share vector (real supply + seed) for pricing routines.
     * @param marketId Inventory contract (market identifier).
     * @param market Stored market state.
     * @return shares Virtual share vector used by LMSR math (6 decimals).
     */
    function _virtualShares(address marketId, CoreMarketState storage market)
        internal
        view
        returns (uint256[] memory shares)
    {
        uint256[] memory minted = VieMarketInventory(marketId).totalShares();
        shares = _virtualSharesFromMinted(minted, market.virtualSeedPerOutcome);
    }

    /**
     * @notice Applies the virtual seed to the provided minted vector.
     * @param minted Real ERC-1155 supply per outcome.
     * @param seed Virtual seed shares added to each outcome.
     * @return shares Virtual share vector used by LMSR math.
     */
    function _virtualSharesFromMinted(uint256[] memory minted, uint256 seed)
        internal
        pure
        returns (uint256[] memory shares)
    {
        uint256 n = minted.length;
        shares = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            shares[i] = minted[i] + seed;
        }
    }

    /**
     * @notice Converts share units (6 decimals) to WAD quantities for LMSR math.
     * @param shares Share quantities to convert.
     * @return asWad WAD-scaled equivalents.
     */
    function _sharesToWadArray(uint256[] memory shares) internal pure returns (uint256[] memory asWad) {
        uint256 n = shares.length;
        asWad = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            asWad[i] = _shareToWad(shares[i]);
        }
    }

    /**
     * @notice Converts share units (6 decimals) to WAD.
     * @param shareAmount Share quantity to convert.
     * @return wadAmount WAD-scaled equivalent.
     */
    function _shareToWad(uint256 shareAmount) internal pure returns (uint256 wadAmount) {
        wadAmount = shareAmount * SHARE_TO_WAD_FACTOR;
    }

    /**
     * @notice Converts a WAD value into 6-decimal USDC units.
     * @param wadAmount WAD-scaled value to convert.
     * @return tokenAmount 6-decimal equivalent value.
     */
    function _wadToToken(uint256 wadAmount) internal pure returns (uint256 tokenAmount) {
        tokenAmount = wadAmount / SHARE_TO_WAD_FACTOR;
    }

    /**
     * @notice Converts a WAD probability into a 6-decimal price.
     * @param priceWad WAD-scaled probability.
     * @return priceUsdc Marginal share price in USDC (6 decimals).
     */
    function _wadToPrice(uint256 priceWad) internal pure returns (uint256 priceUsdc) {
        priceUsdc = priceWad / 1e12;
    }

    /**
     * @notice Computes a marginal price from the provided virtual share vector.
     * @param shares Virtual share vector (real supply + seed).
     * @param idx Index of the outcome whose price is needed.
     * @param bWad LMSR `b` parameter in WAD precision.
     * @return priceUsdc Marginal price in 6-decimal USDC units.
     */
    function _priceFromShares(uint256[] memory shares, uint256 idx, uint256 bWad)
        internal
        pure
        returns (uint256 priceUsdc)
    {
        (uint256 sumExp, , uint256[] memory terms) = _lseTermsFromShares(shares, bWad);
        priceUsdc = _wadToPrice(FixedPointMathLib.divWad(terms[idx], sumExp));
    }

    /**
     * @notice Resolves the effective USDC address for the active network.
     * @return usdc Address of the collateral token to use.
     */
    function _usdcAddress() private view returns (address usdc) {
        if (block.chainid == 84532) {
            return 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
        } else if (block.chainid == 8453) {
            return 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
        }
        return _customUSDCAddress;
    }

    /**
     * @notice LMSR cost function.
     * @param qMem Virtual share vector in WAD.
     * @param bWad LMSR `b` parameter in WAD precision.
     * @return c LMSR cost in WAD.
     */
    function _cost(uint256[] memory qMem, uint256 bWad) internal pure returns (uint256 c) {
        (uint256 sumExp, int256 offset) = _lseFromQMem(qMem, bWad);
        int256 lnSum = FixedPointMathLib.lnWad(int256(sumExp)) + offset;
        c = uint256(int256(bWad)) * uint256(lnSum) / FixedPointMathLib.WAD;
    }

    /**
     * @notice Computes the log-sum-exp denominator used by LMSR pricing.
     * @param qMem Virtual share vector in WAD.
     * @param bWad LMSR `b` parameter in WAD precision.
     * @return sumExp Sum of exponentials.
     * @return offset Offset applied for numerical stability.
     */
    function _lseFromQMem(uint256[] memory qMem, uint256 bWad)
        internal
        pure
        returns (uint256 sumExp, int256 offset)
    {
        uint256 n = qMem.length;

        int256 maxZ = type(int256).min;
        for (uint256 i = 0; i < n; i++) {
            int256 zi = int256(FixedPointMathLib.divWad(qMem[i], bWad));
            if (zi > maxZ) {
                maxZ = zi;
            }
        }
        offset = maxZ;

        for (uint256 i = 0; i < n; i++) {
            int256 zi = int256(FixedPointMathLib.divWad(qMem[i], bWad)) - offset;
            uint256 e = uint256(FixedPointMathLib.expWad(zi));
            sumExp += e;
        }
    }

    /**
     * @notice Computes log-sum-exp terms using a share vector.
     * @param shares Virtual share vector in 6-decimal units.
     * @param bWad LMSR `b` parameter in WAD precision.
     * @return sumExp Sum of exponentials.
     * @return offset Offset applied for numerical stability.
     * @return terms Array of exponentials for each outcome.
     */
    function _lseTermsFromShares(uint256[] memory shares, uint256 bWad)
        internal
        pure
        returns (uint256 sumExp, int256 offset, uint256[] memory terms)
    {
        uint256 n = shares.length;
        terms = new uint256[](n);

        int256 maxZ = type(int256).min;
        for (uint256 i = 0; i < n; i++) {
            uint256 shareWad = _shareToWad(shares[i]);
            int256 zi = int256(FixedPointMathLib.divWad(shareWad, bWad));
            if (zi > maxZ) {
                maxZ = zi;
            }
        }
        offset = maxZ;

        for (uint256 i = 0; i < n; i++) {
            uint256 shareWad = _shareToWad(shares[i]);
            int256 zi = int256(FixedPointMathLib.divWad(shareWad, bWad)) - offset;
            uint256 e = uint256(FixedPointMathLib.expWad(zi));
            terms[i] = e;
            sumExp += e;
        }
    }
}
