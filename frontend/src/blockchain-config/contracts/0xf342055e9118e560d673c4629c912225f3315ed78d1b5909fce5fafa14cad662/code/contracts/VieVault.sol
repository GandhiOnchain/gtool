// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { IVieVault } from "./interfaces/IVieVault.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IWETH9 } from "./interfaces/IWETH9.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VieVault
 * @dev Vault contract for managing ERC20 token deposits and withdrawals
 */
contract VieVault is IVieVault, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.AddressSet;

    address public immutable weth;
    mapping(address => mapping(address => uint256)) private _balances;
    mapping(address => EnumerableSet.AddressSet) private _userCurrencies;
    EnumerableSet.AddressSet private _admins;

    modifier onlyAdmin() {
        require(_admins.contains(msg.sender), "Not an admin");
        _;
    }

    /**
     * @dev Constructor
     * @param _weth The WETH contract address
     * @param initialOwner The initial owner of the vault
     */
    constructor(address _weth, address initialOwner, address initialAdmin) Ownable(initialOwner) {
        require(_weth != address(0), "WETH address cannot be zero");
        weth = _weth;
        _admins.add(initialAdmin);
    }

    /**
     * @dev Add an admin to the vault
     * @param admin The address of the admin to add
     */
    function addAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Invalid admin");
        require(_admins.add(admin), "Admin already exists");
    }

    /**
     * @dev Remove an admin from the vault
     * @param admin The address of the admin to remove
     */
    function removeAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Invalid admin");
        require(_admins.remove(admin), "Admin does not exist");
    }

    /**
     * @dev Deposit tokens into the vault for a specific account
     * @param account The account to deposit tokens for
     * @param currency The address of the token to deposit
     * @param amount The amount of tokens to deposit
     */
    function deposit(address account, address currency, uint256 amount) external nonReentrant {
        _deposit(account, currency, amount);
        IERC20(currency).transferFrom(msg.sender, address(this), amount);
    }

    /**
     * @dev Deposit tokens into the vault for a specific account without transferring the tokens within the function (permissioned)
     * @param account The account to deposit tokens for
     * @param currency The address of the token to deposit
     * @param amount The amount of tokens to deposit
     */
    function virtualDeposit(address account, address currency, uint256 amount) external onlyAdmin nonReentrant {
        if (amount == 0) return;
        _deposit(account, currency, amount);
    }

    /**
     * @dev Deposit tokens into the vault for multiple accounts without transferring the tokens within the function (permissioned)
     * @param accounts The accounts to deposit tokens for
     * @param currencies The addresses of the tokens to deposit
     * @param amounts The amounts of tokens to deposit
     */
    function virtualDepositMultiple(address[] calldata accounts, address[] calldata currencies, uint256[] calldata amounts) external onlyAdmin nonReentrant {
        require(accounts.length == currencies.length && currencies.length == amounts.length, "Array length mismatch");
        
        for (uint256 i = 0; i < accounts.length; i++) {
            if (amounts[i] == 0) continue;
            _deposit(accounts[i], currencies[i], amounts[i]);
        }
    }

    /**
     * @dev Withdraw all tokens of a specific currency from an account
     * If the currency is WETH, it will be unwrapped and ETH will be sent instead
     * @param account The account to withdraw tokens from
     * @param currency The address of the token to withdraw
     */
    function withdraw(address account, address currency) external nonReentrant {
        require(account != address(0), "Invalid account");
        require(currency != address(0), "Invalid currency"); // native eth not supported

        uint256 balance = _balances[account][currency];
        require(balance > 0, "No balance to withdraw");

        _balances[account][currency] = 0;

        _userCurrencies[account].remove(currency);

        if (currency == weth) {
            IWETH9(weth).withdraw(balance);
            (bool success, ) = account.call{value: balance}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(currency).safeTransfer(account, balance);
        }

        emit Withdrawal(account, currency, balance);
    }

    /**
     * @dev Withdraw all tokens of multiple currencies from an account
     * @param account The account to withdraw tokens from
     * @param currencies Array of token addresses to withdraw
     */
    function withdrawMany(address account, address[] calldata currencies) external nonReentrant {
        require(account != address(0), "Invalid account");
        
        for (uint256 i = 0; i < currencies.length; i++) {
            address currency = currencies[i];
            require(currency != address(0), "Invalid currency");

            uint256 balance = _balances[account][currency];
            if (balance == 0) continue;

            _balances[account][currency] = 0;

            _userCurrencies[account].remove(currency);

            if (currency == weth) {
                IWETH9(weth).withdraw(balance);
                (bool success, ) = account.call{value: balance}("");
                require(success, "ETH transfer failed");
            } else {
                IERC20(currency).safeTransfer(account, balance);
            }

            emit Withdrawal(account, currency, balance);
        }
    }

    /**
     * @dev Internal function to deposit tokens into the vault
     * @param account The account to deposit tokens for
     * @param currency The address of the token to deposit
     * @param amount The amount of tokens to deposit
     */
    function _deposit(address account, address currency, uint256 amount) internal {
        require(account != address(0), "Invalid account");
        require(currency != address(0), "Invalid currency"); // native eth not supported
        require(amount > 0, "Amount must be greater than zero");

        _balances[account][currency] += amount;

        if (!_userCurrencies[account].contains(currency)) {
            _userCurrencies[account].add(currency);
        }

        emit Deposit(account, currency, msg.sender, amount);
    }

    /**
     * @dev Get the balance of a specific currency for an account
     * @param account The account to check the balance for
     * @param currency The address of the token
     * @return The balance of the token for the account
     */
    function balanceOf(address account, address currency) external view returns (uint256) {
        return _balances[account][currency];
    }

    /**
     * @dev Get all currencies that an account has a non-zero balance for
     * @param account The account to check
     * @return Array of token addresses with non-zero balances
     */
    function currenciesHeld(address account) external view returns (address[] memory) {
        return _userCurrencies[account].values();
    }

    /**
     * @dev Get all currencies and their balances for an account
     * @param account The account to check
     * @return currencies Array of token addresses
     * @return amounts Array of corresponding balances
     */
    function balances(address account) external view returns (address[] memory currencies, uint256[] memory amounts) {
        currencies = _userCurrencies[account].values();
        amounts = new uint256[](currencies.length);
        
        for (uint256 i = 0; i < currencies.length; i++) {
            amounts[i] = _balances[account][currencies[i]];
        }
    }

    /**
     * @dev Get the admins of the vault
     * @return Array of admin addresses
     */
    function admins() external view returns (address[] memory) {
        return _admins.values();
    }

    /**
     * @dev Receive ETH (needed for WETH unwrapping)
     */
    receive() external payable {
        require(msg.sender == weth, "Only WETH can send ETH");
    }
}