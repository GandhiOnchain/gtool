// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { IUniversalRouter } from "./interfaces/IUniversalRouter.sol";
import { Commands } from "./libraries/Commands.sol";
import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { IV4Router } from "@uniswap/v4-periphery/src/interfaces/IV4Router.sol";
import { Actions } from "@uniswap/v4-periphery/src/libraries/Actions.sol";
import { ActionConstants } from "@uniswap/v4-periphery/src/libraries/ActionConstants.sol";
import { StateLibrary } from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import { Currency } from "@uniswap/v4-core/src/types/Currency.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IWETH9 } from "../interfaces/IWETH9.sol";
import { IPermit2 } from "../interfaces/external/IPermit2.sol";

import { IVieRegistryV1 } from "../interfaces/IVieRegistryV1.sol";
import { IVieTokenSwapManager } from "./interfaces/IVieTokenSwapManager.sol";

/**
 * @title VieTokenSwapManager
 * @notice Swap manager for Vie tokens using Uniswap V4 and Universal Router
 * @dev Provides functionality to swap between ETH and Vie tokens with permit support
 */
contract VieTokenSwapManager is IVieTokenSwapManager, ReentrancyGuard {
    using StateLibrary for IPoolManager;

    /// @notice The Uniswap Universal Router contract for executing complex multi-step transactions
    IUniversalRouter public immutable router;
    
    /// @notice The Uniswap V4 Pool Manager contract that manages all pools in the singleton
    IPoolManager public immutable poolManager;
    
    /// @notice The Permit2 contract for gasless approvals and improved UX
    IPermit2 public immutable permit2;
    
    /// @notice The Vie token registry contract that stores pool information and validates tokens
    IVieRegistryV1 public immutable registry;
    
    /// @notice The WETH9 contract for wrapping/unwrapping ETH
    IWETH9 public immutable weth;

    /**
     * @notice Constructor to initialize the swap manager with required contract addresses
     * @dev All addresses are stored as immutable to save gas on every function call
     * @param _router The Universal Router contract address for executing swaps
     * @param _poolManager The Pool Manager contract address for Uniswap V4
     * @param _permit2 The Permit2 contract address for gasless approvals
     * @param _registry The Vie Registry contract address for token validation
     * @param _weth The WETH9 contract address for ETH wrapping/unwrapping
     */
    constructor(address _router, address _poolManager, address _permit2, address _registry, address _weth) {
        router      = IUniversalRouter(payable(_router));
        poolManager = IPoolManager(_poolManager);
        permit2     = IPermit2(_permit2);
        registry    = IVieRegistryV1(_registry);
        weth        = IWETH9(_weth);
    }

    /**
     * @notice Swap exact ETH amount for a Vie token
     * @param token Address of the Vie token to swap for
     * @param exactEthAmountIn The exact amount of ETH to swap (must equal msg.value)
     * @param minimumTokenAmountOut The minimum amount of tokens to receive (slippage protection)
     * @return tokenAmountOut The actual amount of tokens received
     */
    function swapExactEthAmountForToken(
        address token,
        uint128 exactEthAmountIn,
        uint128 minimumTokenAmountOut
    ) external payable nonReentrant returns (uint256 tokenAmountOut) {
        // Validate input: amount must be positive and match sent ETH
        if (exactEthAmountIn == 0 || exactEthAmountIn != msg.value) revert InvalidInput();

        // Get token information and validate it's a registered Vie token
        IVieRegistryV1.FT memory ft = registry.getFTByTokenAddress(token);
        validateFT(ft);

        // Wrap ETH to WETH in this contract (WETH is currency1 in all Vie token pools)
        weth.deposit{value: exactEthAmountIn}();

        // we can make this more gas efficient later
        // Approve WETH to Permit2, then approve router via Permit2 for gas efficiency
        IERC20(address(weth)).approve(address(permit2), exactEthAmountIn);
        permit2.approve(address(weth), address(router), uint160(exactEthAmountIn), uint48(block.timestamp + 60));

        // Prepare Universal Router command: V4_SWAP
        bytes memory commands = abi.encodePacked(uint8(Commands.V4_SWAP));

        // Define the sequence of actions for the V4 swap
        bytes memory actions = abi.encodePacked(
            uint8(Actions.SWAP_EXACT_IN_SINGLE), // Execute the swap
            uint8(Actions.SETTLE_ALL),           // Settle all debts to the pool
            uint8(Actions.TAKE_ALL)              // Take all tokens to this contract
        );

        bytes[] memory inputs = new bytes[](1);
        bytes[] memory params = new bytes[](3);

        // Parameters for SWAP_EXACT_IN_SINGLE: WETH → Token (zeroForOne = false)
        params[0] = abi.encode(
            IV4Router.ExactInputSingleParams({
                poolKey: ft.poolKey,                    // Pool to swap in
                zeroForOne: false,                      // WETH (currency1) → Token (currency0)
                amountIn: exactEthAmountIn,             // Exact WETH amount to swap
                amountOutMinimum: minimumTokenAmountOut, // Minimum tokens expected
                hookData: bytes("")                     // No additional hook data
            })
        );
        // Parameters for SETTLE_ALL: settle WETH debt
        params[1] = abi.encode(ft.poolKey.currency1, uint256(exactEthAmountIn));
        // Parameters for TAKE_ALL: take tokens with minimum amount check
        params[2] = abi.encode(ft.poolKey.currency0, uint256(minimumTokenAmountOut));

        inputs[0] = abi.encode(actions, params);

        // Execute the swap with 3-minute deadline
        router.execute(commands, inputs, block.timestamp + 180);

        // Transfer all received tokens to the user
        tokenAmountOut = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(msg.sender, tokenAmountOut);

        emit SwapEthForToken(msg.sender, token, exactEthAmountIn, tokenAmountOut);
    }

    /**
     * @notice Swap exact Vie token amount for ETH (requires prior approval)
     * @dev This function requires the user to have previously approved this contract to spend their tokens
     * See swapExactTokenAmountForEthWithPermitSignature for gasless approval alternative
     * 
     * @param token Address of the Vie token to swap from
     * @param exactTokenAmountIn The exact amount of tokens to swap
     * @param minimumEthAmountOut The minimum amount of ETH to receive (slippage protection)
     * @return ethOut The actual amount of ETH received
     */
    function swapExactTokenAmountForEth(
        address token,
        uint128 exactTokenAmountIn,
        uint128 minimumEthAmountOut
    ) external nonReentrant returns (uint256 ethOut) {
        return _swapExactTokenAmountForEth(token, exactTokenAmountIn, minimumEthAmountOut);
    }

    /**
     * @notice Swap exact Vie token amount for ETH using permit signature (gasless approval)
     * @dev This function uses EIP-2612 permit to approve tokens without requiring a separate transaction
     * This provides better UX by eliminating the need for a separate approval transaction
     * 
     * @param token Address of the Vie token to swap from
     * @param exactTokenAmountIn The exact amount of tokens to swap
     * @param minimumEthAmountOut The minimum amount of ETH to receive (slippage protection)
     * @param sig The permit signature components (v, r, s, deadline)
     * @return The actual amount of ETH received
     */
    function swapExactTokenAmountForEthWithPermitSignature(
        address token,
        uint128 exactTokenAmountIn,
        uint128 minimumEthAmountOut,
        PermitSignaturePayload memory sig
    ) external nonReentrant returns (uint256) {
        IERC20Permit(token).permit(msg.sender, address(this), exactTokenAmountIn, sig.deadline, sig.v, sig.r, sig.s);
        return _swapExactTokenAmountForEth(token, exactTokenAmountIn, minimumEthAmountOut);
    }

    /**
     * @notice Internal function to swap exact Vie token amount for ETH
     * @param token Address of the Vie token to swap from
     * @param exactTokenAmountIn The exact amount of tokens to swap
     * @param minimumEthAmountOut The minimum amount of ETH to receive (slippage protection)
     * @return ethOut The actual amount of ETH received and sent to user
     */
    function _swapExactTokenAmountForEth(
        address token,
        uint128 exactTokenAmountIn,
        uint128 minimumEthAmountOut
    ) private returns (uint256 ethOut) {
        // Validate input: amount must be positive
        if (exactTokenAmountIn == 0) revert InvalidInput();

        // Get token information and validate it's a registered Vie token
        IVieRegistryV1.FT memory ft = registry.getFTByTokenAddress(token);
        validateFT(ft);

        // Transfer tokens from user to this contract (requires prior approval or permit)
        require(IERC20(token).transferFrom(msg.sender, address(this), exactTokenAmountIn), "transferFrom failed");

        // we can make this more gas efficient later
        // Approve tokens to Permit2, then approve router via Permit2 for gas efficiency
        IERC20(token).approve(address(permit2), exactTokenAmountIn);
        permit2.approve(token, address(router), uint160(exactTokenAmountIn), uint48(block.timestamp + 60));

        // Prepare Universal Router command: V4_SWAP
        bytes memory commands = abi.encodePacked(uint8(Commands.V4_SWAP));
        bytes[] memory inputs = new bytes[](1);
        bytes[] memory params = new bytes[](3);

        // Define the sequence of actions for the V4 swap
        bytes memory actions = abi.encodePacked(
            uint8(Actions.SWAP_EXACT_IN_SINGLE), // Execute the swap
            uint8(Actions.SETTLE_ALL),           // Settle all debts to the pool
            uint8(Actions.TAKE_ALL)              // Take all WETH to this contract
        );

        // Parameters for SWAP_EXACT_IN_SINGLE: Token → WETH (zeroForOne = true)
        params[0] = abi.encode(
            IV4Router.ExactInputSingleParams({
                poolKey: ft.poolKey,                    // Pool to swap in
                zeroForOne: true,                       // Token (currency0) → WETH (currency1)
                amountIn: exactTokenAmountIn,           // Exact token amount to swap
                amountOutMinimum: minimumEthAmountOut,  // Minimum WETH expected
                hookData: bytes("")                     // No additional hook data
            })
        );
        // Parameters for SETTLE_ALL: settle token debt
        params[1] = abi.encode(ft.poolKey.currency0, uint256(exactTokenAmountIn));
        // Parameters for TAKE_ALL: take WETH with minimum amount check
        params[2] = abi.encode(ft.poolKey.currency1, uint256(minimumEthAmountOut));

        inputs[0] = abi.encode(actions, params);

        // Track WETH balance before and after swap to calculate received amount
        uint256 wethBefore = weth.balanceOf(address(this));
        router.execute(commands, inputs, block.timestamp + 180);
        uint256 wethAfter = weth.balanceOf(address(this));

        uint256 wethOut = wethAfter - wethBefore;

        // Unwrap WETH to ETH and send to user
        weth.withdraw(wethOut);
        (bool ok, ) = payable(msg.sender).call{value: wethOut}("");
        if (!ok) revert ETHTransferFailed();

        ethOut = wethOut;
        emit SwapTokenForEth(msg.sender, token, exactTokenAmountIn, ethOut);
    }

    /**
     * @notice Validate that the FT struct contains valid data for swapping
     * @dev This function ensures the token is properly registered and has a valid Uniswap V4 pool
     * All Vie tokens must be paired with WETH as currency1 for consistent swap logic
     * 
     * @param ft The FT struct from the registry to validate
     */
    function validateFT(IVieRegistryV1.FT memory ft) private view {
        if (
            ft.tokenAddress == address(0) ||           // Token must have a valid address
            ft.poolId == bytes32(0) ||                 // Pool must exist (non-zero ID)
            Currency.unwrap(ft.poolKey.currency1) != address(weth) // WETH must be currency1
        ) {
            revert InvalidToken();
        }
    }

    /**
     * @notice Receive function to accept ETH from WETH unwrapping
     * @dev This contract can receive ETH when unwrapping WETH after token → ETH swaps
     * No other ETH transfers should be sent to this contract
     */
    receive() external payable {}
}
