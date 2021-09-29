const hre = require("hardhat");

const deployUSDT =async ()=>{

        const USDTToken = await hre.ethers.getContractFactory("TetherToken");
        const uSDTToken = await USDTToken.deploy();

        await uSDTToken.deployed();
        
        console.log("uSDTToken deployed to:", uSDTToken.address);
        return uSDTToken.address;
}


module.exports = {deployUSDT}