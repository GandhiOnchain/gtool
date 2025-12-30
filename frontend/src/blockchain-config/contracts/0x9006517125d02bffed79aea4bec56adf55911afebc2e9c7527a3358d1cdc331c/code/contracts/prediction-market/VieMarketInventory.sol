// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { ERC1155Supply } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VieMarketInventory
 * @notice ERC-1155 inventory used by a single prediction market instance.
 */
contract VieMarketInventory is ERC1155, ERC1155Supply {
    /**
     * @notice Fixed decimals used by every outcome share (1_000_000 units equals 1 share).
     */
    uint8 public constant DECIMALS = 6;

    /**
     * @notice Snapshot returned by {@link inventoryState} for off-chain consumption.
     * @param question Market question text.
     * @param outcomeNames Array of outcome names.
     * @param outcomeImageUris Array of outcome image URIs.
     * @param totalShares Array of total shares per outcome (6 decimals).
     */
    struct InventoryState {
        string question;
        string[] outcomeNames;
        string[] outcomeImageUris;
        uint256[] totalShares;
    }

    /**
     * @notice Address of the prediction market contract that controls minting and burning.
     */
    address public market;

    /**
     * @notice Number of outcomes tracked by this inventory (token IDs are 1-based).
     */
    uint256 public outcomesCount;

    /**
     * @notice Cached market question used to render on-chain metadata.
     */
    string private _question;

    /**
     * @notice Outcome names indexed by outcome ID minus one.
     */
    string[] private _outcomeNames;

    /**
     * @notice Outcome image URIs indexed by outcome ID minus one.
     */
    string[] private _outcomeImageUris;

    /**
     * @notice Tracks whether the inventory clone has been initialized.
     */
    bool private _initialized;

    /**
     * @notice Emitted when the inventory is initialized by its controlling market.
     * @param market Address of the market that performed initialization.
     * @param outcomesCount Number of outcomes registered.
     * @param question Market question text captured during initialization.
     */
    event InventoryInitialized(address indexed market, uint256 indexed outcomesCount, string question);

    /**
     * @notice Emitted when the market mints new outcome shares.
     * @param to Recipient of the minted outcome shares.
     * @param outcomeId One-based ID of the outcome being minted.
     * @param amount Number of shares minted (6 decimals).
     */
    event OutcomeSharesMinted(address indexed to, uint256 indexed outcomeId, uint256 amount);

    /**
     * @notice Emitted when the market burns outcome shares.
     * @param from Address whose balance was burned.
     * @param outcomeId One-based ID of the outcome burned.
     * @param amount Number of shares burned (6 decimals).
     */
    event OutcomeSharesBurned(address indexed from, uint256 indexed outcomeId, uint256 amount);

    /**
     * @notice Deploys the inventory with an empty metadata URI (set during initialization).
     */
    constructor() ERC1155("") {}

    /**
     * @notice Restricts function execution to the controlling market contract.
     */
    modifier onlyMarket() {
        require(msg.sender == market, "inventory: not market");
        _;
    }

    /* -------------------------------------------------------------------------- */
    /*                               External (state)                            */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice Initializes the inventory with metadata provided by the prediction market contract.
     * @dev Can only be invoked once by the controlling market.
     * @param market_ Address of the prediction market that owns this inventory.
     * @param question_ Market question used during metadata rendering.
     * @param outcomeNames_ Outcome names aligned with outcome IDs (index + 1).
     * @param outcomeImageUris_ Optional outcome image URIs aligned with outcome IDs.
     */
    function initialize(
        address market_,
        string memory question_,
        string[] memory outcomeNames_,
        string[] memory outcomeImageUris_
    ) external {
        require(!_initialized, "inventory: inited");
        require(market_ != address(0), "inventory: market");
        require(outcomeNames_.length > 0, "inventory: outcomes");
        require(outcomeNames_.length == outcomeImageUris_.length, "inventory: lengths");

        _initialized = true;
        market = market_;
        outcomesCount = outcomeNames_.length;
        _question = question_;

        for (uint256 i = 0; i < outcomeNames_.length; i++) {
            _outcomeNames.push(outcomeNames_[i]);
            _outcomeImageUris.push(outcomeImageUris_[i]);
        }

        emit InventoryInitialized(market_, outcomesCount, question_);
    }

    /**
     * @notice Mints outcome shares to the provided recipient.
     * @dev Only callable by the controlling market contract.
     * @param to Recipient receiving the shares.
     * @param outcomeId One-based outcome ID being minted.
     * @param amount Number of shares to mint (6 decimals).
     */
    function mintShares(address to, uint256 outcomeId, uint256 amount) external onlyMarket {
        _validateOutcome(outcomeId);
        _mint(to, outcomeId, amount, "");
        emit OutcomeSharesMinted(to, outcomeId, amount);
    }

    /**
     * @notice Burns outcome shares from the provided account.
     * @dev Only callable by the controlling market contract.
     * @param from Address whose shares will be burned.
     * @param outcomeId One-based outcome ID being burned.
     * @param amount Number of shares to burn (6 decimals).
     */
    function burnShares(address from, uint256 outcomeId, uint256 amount) external onlyMarket {
        _validateOutcome(outcomeId);
        _burn(from, outcomeId, amount);
        emit OutcomeSharesBurned(from, outcomeId, amount);
    }

    /* -------------------------------------------------------------------------- */
    /*                               External (view)                             */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice Returns the fixed decimal precision used by outcome shares.
     * @dev Always returns six to match USDC precision and on-chain conventions.
     * @return decimalsCount Decimal precision.
     */
    function shareDecimals() external pure returns (uint8 decimalsCount) {
        decimalsCount = DECIMALS;
    }

    /**
     * @notice Returns the total number of minted shares per outcome.
     * @dev Indices are zero-based while token IDs are one-based.
     * @return totals Array of total supplies per outcome (6 decimals).
     */
    function totalShares() external view returns (uint256[] memory totals) {
        totals = new uint256[](outcomesCount);
        for (uint256 i = 0; i < outcomesCount; i++) {
            totals[i] = totalSupply(i + 1);
        }
    }

    /**
     * @notice Retrieves the market question captured at initialization.
     * @dev Returns an empty string if the inventory was not initialized yet.
     * @return questionText Market question text.
     */
    function question() external view returns (string memory questionText) {
        questionText = _question;
    }

    /**
     * @notice Returns the name of the specified outcome.
     * @dev Reverts when the outcome ID is out of bounds.
     * @param outcomeId One-based outcome ID to query.
     * @return name Outcome name string.
     */
    function outcomeName(uint256 outcomeId) external view returns (string memory name) {
        _validateOutcome(outcomeId);
        name = _outcomeNames[outcomeId - 1];
    }

    /**
     * @notice Returns the image URI for the specified outcome.
     * @dev Reverts when the outcome ID is out of bounds.
     * @param outcomeId One-based outcome ID to query.
     * @return imageUri Outcome image URI or empty string when rendering fallback SVG.
     */
    function outcomeImageURI(uint256 outcomeId) external view returns (string memory imageUri) {
        _validateOutcome(outcomeId);
        imageUri = _outcomeImageUris[outcomeId - 1];
    }

    /**
     * @notice Returns a snapshot of question, outcomes, and total supplies for off-chain consumers.
     * @dev Useful for aggregators wanting a single call to gather all metadata.
     * @return state Struct containing question, outcome names, image URIs, and total supplies.
     */
    function inventoryState() external view returns (InventoryState memory state) {
        uint256 n = outcomesCount;
        state.question = _question;

        state.outcomeNames = new string[](n);
        state.outcomeImageUris = new string[](n);
        state.totalShares = new uint256[](n);

        for (uint256 i = 0; i < n; i++) {
            state.outcomeNames[i] = _outcomeNames[i];
            state.outcomeImageUris[i] = _outcomeImageUris[i];
            state.totalShares[i] = totalSupply(i + 1);
        }
    }

    /**
     * @notice Returns the ERC-1155 balances of every outcome for the given account.
     * @dev Alignment is zero-based to simplify off-chain iteration.
     * @param account Address whose balances will be returned.
     * @return balances Array of balances per outcome (6 decimals).
     */
    function balancesOf(address account) external view returns (uint256[] memory balances) {
        uint256 n = outcomesCount;
        balances = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            balances[i] = balanceOf(account, i + 1);
        }
    }

    /**
     * @notice ERC-1155 metadata URI producing dynamic JSON per outcome.
     * @dev Composes a JSON data URI using optional images or fallback SVGs.
     * @param outcomeId One-based token ID to query.
     * @return metadataUri Fully-qualified metadata URI (data:application/json;base64,...).
     */
    function uri(uint256 outcomeId) public view override returns (string memory metadataUri) {
        _validateOutcome(outcomeId);
        uint256 idx = outcomeId - 1;

        string memory outcome = _outcomeNames[idx];
        string memory questionText = _question;

        string memory name = outcome;
        string memory description = string(
            abi.encodePacked("This outcome is ", outcome, ", as an answer to the question ", questionText)
        );

        string memory imageURI = bytes(_outcomeImageUris[idx]).length != 0
            ? _outcomeImageUris[idx]
            : _buildDefaultImage(questionText, outcome);

        string memory json = string(
            abi.encodePacked(
                '{"name":"',
                _escapeJSON(name),
                '","description":"',
                _escapeJSON(description),
                '","image":"',
                imageURI,
                '","attributes":[{"trait_type":"Question","value":"',
                _escapeJSON(questionText),
                '"},{"trait_type":"Outcome ID","value":"',
                Strings.toString(outcomeId),
                '"}]}'
            )
        );

        metadataUri = string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
    }

    /* -------------------------------------------------------------------------- */
    /*                              Internal (state)                             */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice Validates that an outcome ID is within the configured bounds.
     * @param outcomeId One-based outcome ID to validate.
     */
    function _validateOutcome(uint256 outcomeId) internal view {
        require(outcomeId >= 1 && outcomeId <= outcomesCount, "inventory: outcomeId");
    }

    /**
     * @notice Overrides the ERC1155 hook to keep supply tracking in sync.
     * @param from Address transferring from.
     * @param to Address transferring to.
     * @param ids Array of token IDs being transferred.
     * @param amounts Array of token amounts being transferred.
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, amounts);
    }

    /**
     * @notice Exposes supported interfaces, combining ERC1155 and ERC1155Supply capabilities.
     * @param interfaceId Interface identifier to check.
     * @return supported True when the interface is supported.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155)
        returns (bool supported)
    {
        supported = super.supportsInterface(interfaceId);
    }

    /* -------------------------------------------------------------------------- */
    /*                            Internal helpers (view)                         */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice Constructs a fallback SVG image when no custom URI is supplied.
     * @param questionText Market question text to embed in the SVG.
     * @param outcome Outcome name to embed in the SVG.
     * @return imageUri Base64-encoded SVG data URI.
     */
    function _buildDefaultImage(string memory questionText, string memory outcome)
        internal
        pure
        returns (string memory imageUri)
    {
        string memory safeQuestion = _escapeXML(questionText);
        string memory safeOutcome = _escapeXML(outcome);

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">',
            "<defs>",
            '<symbol id="vieLogo" viewBox="0 0 1024 546">',
            '<path d="M248.048 545.451L538.221 0H616.579L326.407 545.451H248.048Z" fill="currentColor"/>',
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M1024 25.5074L692.404 23.3307L649.891 102.03H983.564L1024 25.5074ZM947.478 374.109H586.841L546.402 450.632H906.772L947.478 374.109Z" fill="currentColor"/>',
            '<path d="M920.193 201.781H677.868L635.354 280.582H877.68L920.193 201.781Z" fill="currentColor"/>',
            '<path d="M58.4291 491.069L0 25.5074H89.3781L104.683 190.184L115.702 358.533H119.987L189.163 204.876L276.705 25.5074H370.98L140.291 465.562L58.4291 491.069Z" fill="currentColor"/>',
            "</symbol>",
            "<style>",
            ".bg { fill: #000; }",
            '.logo { color: #fff; }',
            '.q { fill: #fff; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Helvetica Neue", "Noto Sans", "Liberation Sans", sans-serif; font-weight: 500; }',
            '.o { fill: #fff; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Helvetica Neue", "Noto Sans", "Liberation Sans", sans-serif; font-weight: 800; }',
            "</style>",
            "</defs>",
            '<rect class="bg" x="0" y="0" width="1024" height="1024" rx="24" />',
            '<use href="#vieLogo" class="logo" x="880" y="28" width="120" height="64"/>',
            '<text class="q" x="996" y="120" text-anchor="end" font-size="28">',
            safeQuestion,
            "</text>",
            '<text class="o" x="512" y="540" text-anchor="middle" dominant-baseline="middle" font-size="96">',
            safeOutcome,
            "</text>",
            "</svg>"
        );

        imageUri = string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
    }

    /**
     * @notice Escapes strings for safe insertion into JSON attributes.
     * @param value Input string.
     * @return escaped JSON-safe string.
     */
    function _escapeJSON(string memory value) internal pure returns (string memory escaped) {
        bytes memory data = bytes(value);
        bytes memory buffer = new bytes(data.length * 6);
        uint256 length = 0;

        for (uint256 i = 0; i < data.length; i++) {
            bytes1 char = data[i];
            if (char == 0x22 || char == 0x5C) {
                buffer[length++] = 0x5C;
                buffer[length++] = char;
            } else if (char == 0x0A) {
                buffer[length++] = 0x5C;
                buffer[length++] = 0x6E;
            } else if (char == 0x0D) {
                buffer[length++] = 0x5C;
                buffer[length++] = 0x72;
            } else if (char == 0x09) {
                buffer[length++] = 0x5C;
                buffer[length++] = 0x74;
            } else {
                buffer[length++] = char;
            }
        }

        bytes memory output = new bytes(length);
        for (uint256 j = 0; j < length; j++) {
            output[j] = buffer[j];
        }
        escaped = string(output);
    }

    /**
     * @notice Escapes strings for safe insertion into XML/SVG content.
     * @param value Input string.
     * @return escaped XML-safe string.
     */
    function _escapeXML(string memory value) internal pure returns (string memory escaped) {
        bytes memory data = bytes(value);
        bytes memory buffer = new bytes(data.length * 6);
        uint256 length = 0;

        for (uint256 i = 0; i < data.length; i++) {
            bytes1 char = data[i];
            if (char == 0x26) {
                length = _appendBytes(buffer, length, bytes("&amp;"));
            } else if (char == 0x3C) {
                length = _appendBytes(buffer, length, bytes("&lt;"));
            } else if (char == 0x3E) {
                length = _appendBytes(buffer, length, bytes("&gt;"));
            } else if (char == 0x22) {
                length = _appendBytes(buffer, length, bytes("&quot;"));
            } else if (char == 0x27) {
                length = _appendBytes(buffer, length, bytes("&apos;"));
            } else {
                buffer[length++] = char;
            }
        }

        bytes memory output = new bytes(length);
        for (uint256 j = 0; j < length; j++) {
            output[j] = buffer[j];
        }
        escaped = string(output);
    }

    /**
     * @notice Appends arbitrary bytes into a buffer.
     * @param buffer Destination buffer.
     * @param index Current write index.
     * @param data Bytes to append.
     * @return newIndex Updated write index.
     */
    function _appendBytes(bytes memory buffer, uint256 index, bytes memory data) private pure returns (uint256 newIndex) {
        for (uint256 i = 0; i < data.length; i++) {
            buffer[index++] = data[i];
        }
        newIndex = index;
    }
}
