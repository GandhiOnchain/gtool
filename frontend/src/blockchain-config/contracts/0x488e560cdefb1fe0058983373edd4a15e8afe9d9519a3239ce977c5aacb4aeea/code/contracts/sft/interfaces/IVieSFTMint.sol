// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/**
 * @title IVieSFTMint
 * @dev Interface for SFT minting functionality
 */
interface IVieSFTMint {
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
    ) external;

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
    ) external;
}