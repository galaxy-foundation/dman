const hre = require("hardhat");

const deployInsurrancePool =async (DMAddress)=>{

        const InsurancePool = await hre.ethers.getContractFactory("InsurancePool");
        const insurancePool = await InsurancePool.deploy(DMAddress);

        await insurancePool.deployed();
        
        console.log("insurancePool deployed to:", insurancePool.address);
        return insurancePool.address;
}


module.exports = {deployInsurrancePool}