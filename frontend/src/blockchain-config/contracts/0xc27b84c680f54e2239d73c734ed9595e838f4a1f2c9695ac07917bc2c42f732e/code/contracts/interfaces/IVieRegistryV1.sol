// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";

interface IVieRegistryV1 {
    struct FT {
        address tokenAddress;
        PoolKey poolKey;
        bytes32 poolId;
    }

    function registerSFT(address sftAddress) external;

    function registerToken(address tokenAddress, PoolKey memory poolKey) external;

    function getUserFTs(address user) external view returns (FT[] memory fts);

    function getUserSFTAddresses(address user) external view returns (address[] memory sftAddresses);

    function getUserTokens(address user) external view returns (
        FT[] memory fts,
        address[] memory sftAddresses
    );

    function getUserTokensWithSupplies(address user) external view returns (
        FT[] memory fts, 
        address[] memory sftAddresses, 
        uint256[] memory sftSupplies
    );

    function getFTByPoolId(bytes32 poolId) external view returns (FT memory ft);
    function getFTByTokenAddress(address tokenAddress) external view returns (FT memory ft);
}
