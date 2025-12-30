// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IVieSFTMintManager {
    struct Sale {
        address currency;
        uint48 startDate;
        uint48 endDate;
        uint248 price;
        bool created;
    }

    function createFixedPricePublicSale(
        address sftContractAddress,
        uint256 tokenId,
        Sale calldata sale
    ) external;
}