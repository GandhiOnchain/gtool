// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IWETH9
 * @dev Interface for WETH9 contract
 */
interface IWETH9 is IERC20 {
    /**
     * @dev Withdraw WETH to ETH
     * @param wad Amount to withdraw
     */
    function withdraw(uint256 wad) external;

    /**
     * @dev Deposit ETH to get WETH
     */
    function deposit() external payable;
}