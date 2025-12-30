// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { IVieSFTMint } from "./interfaces/IVieSFTMint.sol";
import { IVieSFTMintManager } from "./interfaces/IVieSFTMintManager.sol";

/**
 * @title VieSFTMintManagerV1
 * @dev Mint manager for Vie SFT contracts
 */
contract VieSFTMintManagerV1 is IVieSFTMintManager, UUPSUpgradeable, OwnableUpgradeable {
    using SafeERC20 for IERC20;
    
    mapping(bytes32 => Sale) public sales;
    
    event SaleCreated(
        bytes32 indexed saleId,
        address indexed sftContract,
        uint256 indexed tokenId,
        address currency,
        uint256 price,
        uint48 startDate,
        uint48 endDate
    );
    
    event TokensMinted(
        bytes32 indexed saleId,
        address indexed sftContract,
        address indexed buyer,
        uint256 tokenId,
        uint256 amount,
        uint256 totalPaid,
        address nftRecipient
    );
    
    error SaleNotFound();
    error SaleNotActive();
    error InvalidPayment();
    error TransferFailed();
    error OnlySftOwner();
    error UnsupportedCurrency();
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(address _platform) public initializer {
        __Ownable_init(_platform);
    }
    
    /**
     * @dev Required by the OZ UUPS module
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    
    /**
     * @dev Create a fixed price public sale for an SFT
     * @param sftContractAddress The SFT contract address
     * @param tokenId The token ID
     * @param sale The sale details
     */
    function createFixedPricePublicSale(
        address sftContractAddress,
        uint256 tokenId,
        Sale memory sale
    ) external {
        if (msg.sender != sftContractAddress) {
            // Check if caller is the owner of the SFT contract
            address sftOwner = OwnableUpgradeable(sftContractAddress).owner();
            if (msg.sender != sftOwner) {
                revert OnlySftOwner();
            }
        }
        
        // Create sale ID by hashing contract address and token ID
        bytes32 saleId = keccak256(abi.encodePacked(sftContractAddress, tokenId));
        
        // Store the sale
        sale.created = true;
        sales[saleId] = sale;
        
        emit SaleCreated(
            saleId,
            sftContractAddress,
            tokenId,
            sale.currency,
            sale.price,
            sale.startDate,
            sale.endDate
        );
    }
    
    /**
     * @dev Mint SFT tokens by paying the sale price
     * @param sftContractAddress The SFT contract address
     * @param tokenId The token ID
     * @param numToMint The number of tokens to mint
     */
    function mintSft(
        address sftContractAddress,
        uint256 tokenId,
        uint256 numToMint,
        address nftRecipient
    ) external payable {
        require(numToMint > 0, "Must mint at least 1 token");
        
        // Get sale ID
        bytes32 saleId = keccak256(abi.encodePacked(sftContractAddress, tokenId));
        Sale memory sale = sales[saleId];
        
        // Check if sale exists
        if (!sale.created) {
            revert SaleNotFound();
        }
        
        // Validate sale timing
        if (!_isSaleActive(sale)) {
            revert SaleNotActive();
        }
        
        // Calculate required payment
        uint256 requiredPayment = sale.price * numToMint;
        
        // Handle payment
        if (sale.currency == address(0)) {
            // ETH payment
            if (msg.value != requiredPayment) {
                revert InvalidPayment();
            }
            _sendEther(OwnableUpgradeable(sftContractAddress).owner(), msg.value);
        } else {
            revert UnsupportedCurrency();
        }
        
        // Mint tokens
        IVieSFTMint(sftContractAddress).mint(nftRecipient, tokenId, numToMint, "");
        
        emit TokensMinted(
            saleId,
            msg.sender,
            sftContractAddress,
            tokenId,
            numToMint,
            requiredPayment,
            nftRecipient
        );
    }
    
    /**
     * @dev Send ETH to the recipient
     * @param recipient The recipient address
     * @param amount The amount to send
     */
    function _sendEther(address recipient, uint256 amount) internal {
        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert TransferFailed();
        }
    }

    /**
     * @dev Get sale details by contract address and token ID
     * @param sftContractAddress The SFT contract address
     * @param tokenId The token ID
     * @return The sale details
     */
    function getSale(address sftContractAddress, uint256 tokenId) external view returns (Sale memory) {
        bytes32 saleId = keccak256(abi.encodePacked(sftContractAddress, tokenId));
        return sales[saleId];
    }
    
    /**
     * @dev Check if a sale is active by contract address and token ID
     * @param sftContractAddress The SFT contract address
     * @param tokenId The token ID
     * @return True if the sale is active
     */
    function isSaleActive(address sftContractAddress, uint256 tokenId) external view returns (bool) {
        bytes32 saleId = keccak256(abi.encodePacked(sftContractAddress, tokenId));
        Sale storage sale = sales[saleId];
        return sale.created && _isSaleActive(sale);
    }

    /**
     * @dev Check if a sale is currently active
     * @param sale The sale to check
     * @return True if the sale is active
     */
    function _isSaleActive(Sale memory sale) private view returns (bool) {
        uint48 currentTime = uint48(block.timestamp);
        
        // Check start date (0 means no start date restriction)
        if (sale.startDate != 0 && currentTime < sale.startDate) {
            return false;
        }
        
        // Check end date (0 means no end date restriction)
        if (sale.endDate != 0 && currentTime > sale.endDate) {
            return false;
        }
        
        return true;
    }
}
