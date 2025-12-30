// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { PoolId } from "@uniswap/v4-core/src/types/PoolId.sol";
import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { IWETH9 } from "../../interfaces/IWETH9.sol";

/**
 * @title IVieTokenPoolHook
 * @dev Interface for the Vie Token Pool Hook contract
 */
interface IVieTokenPoolHook {
    // Events
    /**
     * @dev Emitted when fees are swept from a pool into the vault
     * @param vieToken The Vie token address
     * @param weth The WETH address
     * @param vieTokenRecipientDepositAmount Amount of Vie tokens deposited for the recipient
     * @param wethRecipientDepositAmount Amount of WETH deposited for the recipient
     * @param vieTokenPlatformDepositAmount Amount of Vie tokens deposited for the platform
     * @param wethPlatformDepositAmount Amount of WETH deposited for the platform
     * @param poolId The pool ID where fees were swept from
     */
    event FeesSweptIntoVault(
        address vieToken,
        address weth,
        uint256 vieTokenRecipientDepositAmount,
        uint256 wethRecipientDepositAmount,
        uint256 vieTokenPlatformDepositAmount,
        uint256 wethPlatformDepositAmount,
        PoolId poolId
    );

    /**
     * @dev Emitted when a new pool is created by the factory
     * @param vieToken The Vie token address
     * @param initialPositionId The initial position ID created for the pool
     * @param poolId The created pool ID
     * @param weth The WETH address
     * @param tick The initial tick
     * @param tickSpacing The tick spacing
     * @param initialPrice The initial sqrt price
     */
    event PoolCreatedFactory(
        address vieToken,
        uint256 initialPositionId,
        PoolId poolId,
        IWETH9 weth,
        int24 tick,
        int24 tickSpacing,
        uint160 initialPrice
    );

    // Errors
    /**
     * @dev Thrown when caller is not the factory
     */
    error OnlyFactory();

    /**
     * @dev Thrown when trying to set a token fee recipient that is not set
     */
    error TokenFeeRecipientNotSet();

    /**
     * @dev Thrown when trying to change a token fee recipient that is already set by someone else
     */
    error TokenFeeRecipientAlreadySet();

    /**
     * @dev Thrown when the starting sqrt price is invalid
     */
    error InvalidStartingSqrtPrice();

    /**
     * @dev Thrown when the Vie token address is invalid
     */
    error InvalidVieToken();

    /**
     * @dev Thrown when the token fee recipient address is invalid
     */
    error InvalidTokenFeeRecipient();

    /**
     * @dev Thrown when trying to create a pool that already exists
     */
    error PoolAlreadyExists();

    /**
     * @dev Thrown when trying to perform an action too early after pool creation
     */
    error ActionTooEarly();

    /**
     * @dev Thrown when the static Vie fee share BPS is invalid (> 10000)
     */
    error InvalidStaticVieFeeShareBps();

    /**
     * @dev Thrown when the WETH currency doesn't match the expected WETH address
     */
    error InvalidWethCurrency();

    // State variable getters
    /**
     * @dev Get the static Vie fee share in basis points
     * @return The fee share in basis points
     */
    function staticVieFeeShareBps() external view returns (uint256);

    /**
     * @dev Get the platform fee recipient address
     * @return The platform fee recipient address
     */
    function platformFeeRecipient() external view returns (address);

    /**
     * @dev Get the token fee recipient for a specific pool
     * @param poolId The pool ID
     * @return The token fee recipient address
     */
    function tokenFeeRecipient(PoolId poolId) external view returns (address);

    /**
     * @dev Get the single position ID for a specific pool
     * @param poolId The pool ID
     * @return The position ID
     */
    function singlePositionId(PoolId poolId) external view returns (uint256);

    // Functions
    /**
     * @dev Set the Vie vault contract address
     * @param _vieVault The new Vie vault contract address
     */
    function setVieVault(address _vieVault) external;

    /**
     * @dev Set the static Vie fee share in basis points
     * @param _staticVieFeeShareBps The new fee share in basis points (10000 = 100%)
     */
    function setStaticVieFeeShareBps(uint256 _staticVieFeeShareBps) external;

    /**
     * @dev Set the platform fee recipient address
     * @param _platformFeeRecipient The new platform fee recipient address
     */
    function setPlatformFeeRecipient(address _platformFeeRecipient) external;

    /**
     * @dev Set the token fee recipient for a specific pool (only callable by current recipient)
     * @param poolId The pool ID to update the fee recipient for
     * @param newTokenFeeRecipient The new token fee recipient address
     */
    function setTokenFeeRecipient(PoolId poolId, address newTokenFeeRecipient) external;

    /**
     * @dev Create a new pool and add initial liquidity
     * @param vieToken The Vie token address (must be lower than WETH)
     * @param vieTokenSupply The amount of Vie tokens to provide as initial liquidity
     * @param _tokenFeeRecipient The recipient address for token fees
     * @param startingSqrtPrice The starting sqrt price for the pool
     * @return poolKey The created pool key
     */
    function createPoolAndAddLiquidity(
        address vieToken,
        uint256 vieTokenSupply,
        address _tokenFeeRecipient,
        uint160 startingSqrtPrice
    ) external returns (PoolKey memory poolKey);

    /**
     * @dev Withdraw native gas token (ETH) from the contract (only owner)
     * @param recipient The address to receive the withdrawn ETH
     */
    function withdrawNativeGasToken(address recipient) external;

    /**
     * @dev Withdraw ERC20 tokens from the contract (only owner)
     * @param token The ERC20 token address to withdraw
     * @param recipient The address to receive the withdrawn tokens
     */
    function withdrawERC20(address token, address recipient) external;
}