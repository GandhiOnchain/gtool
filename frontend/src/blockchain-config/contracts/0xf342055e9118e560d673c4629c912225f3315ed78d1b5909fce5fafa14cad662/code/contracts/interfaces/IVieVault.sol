// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";

/**
 * @title IVieVault
 * @dev Interface for the Vie Vault contract that manages ERC20 token deposits and withdrawals
 */
interface IVieVault {
    /**
     * @dev Emitted when tokens are deposited into the vault
     * @param account The account the tokens are deposited for
     * @param currency The address of the deposited token
     * @param sender The address that initiated the deposit
     * @param amount The amount of tokens deposited
     */
    event Deposit(
        address indexed account,
        address indexed currency,
        address indexed sender,
        uint256 amount
    );

    /**
     * @dev Emitted when tokens are withdrawn from the vault
     * @param account The account the tokens are withdrawn from
     * @param currency The address of the withdrawn token
     * @param amount The amount of tokens withdrawn
     */
    event Withdrawal(address indexed account, address indexed currency, uint256 amount);

    /**
     * @dev Add an admin to the vault
     * @param admin The address of the admin to add
     */
    function addAdmin(address admin) external;

    /**
     * @dev Remove an admin from the vault
     * @param admin The address of the admin to remove
     */
    function removeAdmin(address admin) external;

    /**
     * @dev Deposit tokens into the vault for a specific account
     * @param account The account to deposit tokens for
     * @param currency The address of the token to deposit
     * @param amount The amount of tokens to deposit
     */
    function deposit(address account, address currency, uint256 amount) external;

    /**
     * @dev Deposit tokens into the vault for a specific account without transferring the tokens within the function (permissioned)
     * @param account The account to deposit tokens for
     * @param currency The address of the token to deposit
     * @param amount The amount of tokens to deposit
     */
    function virtualDeposit(address account, address currency, uint256 amount) external;

    /**
     * @dev Deposit tokens into the vault for multiple accounts without transferring the tokens within the function (permissioned)
     * @param accounts The accounts to deposit tokens for
     * @param currencies The addresses of the tokens to deposit
     * @param amounts The amounts of tokens to deposit
     */
    function virtualDepositMultiple(address[] calldata accounts, address[] calldata currencies, uint256[] calldata amounts) external;

    /**
     * @dev Withdraw all tokens of a specific currency from an account
     * If the currency is WETH, it will be unwrapped and ETH will be sent instead
     * @param account The account to withdraw tokens from
     * @param currency The address of the token to withdraw
     */
    function withdraw(address account, address currency) external;

    /**
     * @dev Withdraw all tokens of multiple currencies from an account
     * @param account The account to withdraw tokens from
     * @param currencies Array of token addresses to withdraw
     */
    function withdrawMany(address account, address[] calldata currencies) external;

    /**
     * @dev Get the balance of a specific currency for an account
     * @param account The account to check the balance for
     * @param currency The address of the token
     * @return The balance of the token for the account
     */
    function balanceOf(address account, address currency) external view returns (uint256);

    /**
     * @dev Get all currencies that an account has a non-zero balance for
     * @param account The account to check
     * @return Array of token addresses with non-zero balances
     */
    function currenciesHeld(address account) external view returns (address[] memory);

    /**
     * @dev Get all currencies and their balances for an account
     * @param account The account to check
     * @return currencies Array of token addresses
     * @return amounts Array of corresponding balances
     */
    function balances(address account) external view returns (address[] memory currencies, uint256[] memory amounts);

    /**
     * @dev Get the admins of the vault
     * @return Array of admin addresses
     */
    function admins() external view returns (address[] memory);
}