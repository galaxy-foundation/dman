
const fs = require('fs');

const {deployDMToken} = require ("./1_TokenDeploy");
const { deployUSDT } = require('./2_USDTDeploy');
const { deployStaking } = require('./3_StakingDeploy');
const { deployInsurrancePool } = require('./4_insurranceDeploy');

const DMToken = require("../artifacts/contracts/DMToken.sol/DMToken.json");
const ExchangeRouter = require("../artifacts/contracts/dexRouter.sol/PancakeswapRouter.json");
const IERC20 = require("../artifacts/contracts/DMToken.sol/IERC20.json");
const Staking = require("../artifacts/contracts/staking.sol/staking.json");
const {ethers} = require("ethers");
const hre = require("hardhat");

async function main() {

	// get network
	let signer = await hre.ethers.getSigner();
	
	let network = await signer.provider._networkPromise;
	let chainId = network.chainId;

	/* -------------- exchange --------------- */

	let ExchangeRouterAddress
	if(chainId === 4002){
		//fantom testnet
		ExchangeRouterAddress = "0x8e12fD09f7A761AABaD0C8E0e574d797FE27b8A6";
	}
	else {
		//mainnet
		ExchangeRouterAddress = process.env.ROUTER;
	}

	/* -------------- USDT --------------- */

	var usdtAddress;
	if(chainId === 4002){
		usdtAddress= await deployUSDT(ExchangeRouterAddress);
	} 
	else usdtAddress = process.env["USDT"];


	/* -------------- DM --------------- */

	let dMToken = await deployDMToken(usdtAddress,ExchangeRouterAddress);
	let dMTokenAddress = dMToken.address;


	/* -------------- mining tokens --------------- */

	const stakeTokenList = [
		"DM",
		"USDT",
		"ETH",
		"TRX",
		"FIL",
		"XRP",
		"DOT",
		"ADA",
		"HT"
	]
	const stakeTokens = {};
	stakeTokens[stakeTokenList[0]] = {address:dMTokenAddress, abi:DMToken.abi};
	if(chainId === 4002){
		// testnet
		stakeTokens[stakeTokenList[1]] = {address:usdtAddress, abi:IERC20.abi};
		for(let i = 2; i< stakeTokenList.length; i++){
		let tokenAddress = (await deployUSDT(ExchangeRouterAddress));
		console.log(tokenAddress)
		stakeTokens[stakeTokenList[i]] = {address:tokenAddress, abi:IERC20.abi};
		}
	}
	else {
		//mainnet
		for(let i = 1; i<stakeTokenList.length; i++){
		let tokenAddress = process.env[stakeTokenList[i]];
		stakeTokens[stakeTokenList[i]] = {address:tokenAddress, abi:IERC20.abi};
		}
	}

	/* -------------- add liquidity -----------------*/

	var tx = await dMToken.approve(ExchangeRouterAddress, ethers.utils.parseUnits("100000", 18));
	await tx.wait();

	var exchangeContract = new ethers.Contract(ExchangeRouterAddress,ExchangeRouter.abi, signer);
	exchangeContract.addLiquidity(dMToken.address, stakeTokens[stakeTokenList[1]].address, ethers.utils.parseUnits("100000",18),ethers.utils.parseUnits("1000",6),"0","0",signer.address,"1111111111111111111111111");

	/* -------------- staking contract -----------------*/
	
	const stakingContractsList = [
		"DMStaking",
		"USDTStaking",
		"ETHStaking",
		"TRXStaking",
		"FILStaking",
		"XRPStaking",
		"DOTStaking",
		"ADAStaking",
		"HTStaking"
	];

	const stakeTokenPrices = [
		ethers.BigNumber.from("1000000000000"),
		ethers.BigNumber.from("1000000000000000000000000"),
		ethers.BigNumber.from("3000000000000000"),
		ethers.BigNumber.from("108000000000000000000000"),
		ethers.BigNumber.from("77820000000000"),
		ethers.BigNumber.from("1070000000000"),
		ethers.BigNumber.from("35150000000000"),
		ethers.BigNumber.from("2410000000000"),
		ethers.BigNumber.from("14260000000000")
	]

	/* ------------ stake pool -------------- */

	var stakingContracts = {};
	for(var i = 0; i < stakingContractsList.length; i++){
		var stakingContractAddress = await deployStaking(stakeTokens[stakeTokenList[i]].address, dMTokenAddress, stakeTokenPrices[i]); 
		
		stakingContracts[stakingContractsList[i]] = {address:stakingContractAddress, abi:Staking.abi};
		await dMToken.setMinter(stakingContractAddress);
	}

	/* ------------ objects -------------- */

	var exchangeRouter = {address:ExchangeRouterAddress, abi:ExchangeRouter.abi}
	var contractObject = {ExchangeRouter:exchangeRouter};

	contractObject = {...contractObject, ...stakeTokens, ...stakingContracts}

	fs.writeFile(`./src/contracts/${network.chainId}.json`,JSON.stringify(contractObject, undefined, 4), function(err,content){
		if (err) throw err;
		console.log('complete');
	});
	}

	main()
	.then(() => {
		// process.exit(0)
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
