const hre = require("hardhat");

const deployStaking =async (stakeTokenAddress, rewardTokenAddress, price)=>{
    //parameters
    let feeSteps = [
        7776000,
        10368000,
        15552000,
        23328000,
        100000000000
    ];

    let rewardPersecond = price.mul(3).div(100).div(86400);

    const Staking = await hre.ethers.getContractFactory("staking");
    const staking = await Staking.deploy(feeSteps, rewardPersecond, stakeTokenAddress, rewardTokenAddress)
    .catch((err)=>{
        console.log("staking error : ",err);
    });

    await staking.deployed();
    
    return staking.address;
}


module.exports = {deployStaking}