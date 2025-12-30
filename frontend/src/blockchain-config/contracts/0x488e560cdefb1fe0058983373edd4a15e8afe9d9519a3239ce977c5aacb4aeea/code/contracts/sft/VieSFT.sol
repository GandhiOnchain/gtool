// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { ERC1155Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import { ERC1155BurnableUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import { ERC1155SupplyUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import { IVieSFTMint } from "./interfaces/IVieSFTMint.sol";
import { IVieSFTMintManager } from "./interfaces/IVieSFTMintManager.sol";

/**
 * @title VieSFT
 * @dev ERC1155 Semi-Fungible Token contract for Vie platform
 * Supports multiple token IDs with individual supply limits, minter management, and metadata
 */
contract VieSFT is ERC1155Upgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable, OwnableUpgradeable, IVieSFTMint {
    using EnumerableSet for EnumerableSet.AddressSet;

    /// @dev Contract-level metadata URI
    string public contractURI;
    
    /// @dev Set of addresses authorized to mint tokens
    EnumerableSet.AddressSet private _minters;
    
    /**
     * @dev Token details structure
     * @param maxSupply Maximum supply for the token (0 = unlimited)
     * @param exists Whether the token has been created
     * @param overridingTokenUri Custom URI for this specific token
     */
    struct TokenDetails {
        uint248 maxSupply;
        bool exists;
        string overridingTokenUri;
    }
    
    /// @dev Mapping from token ID to token details
    mapping(uint256 => TokenDetails) public tokenDetails;
    
    /**
     * @dev Emitted when a minter is added
     * @param minter The address of the added minter
     */
    event MinterAdded(address indexed minter);
    
    /**
     * @dev Emitted when a minter is removed
     * @param minter The address of the removed minter
     */
    event MinterRemoved(address indexed minter);
    
    /**
     * @dev Emitted when a new token is created
     * @param tokenId The ID of the created token
     * @param maxSupply The maximum supply for the token
     */
    event TokenCreated(uint256 indexed tokenId, uint256 maxSupply);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the SFT contract
     * @param uri_ The base URI for token metadata
     * @param initialOwner The initial owner of the contract
     * @param initialMinter The initial minter (can be zero address)
     * @param contractURI_ The contract-level metadata URI
     */
    function initialize(
        string memory uri_,
        address initialOwner,
        address initialMinter,
        string memory contractURI_
    ) public initializer {
        __ERC1155_init(uri_);
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
        __Ownable_init(initialOwner);
        
        if (initialMinter != address(0)) {
            _addMinter(initialMinter);
        }
        contractURI = contractURI_;
    }
                
    /**
     * @dev Add a minter to the set
     * @param minter The address to add as a minter
     */
    function addMinter(address minter) external onlyOwner {
        _addMinter(minter);
    }
    
    /**
     * @dev Remove a minter from the set
     * @param minter The address to remove as a minter
     */
    function removeMinter(address minter) external onlyOwner {
        require(_minters.remove(minter), "Minter does not exist");
        emit MinterRemoved(minter);
    }
    
    /**
     * @dev Create a new token with details
     * @param maxSupply The maximum supply for this token, 0 = open edition
     * @param metadataUri The metadata URI for this token
     */
    function create(
        uint256 tokenId,
        uint248 maxSupply,
        string calldata metadataUri
    ) public onlyOwner {
        _create(tokenId, maxSupply, metadataUri);
    }

    /**
     * @dev Create a new token with a fixed price sale
     * @param tokenId The token ID
     * @param maxSupply The maximum supply for this token, 0 = open edition
     * @param metadataUri The metadata URI for this token
     * @param sale The sale details
     * @param sftMintManager The SFT mint manager address   
     */
    function createWithFixedPriceSale(
        uint256 tokenId,
        uint248 maxSupply,
        string calldata metadataUri,
        IVieSFTMintManager.Sale calldata sale,
        address sftMintManager
    ) public onlyOwner {
        _create(tokenId, maxSupply, metadataUri);
        IVieSFTMintManager(sftMintManager).createFixedPricePublicSale(address(this), tokenId, sale);
    }

    /**
     * @dev Update the max supply for a token
     * @param tokenId The token ID
     * @param newMaxSupply The new max supply
     */
    function updateMaxSupply(uint256 tokenId, uint248 newMaxSupply) external onlyOwner {
        require(tokenDetails[tokenId].exists, "Token does not exist");
        _updateTokenSupply(tokenId, newMaxSupply);
    }

    /**
     * @dev Update the token URI for a token
     * @param tokenId The token ID
     * @param newTokenURI The new token URI
     */
    function updateTokenURI(uint256 tokenId, string calldata newTokenURI) external onlyOwner {
        require(tokenDetails[tokenId].exists, "Token does not exist");
        _updateTokenURI(tokenId, newTokenURI);
    }

    /**
     * @dev Update the token details for a token
     * @param tokenId The token ID
     * @param newMaxSupply The new max supply
     * @param newTokenURI The new token URI
     */
    function updateTokenDetails(uint256 tokenId, uint248 newMaxSupply, string calldata newTokenURI) external onlyOwner {
        require(tokenDetails[tokenId].exists, "Token does not exist");
        _updateTokenSupply(tokenId, newMaxSupply);
        _updateTokenURI(tokenId, newTokenURI);
    }

    /**
     * @dev Mint tokens to a specific address
     * @param to The address to mint tokens to
     * @param id The token ID
     * @param amount The amount to mint
     * @param data Additional data to pass to the receiver
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external {
        require(_minters.contains(msg.sender), "Caller is not a minter");
        require(isTokenMintable(id), "Token not mintable");
        require(tokenDetails[id].maxSupply == 0 || totalSupply(id) + amount <= tokenDetails[id].maxSupply, "Exceeds max supply");
        
        _mint(to, id, amount, data);
    }

    /**
     * @dev Mint multiple tokens to a specific address
     * @param to The address to mint tokens to
     * @param ids Array of token IDs
     * @param amounts Array of amounts to mint
     * @param data Additional data to pass to the receiver
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external {
        require(_minters.contains(msg.sender), "Caller is not a minter");
        
        for (uint256 i = 0; i < ids.length; i++) {
            require(isTokenMintable(ids[i]), "Token not mintable");
            require(tokenDetails[ids[i]].maxSupply == 0 || totalSupply(ids[i]) + amounts[i] <= tokenDetails[ids[i]].maxSupply, "Exceeds max supply");
        }
        
        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @dev Set the contract URI
     * @param newContractURI The new contract URI
     */
    function setContractURI(string memory newContractURI) external onlyOwner {
        contractURI = newContractURI;
    }

    /**
     * @dev Check if an address is a minter
     * @param minter The address to check
     * @return True if the address is a minter
     */
    function isMinter(address minter) external view returns (bool) {
        return _minters.contains(minter);
    }
    
    /**
     * @dev Get all minters
     * @return Array of minter addresses
     */
    function getMinters() external view returns (address[] memory) {
        return _minters.values();
    }
    
    /**
     * @dev Get token details
     * @param tokenId The token ID
     * @return TokenDetails struct
     */
    function getTokenDetails(uint256 tokenId) external view returns (TokenDetails memory) {
        return tokenDetails[tokenId];
    }

    /**
     * @dev Check if a token exists and has details set
     * @param tokenId The token ID
     * @return True if token exists and has details
     */
    function isTokenMintable(uint256 tokenId) public view returns (bool) {
        return tokenDetails[tokenId].exists;
    }
    
    /**
     * @dev Override uri function to return token-specific metadata URI
     * @param tokenId The token ID
     * @return The metadata URI for the token
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        if (tokenDetails[tokenId].exists && bytes(tokenDetails[tokenId].overridingTokenUri).length != 0) {
            return tokenDetails[tokenId].overridingTokenUri;
        }
        return super.uri(tokenId);
    }

    /**
     * @dev Add a minter to the set
     * @param minter The address to add as a minter
     */
    function _addMinter(address minter) internal {
        require(minter != address(0), "Invalid minter address");
        require(_minters.add(minter), "Minter already exists");
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Override _update to handle both burnable and supply tracking
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override(ERC1155Upgradeable, ERC1155SupplyUpgradeable) {
        super._update(from, to, ids, values);
    }

    /**
     * @dev Update the max supply for a token
     * @param tokenId The token ID
     * @param amount The new max supply
     */
    function _updateTokenSupply(uint256 tokenId, uint248 amount) internal {
        if (tokenDetails[tokenId].maxSupply != 0) {
            require(totalSupply(tokenId) <= tokenDetails[tokenId].maxSupply, "New max supply invalid");
        }
        tokenDetails[tokenId].maxSupply = amount;
    }

    /**
     * @dev Update the token URI for a token
     * @param tokenId The token ID
     * @param newTokenURI The new token URI 
     */
    function _updateTokenURI(uint256 tokenId, string calldata newTokenURI) internal {
        tokenDetails[tokenId].overridingTokenUri = newTokenURI;
    }
    
    /**
     * @dev Create a new token with details
     * @param tokenId The token ID
     * @param maxSupply The maximum supply for this token, 0 = open edition
     * @param metadataUri The metadata URI for this token
     */
    function _create(
        uint256 tokenId,
        uint248 maxSupply,
        string calldata metadataUri
    ) private {
        require(!tokenDetails[tokenId].exists, "Token already exists");
        require(bytes(metadataUri).length > 0, "Empty uri");
        
        tokenDetails[tokenId] = TokenDetails({
            maxSupply: maxSupply,
            overridingTokenUri: metadataUri,
            exists: true
        });
        
        emit TokenCreated(tokenId, maxSupply);
    }
} 