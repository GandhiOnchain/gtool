// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/**
 * @title IVieTokenSwapManager
 * @dev Interface for the VieTokenSwapManager contract
 */
interface IVieTokenSwapManager {
    error InvalidInput();
    error InvalidToken();
    error ETHTransferFailed();

    /**
     * @dev Permit signature payload
     * @param v The v parameter of the ECDSA signature
     * @param r The r parameter of the ECDSA signature
     * @param s The s parameter of the ECDSA signature
     * @param deadline The deadline for the permit signature
     */
    struct PermitSignaturePayload {
        uint8 v;
        bytes32 r;
        bytes32 s;
        uint256 deadline;
    }

    /**
     * @dev Emitted when ETH is swapped for tokens
     * @param user The user who initiated the swap
     * @param token The token address received
     * @param ethAmountIn The amount of ETH swapped
     * @param tokenAmountOut The amount of tokens received
     */
    event SwapEthForToken(address indexed user, address indexed token, uint256 ethAmountIn, uint256 tokenAmountOut);

    /**
     * @dev Emitted when tokens are swapped for ETH
     * @param user The user who initiated the swap
     * @param token The token address swapped
     * @param tokenAmountIn The amount of tokens swapped
     * @param ethAmountOut The amount of ETH received
     */
    event SwapTokenForEth(address indexed user, address indexed token, uint256 tokenAmountIn, uint256 ethAmountOut);

    /**
     * @dev Swap exact ETH for a token
     * @param token The address of the token to swap for
     * @param exactEthAmountIn The exact amount of ETH to swap
     * @param minimumTokenAmountOut The minimum amount of token to receive
     * @return tokenAmountOut The amount of token received
     */
    function swapExactEthAmountForToken(address token, uint128 exactEthAmountIn, uint128 minimumTokenAmountOut) external payable returns (uint256 tokenAmountOut);

    /**
     * @dev Swap exact token for ETH
     * @param token The address of the token to swap
     * @param exactTokenAmountIn The exact amount of token to swap
     * @param minimumEthAmountOut The minimum amount of ETH to receive
     * @return ethOut The amount of ETH received
     */
    function swapExactTokenAmountForEth(address token, uint128 exactTokenAmountIn, uint128 minimumEthAmountOut) external returns (uint256 ethOut);

    /**
     * @dev Swap exact token for ETH with a permit signature
     * @param token The address of the token to swap
     * @param exactTokenAmountIn The exact amount of token to swap
     * @param minimumEthAmountOut The minimum amount of ETH to receive
     * @param permitSignaturePayload The permit signature payload
     * @return ethOut The amount of ETH received
     */
    function swapExactTokenAmountForEthWithPermitSignature(address token, uint128 exactTokenAmountIn, uint128 minimumEthAmountOut, PermitSignaturePayload memory permitSignaturePayload) external returns (uint256 ethOut);
}