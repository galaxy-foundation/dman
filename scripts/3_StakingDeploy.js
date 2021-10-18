const hre = require("hardhat");
const { ethers } = require("hardhat");

const deployStaking =async (stakeTokenAddress, rewardTokenAddress, price, maxMint)=>{
    let rewardPersecond = price.mul(328767).mul(ethers.utils.parseUnits("1",18)).mul(3).div(100).div(86400);
    const stakingContract = await hre.ethers.getContractFactory("staking");
    const staking = await stakingContract.deploy(rewardPersecond, stakeTokenAddress, rewardTokenAddress, maxMint).catch((err)=>{console.log("staking error : ",err)});
    /* await staking.deployed(); */   
    return staking.address;
}


module.exports = {deployStaking}