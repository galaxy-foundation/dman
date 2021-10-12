const hre = require("hardhat");

const deployDMToken =async (usdtAddress,ExchangeRouterAddress)=>{

	const DMToken = await hre.ethers.getContractFactory("DMToken");
	const dMToken = await DMToken.deploy();

	await dMToken.deployed();

	const Store = await hre.ethers.getContractFactory("store");
	const store = await Store.deploy();

	await store.deployed();

	var tx =await store.transferOwnership(dMToken.address);
	await tx.wait();

	tx = await dMToken.setInitialAddresses(ExchangeRouterAddress, usdtAddress, store.address);
	await tx.wait();

	
	return dMToken;
}


module.exports = {deployDMToken}