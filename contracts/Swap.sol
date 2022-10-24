//SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "ISwap.sol";

contract Swap is ISwap, Ownable {
    bool _pauseContract = false;

    // Uniswap router instance
    ISwapRouter public constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address internal IssuerContract;

    //the goal is to stake in matic and native and earn stable 
    //stake in stable and earn non stable

    address USDT_POLYGON_CROSSCHAIN = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    address USDC_POLYGON_CROSSCHAIN = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address DAI_POLYGON = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;

    address WMATIC_POLYGON = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    address FIL_POLYGON = 0xEde1B77C0Ccc45BFa949636757cd2cA7eF30137F;
    address WETH_POLYGON = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;

    //only a specific contract can make swaps 
    modifier onlyIssuerContract() {
        require(
            msg.sender == IssuerContract,
            "Invalid operation. Not Issuer"
        );
        _;
    }

    modifier notPaused() {
        require(!_pauseContract, "Contract is paused");
        _;
    }

    //the contract that gets inputed 
    //constructor(address _issuerContract) {
        //IssuerContract = _issuerContract;
    //}

    //onlyIssuerContract
    function swapExactInputSingle(
        address fromAsset,
        address toAsset,
        address sender,
        address recipient,
        uint24 poolFee,
        uint256 amountIn
    ) external override(ISwap) returns (uint amountOut) {
        // Transfer the specified amount of fromAsset to this contract
        TransferHelper.safeTransferFrom(
            fromAsset,
            sender,
            address(this),
            amountIn
        );

        // Approve the router to spend fromAsset
        TransferHelper.safeApprove(fromAsset, address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount. This can be  used to set the limit for the price the swap will push the pool to,
        // which can help protect against price impact or for setting up logic in a variety of price-relevant mechanisms
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: fromAsset,
                tokenOut: toAsset,
                fee: poolFee,
                recipient: recipient,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    //Check To See If The Token Is Selectable
    function isValidAssetAddress(address _assetAddress)
        external
        view
        override(ISwap)
        returns (bool)
    {
        if (
            _assetAddress == USDT_POLYGON_CROSSCHAIN ||
            _assetAddress == USDC_POLYGON_CROSSCHAIN ||
            _assetAddress == DAI_POLYGON ||
            _assetAddress == WMATIC_POLYGON ||
            _assetAddress == FIL_POLYGON ||
            _assetAddress == WETH_POLYGON
        ) {
            return true;
        }
        return false;
    }

    function setIssuerContract(address _issuerContract) external onlyOwner {
        require(IssuerContract != address(0), "Invalid address");
        IssuerContract = _issuerContract;
    }

    function pauseContract(bool status) external onlyOwner {
        _pauseContract = status;
    }
}