const hre = require("hardhat");

const deployStaking =async (stakeTokenAddress,rewardTokenAddress,price)=>{
    //parameters
    let rewardSteps = [
        7776000,
        10368000,
        15552000,
        23328000,
        100000000000
    ];

    let rewardPerBlocks = [];
    rewardPerBlocks.push(price.div(18800000).mul(30));
    rewardPerBlocks.push(price.div(18800000).mul(25));
    rewardPerBlocks.push(price.div(18800000).mul(20));
    rewardPerBlocks.push(price.div(18800000).mul(15));
    rewardPerBlocks.push(price.div(18800000).mul(10));

    const Staking = await hre.ethers.getContractFactory("staking");
    const staking = await Staking.deploy(rewardSteps,rewardPerBlocks,stakeTokenAddress,rewardTokenAddress)
    .catch((err)=>{
        console.log("staking error : ",err);
    });

    await staking.deployed();
    
    console.log("staking deployed to:", staking.address);
    return staking.address;
}


module.exports = {deployStaking}