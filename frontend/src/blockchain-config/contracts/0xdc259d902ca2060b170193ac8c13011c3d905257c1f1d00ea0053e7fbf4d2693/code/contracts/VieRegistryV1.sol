// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import { ERC1155Supply } from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { PoolId, PoolIdLibrary } from "@uniswap/v4-core/src/types/PoolId.sol";
import { Currency } from "@uniswap/v4-core/src/types/Currency.sol";

import { IVieRegistryV1 } from "./interfaces/IVieRegistryV1.sol";

/**
 * @title VieRegistryV1
 * @dev Registry contract for managing Vie SFT and token contracts
 * This contract tracks ownership and registration of tokens and SFTs for users
 */
contract VieRegistryV1 is IVieRegistryV1, UUPSUpgradeable, OwnableUpgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.Bytes32Set;
    using PoolIdLibrary for PoolKey;
    
    /// @dev Set of addresses authorized to register tokens and SFTs
    EnumerableSet.AddressSet private _registrars;

    /// @dev Mapping from pool ID to pool key
    mapping(bytes32 => PoolKey) private poolByPoolId;
    /// @dev Mapping from token address to pool ID
    mapping(address => bytes32) private poolIdByTokenAddress;
    /// @dev Mapping from user address to set of token addresses they own
    mapping(address => EnumerableSet.AddressSet) private userTokenAddresses;
    /// @dev Mapping from user address to set of SFT addresses they own
    mapping(address => EnumerableSet.AddressSet) private userSftAddresses;
    
    /**
     * @dev Emitted when a registrar is added
     * @param registrar The address of the added registrar
     */
    event RegistrarAdded(address indexed registrar);
    
    /**
     * @dev Emitted when a registrar is removed
     * @param registrar The address of the removed registrar
     */
    event RegistrarRemoved(address indexed registrar);
    
    /**
     * @dev Emitted when a token is registered
     * @param user The owner of the token
     * @param tokenAddress The address of the token
     * @param poolId The pool ID associated with the token
     */
    event TokenRegistered(address indexed user, address indexed tokenAddress, bytes32 poolId);
    
    /**
     * @dev Emitted when an SFT is registered
     * @param user The owner of the SFT
     * @param sftAddress The address of the SFT
     */
    event SFTRegistered(address indexed user, address indexed sftAddress);
    
    /**
     * @dev Thrown when caller is not a registrar
     */
    error OnlyRegistrar();
    
    /**
     * @dev Thrown when pool ID is invalid
     */
    error InvalidPoolId();
    
    /**
     * @dev Modifier to restrict access to only registrars
     */
    modifier onlyRegistrar() {
        if (!_registrars.contains(msg.sender)) {
            revert OnlyRegistrar();
        }
        _;
    }
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @dev Initialize the registry contract
     * @param _platform The platform address that will be the owner
     */
    function initialize(address _platform) public initializer {
        __Ownable_init(_platform);
    }
    
    /**
     * @dev Required by the OZ UUPS module
     * @param newImplementation The address of the new implementation (unused)
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    
    /**
     * @dev Add a registrar to the set
     * @param registrar The address to add as a registrar
     */
    function addRegistrar(address registrar) external onlyOwner {
        require(registrar != address(0), "Invalid registrar address");
        require(_registrars.add(registrar), "Registrar already exists");
        emit RegistrarAdded(registrar);
    }
    
    /**
     * @dev Remove a registrar from the set
     * @param registrar The address to remove as a registrar
     */
    function removeRegistrar(address registrar) external onlyOwner {
        require(_registrars.remove(registrar), "Registrar does not exist");
        emit RegistrarRemoved(registrar);
    }
    
    /**
     * @dev Check if an address is a registrar
     * @param registrar The address to check
     * @return True if the address is a registrar
     */
    function isRegistrar(address registrar) external view returns (bool) {
        return _registrars.contains(registrar);
    }
    
    /**
     * @dev Get all registrars
     * @return Array of registrar addresses
     */
    function getRegistrars() external view returns (address[] memory) {
        return _registrars.values();
    }
    
    /**
     * @dev Register an SFT contract for a user
     * @param sftAddress The address of the SFT contract to register
     */
    function registerSFT(address sftAddress) external onlyRegistrar {
        require(sftAddress != address(0), "Invalid SFT address");
        
        address user = OwnableUpgradeable(sftAddress).owner();
        require(user != address(0), "Invalid SFT owner");
        
        require(userSftAddresses[user].add(sftAddress), "SFT already registered");
        emit SFTRegistered(user, sftAddress);
    }
    
    /**
     * @dev Register a token with pool key for a user
     * @param tokenAddress The address of the token contract
     * @param poolKey The pool key associated with the token
     */
    function registerToken(address tokenAddress, PoolKey memory poolKey) external onlyRegistrar {
        require(tokenAddress != address(0), "Invalid token address");

        address user = OwnableUpgradeable(tokenAddress).owner();
        require(user != address(0), "Invalid token owner");
        
        bytes32 poolId = PoolId.unwrap(poolKey.toId());
        require(userTokenAddresses[user].add(tokenAddress), "Token already registered");
        
        poolIdByTokenAddress[tokenAddress] = poolId;
        poolByPoolId[poolId] = poolKey;
        emit TokenRegistered(user, tokenAddress, poolId);
    }
    
    /**
     * @dev Get all SFT addresses for a user
     * @param user The user address
     */
    function getUserSFTAddresses(address user) external view returns (address[] memory) {
        return userSftAddresses[user].values();
    }
    
    /**
     * @dev Get all tokens (both FTs and SFTs) for a user
     * @param user The user address
     */
    function getUserTokens(address user) external view returns (
        FT[] memory fts, 
        address[] memory sftAddresses
    ) {
        fts = getUserFTs(user);
        sftAddresses = userSftAddresses[user].values();
    }
    
    /**
     * @dev Get all tokens for a user with their supplies
     * @param user The user address
     */
    function getUserTokensWithSupplies(address user) external view returns (FT[] memory fts, address[] memory sftAddresses, uint256[] memory sftSupplies) {
        fts = getUserFTs(user);
        sftAddresses = userSftAddresses[user].values();
        
        sftSupplies = new uint256[](sftAddresses.length);
        for (uint256 i = 0; i < sftAddresses.length; i++) {
            try ERC1155Supply(sftAddresses[i]).totalSupply() returns (uint256 supply) {
                sftSupplies[i] = supply;
            } catch {
                sftSupplies[i] = 0;
            }
        }
    }

    /**
     * @dev Get all FTs (fungible tokens) for a user
     * @param user The user address
     */
    function getUserFTs(address user) public view returns (FT[] memory fts) {
        address[] memory tokenAddresses = userTokenAddresses[user].values();
        fts = new FT[](tokenAddresses.length);
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            bytes32 poolId = poolIdByTokenAddress[tokenAddresses[i]];
            PoolKey memory poolKey = poolByPoolId[poolId];
            fts[i] = FT({
                tokenAddress: tokenAddresses[i],
                poolKey: poolKey,
                poolId: poolId
            });
        }
    }

    /**
     * @dev Get FT by pool ID
     * @param poolId The pool ID
     * @return ft The FT struct
     */
    function getFTByPoolId(bytes32 poolId) external view returns (FT memory ft) {
        PoolKey memory poolKey = poolByPoolId[poolId];
        bytes32 expectedPoolId = PoolId.unwrap(poolKey.toId());
        address tokenAddress = Currency.unwrap(poolKey.currency0);
        if (poolIdByTokenAddress[tokenAddress] != expectedPoolId) {
            tokenAddress = Currency.unwrap(poolKey.currency1);
            if (poolIdByTokenAddress[tokenAddress] != expectedPoolId) {
                revert InvalidPoolId();
            }
        }
        ft = FT({
            tokenAddress: tokenAddress,
            poolKey: poolKey,
            poolId: poolId
        });
        return ft;
    }

    /**
     * @dev Get FT by token address
     * @param tokenAddress The token address
     * @return ft The FT struct
     */
    function getFTByTokenAddress(address tokenAddress) external view returns (FT memory ft) {
        bytes32 poolId = poolIdByTokenAddress[tokenAddress];
        PoolKey memory poolKey = poolByPoolId[poolId];
        ft = FT({
            tokenAddress: tokenAddress,
            poolKey: poolKey,
            poolId: poolId
        });
        return ft;
    }
}
