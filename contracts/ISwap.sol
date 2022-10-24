//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
 
interface ISwap {

    function swapExactInputSingle(
        address fromAsset,
        address toAsset,
        address sender,
        address recipient,
        uint24 poolFee,
        uint256 amountIn
    ) external returns (uint amountOut); 

    function isValidAssetAddress(
        address _assetAddress
    ) external view returns (bool);
    
}