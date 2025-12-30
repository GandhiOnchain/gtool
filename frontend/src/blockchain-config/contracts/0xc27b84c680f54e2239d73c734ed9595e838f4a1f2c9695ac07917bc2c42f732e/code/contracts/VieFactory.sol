// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { PoolId, PoolIdLibrary } from "@uniswap/v4-core/src/types/PoolId.sol";

import { VieSFT } from "./sft/VieSFT.sol";
import { VieToken } from "./coin/VieToken.sol";
import { IVieSFTMintManager } from "./sft/interfaces/IVieSFTMintManager.sol";
import { IVieRegistryV1 } from "./interfaces/IVieRegistryV1.sol";
import { IVieTokenPoolHook } from "./coin/interfaces/IVieTokenPoolHook.sol";

/**
 * @title VieFactory
 * @dev Factory contract for deploying Vie SFT and token contracts using CREATE2 deterministic addresses
 * Handles deployment of both Semi-Fungible Tokens (SFTs) and Fungible Tokens (FTs) with associated pools
 */
contract VieFactory is Ownable, ReentrancyGuard {
    using PoolIdLibrary for PoolKey;

    /**
     * @dev Emitted when a new SFT contract is deployed
     * @param sftAddress The address of the deployed SFT contract
     * @param owner The owner of the SFT contract
     * @param tokenId The token ID created (always 1 for initial deployment)
     * @param metadataUri The metadata URI for the token
     * @param maxSupply The maximum supply for the token (0 = unlimited)
     */
    event SFTDeployed(
        address indexed sftAddress,
        address indexed owner,
        uint256 indexed tokenId,
        string metadataUri,
        uint256 maxSupply
    );
    
    /**
     * @dev Emitted when a new token contract is deployed
     * @param tokenAddress The address of the deployed token contract
     * @param owner The owner of the token contract
     * @param poolId The Uniswap pool ID associated with the token
     * @param name The name of the token
     * @param symbol The symbol of the token
     */
    event TokenDeployed(
        address indexed tokenAddress, 
        address indexed owner,
        bytes32 indexed poolId,
        string name,
        string symbol
    );
    
    /**
     * @dev Thrown when contract deployment fails
     */
    error DeploymentFailed();
    
    /**
     * @dev Thrown when invalid parameters are provided
     */
    error InvalidParameters();

    /// @dev The Vie registry contract for tracking deployed contracts
    IVieRegistryV1 public registry;
    /// @dev The implementation address for SFT contracts
    address public sftImplementation;
    /// @dev The implementation address for token contracts
    address public tokenImplementation;
    /// @dev The SFT mint manager contract address
    address public sftMintManager;
    /// @dev The Uniswap V4 pool hook contract address
    address public vieTokenPoolHook;

    /// @dev The WETH contract address (immutable)
    address public immutable weth;

    /**
     * @dev Constructor to initialize the factory with required contract addresses
     * @param _weth The WETH contract address
     * @param _vieTokenPoolHook The Uniswap V4 pool hook contract address
     * @param _sftImplementation The SFT implementation contract address
     * @param _tokenImplementation The token implementation contract address
     * @param _sftMintManager The SFT mint manager contract address
     * @param _registry The Vie registry contract address
     */
    constructor(address _weth, address _vieTokenPoolHook, address _sftImplementation, address _tokenImplementation, address _sftMintManager, address _registry) Ownable(msg.sender) {
        weth = _weth;
        vieTokenPoolHook = _vieTokenPoolHook;
        sftImplementation = _sftImplementation;
        tokenImplementation = _tokenImplementation;
        sftMintManager = _sftMintManager;
        registry = IVieRegistryV1(_registry);
    }

    /**
     * @dev Set the registry contract address (only owner)
     * @param _registry The new registry contract address
     */
    function setRegistry(IVieRegistryV1 _registry) external onlyOwner {
        registry = _registry;
    }

    /**
     * @dev Set the SFT implementation contract address (only owner)
     * @param _sftImplementation The new SFT implementation contract address
     */
    function setSFTImplementation(address _sftImplementation) external onlyOwner {
        sftImplementation = _sftImplementation;
    }

    /**
     * @dev Set the token implementation contract address (only owner)
     * @param _tokenImplementation The new token implementation contract address
     */
    function setTokenImplementation(address _tokenImplementation) external onlyOwner {
        tokenImplementation = _tokenImplementation;
    }

    /**
     * @dev Set the SFT mint manager contract address (only owner)
     * @param _sftMintManager The new SFT mint manager contract address
     */
    function setSFTMintManager(address _sftMintManager) external onlyOwner {
        sftMintManager = _sftMintManager;
    }

    /**
     * @dev Set the Uniswap V4 pool hook contract address (only owner)
     * @param _vieTokenPoolHook The new Uniswap V4 pool hook contract address
     */
    function setVieTokenPoolHook(address _vieTokenPoolHook) external onlyOwner {
        vieTokenPoolHook = _vieTokenPoolHook;
    }
    
    /**
     * @dev Deploys a new SFT contract using CREATE2 deterministic address with a fixed price sale
     * @param salt Unique salt for CREATE2 deployment (determines the final address)
     * @param owner The final owner of the SFT contract after deployment
     * @param maxSupply Maximum supply for the token (0 = unlimited/open edition)
     * @param metadataUri Metadata URI for the initial token (token ID 1)
     * @param contractURI Contract-level metadata URI
     * @param sale Sale configuration for the fixed price public sale
     * @return sftAddress The deployed SFT contract address
     */
    function deploySFTWithFixedPriceSale(
        bytes32 salt,
        address owner,
        uint248 maxSupply,
        string calldata metadataUri,
        string calldata contractURI,
        IVieSFTMintManager.Sale calldata sale
    ) external nonReentrant returns (address sftAddress) {
        if (owner == address(0) || sftImplementation == address(0) || sftMintManager == address(0)) {
            revert InvalidParameters();
        }
        
        // Deploy the SFT contract using CREATE2 for deterministic address
        sftAddress = Clones.cloneDeterministic(sftImplementation, salt);        
        if (sftAddress == address(0)) {
            revert DeploymentFailed();
        }
        
        // Initialize the SFT contract with factory as temporary owner
        VieSFT(sftAddress).initialize("", address(this), sftMintManager, contractURI);
        
        // Create the first token with fixed price sale
        VieSFT(sftAddress).createWithFixedPriceSale(1, maxSupply, metadataUri, sale, sftMintManager);
        
        // Transfer ownership to the final owner
        VieSFT(sftAddress).transferOwnership(owner);
        
        emit SFTDeployed(sftAddress, owner, 1, metadataUri, maxSupply);
        
        // Register the SFT in the registry
        registry.registerSFT(sftAddress);
    }
    
    /**
     * @dev Deploys a new token contract and creates a Uniswap V4 pool paired with WETH
     * Creates a deterministic token address, initializes it, creates a Uniswap pool, and provides initial liquidity
     * @param salt Unique salt for CREATE2 deployment (determines the final address)
     * @param owner The final owner of the token contract after deployment
     * @param maxSupply Maximum supply for the token (minted to pool hook for initial liquidity)
     * @param startingSqrtPrice Starting sqrt price for the Uniswap pool (price ratio)
     * @param name The name of the ERC20 token
     * @param symbol The symbol of the ERC20 token
     * @param metadata Metadata URI for the token (for NFT-like properties)
     * @param imageUrl Image URL for the token icon/avatar
     * @return tokenAddress The deployed token contract address
     * @return poolId The created Uniswap V4 pool ID
     */
    function deployToken(
        bytes32 salt,
        address owner,
        uint256 maxSupply,
        uint160 startingSqrtPrice,
        string memory name,
        string memory symbol,
        string memory metadata,
        string memory imageUrl
    ) external payable nonReentrant returns (address tokenAddress, bytes32 poolId) {
        if (owner == address(0)) {
            revert InvalidParameters();
        }
        
        // Deploy the token contract using CREATE2 for deterministic address
        tokenAddress = Clones.cloneDeterministic(tokenImplementation, salt);
        if (tokenAddress == address(0)) {
            revert DeploymentFailed();
        }
        
        // Initialize the token with pool hook as initial supply recipient
        VieToken(tokenAddress).initialize(name, symbol, metadata, imageUrl, maxSupply, owner, vieTokenPoolHook);
        
        // Create Uniswap V4 pool and add initial liquidity through the hook
        PoolKey memory poolKey = IVieTokenPoolHook(vieTokenPoolHook).createPoolAndAddLiquidity(tokenAddress, maxSupply, owner, startingSqrtPrice);
        poolId = PoolId.unwrap(poolKey.toId());
        
        emit TokenDeployed(tokenAddress, owner, poolId, name, symbol);
        
        // Register the token and its pool in the registry
        registry.registerToken(tokenAddress, poolKey);
    }

    /**
     * @dev Predicts the deterministic address of an SFT contract before deployment
     * Useful for pre-calculating addresses for UI or integration purposes
     * @param salt Unique salt for CREATE2 deployment (same as used in deploySFTWithFixedPriceSale)
     * @return The predicted SFT contract address that will be deployed
     */
    function predictSFTAddress(bytes32 salt) external view returns (address) {
        return Clones.predictDeterministicAddress(sftImplementation, salt);
    }
    
    /**
     * @dev Predicts the deterministic address of a token contract before deployment
     * Useful for pre-calculating addresses for UI or integration purposes
     * @param salt Unique salt for CREATE2 deployment (same as used in deployToken)
     * @return The predicted token contract address that will be deployed
     */
    function predictTokenAddress(bytes32 salt) external view returns (address) {
        return Clones.predictDeterministicAddress(tokenImplementation, salt);
    }
}