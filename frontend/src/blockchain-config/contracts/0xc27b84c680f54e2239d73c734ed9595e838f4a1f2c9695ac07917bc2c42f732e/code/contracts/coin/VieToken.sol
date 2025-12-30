// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import { ERC20PermitUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import { ERC20BurnableUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC165 } from "@openzeppelin/contracts/interfaces/IERC165.sol";

/**
 * @title VieToken
 * @dev ERC20 token contract for Vie tokens with upgradeable functionality
 * Includes permit functionality, burnable tokens, and metadata support
 */
contract VieToken is ERC20Upgradeable, ERC20PermitUpgradeable, ERC20BurnableUpgradeable, OwnableUpgradeable {
    /// @dev Metadata URI for the token
    string public metadata;
    /// @dev Image URL for the token
    string public imageUrl;

    /**
     * @dev Emitted when the token image is updated
     * @param image The new image URL
     */
    event ImageUpdated(string image);
    
    /**
     * @dev Emitted when the token metadata is updated
     * @param metadata The new metadata URI
     */
    event MetadataUpdated(string metadata);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initialize the token contract
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param metadata_ The metadata URI for the token
     * @param image_ The image URL for the token
     * @param maxSupply_ The maximum supply to mint initially
     * @param initialOwner The initial owner of the contract
     * @param initialSupplyOwner The address to receive the initial supply
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        string memory metadata_,
        string memory image_,
        uint256 maxSupply_,
        address initialOwner,
        address initialSupplyOwner
    ) public initializer {
        __ERC20_init(name_, symbol_);
        __ERC20Permit_init(name_);
        __ERC20Burnable_init();
        __Ownable_init(initialOwner);
        
        imageUrl = image_;
        metadata = metadata_;
        _mint(initialSupplyOwner, maxSupply_);
    }

    /**
     * @dev Update the token image URL (only owner)
     * @param newImageUrl The new image URL
     */
    function updateImage(string calldata newImageUrl) external onlyOwner {
        imageUrl = newImageUrl;
        emit ImageUpdated(newImageUrl);
    }

    /**
     * @dev Update the token metadata URI (only owner)
     * @param newMetadata The new metadata URI
     */
    function updateMetadata(string calldata newMetadata) external onlyOwner {
        metadata = newMetadata;
        emit MetadataUpdated(newMetadata);
    }

    /**
     * @dev Permit function for gasless approvals
     * @param owner The token owner
     * @param spender The spender to approve
     * @param value The amount to approve
     * @param deadline The deadline for the permit
     * @param v The v component of the signature
     * @param r The r component of the signature
     * @param s The s component of the signature
     */
    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public override {
        super.permit(owner, spender, value, deadline, v, r, s);
    }

    /**
     * @dev Check if the contract supports a given interface
     * @param _interfaceId The interface ID to check
     * @return True if the interface is supported
     */
    function supportsInterface(bytes4 _interfaceId) public pure returns (bool) {
        return _interfaceId == type(IERC20).interfaceId || _interfaceId == type(IERC165).interfaceId;
    }

    /**
     * @dev Get the token URI (metadata)
     * @return The metadata URI
     */
    function tokenURI() external view returns (string memory) {
        return metadata;
    }

    /**
     * @dev Get the token image URL
     * @return The image URL
     */
    function image() external view returns (string memory) {
        return imageUrl;
    }

    /**
     * @dev Get the token URI (alias for tokenURI)
     * @return The metadata URI
     */
    function uri() external view returns (string memory) {
        return metadata;
    }
}