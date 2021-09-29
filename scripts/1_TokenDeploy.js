const hre = require("hardhat");

const deployDMToken =async ()=>{

        const DMToken = await hre.ethers.getContractFactory("DMToken");
        const dMToken = await DMToken.deploy();

        await dMToken.deployed();
        
        console.log("dMToken deployed to:", dMToken.address);
        return dMToken;
}


module.exports = {deployDMToken}