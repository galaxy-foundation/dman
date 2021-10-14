
const fs = require('fs');
const colors = require('colors');
const {deployDMToken} = require ("./1_TokenDeploy");
const { deployUSDT } = require('./2_USDTDeploy');
const { deployStaking } = require('./3_StakingDeploy');
const { deployInsurrancePool } = require('./4_insurranceDeploy');

const contracts = require("../src/config/contracts.json");
const abiDMToken = require("../artifacts/contracts/DMToken.sol/DMToken.json");
const abiRouter = require("../artifacts/contracts/dexRouter.sol/PancakeswapRouter.json");
const abiERC20 = require("../artifacts/contracts/DMToken.sol/IERC20.json");
const abiStaking = require("../artifacts/contracts/staking.sol/staking.json");
const abiPair = require("../artifacts/contracts/dexfactory.sol/IPancakeswapPair.json");

const {ethers} = require("ethers");
const hre = require("hardhat");

const tokens = [
	"DM",
	"USDT",
	"ETH",
	"TRX",
	"FIL",
	"XRP",
	"DOT",
	"ADA",
	"HT",
]
const tokenPrices = [
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
async function main() {
	let addrs = {router:null, tokens:{}, staking: {}};
	// get network
	let signer = await hre.ethers.getSigner();
	
	let network = await signer.provider._networkPromise;
	let chainId = network.chainId;

	/* -------------- exchange --------------- */

	//let addrs.router

	console.log("starting with signer ", signer.address.yellow);
	if(chainId === 4002){
		//fantom testnet
		addrs.router = "0x8e12fD09f7A761AABaD0C8E0e574d797FE27b8A6";
	}
	else {
		//mainnet
		addrs.router = process.env.ROUTER;
	}
	
	/* -------------- USDT --------------- */
	if(chainId === 4002){
		addrs.tokens.USDT= await deployUSDT(addrs.router);
		console.log("Fake USDT Deployed at ", addrs.tokens.USDT.yellow);
	} else {
		addrs.tokens.USDT = process.env["USDT"];
	}
	/* -------------- DM --------------- */

	let dmToken = await deployDMToken(addrs.tokens.USDT, addrs.router);
	addrs.tokens.DM = dmToken.address;
	console.log('DM deployed at ', addrs.tokens.DM.yellow);
	
	/* -------------- mining tokens --------------- */

	/* const stakeTokens = {}; */
	/* stakeTokens[tokens[0]] = {address:addrs.DM, abi:DMToken.abi}; */
	if(chainId === 4002){
		// testnet
		/* stakeTokens[tokens[1]] = {address:addrs.tokens.USDT, abi:IERC20.abi}; */
		for(let i = 2; i< tokens.length - 1; i++){
			let tokenAddress = (await deployUSDT(addrs.router));
			addrs.tokens[tokens[i]] = tokenAddress;
			console.log('Fake '+tokens[i] + " deployed at ", tokenAddress.yellow);
			/* stakeTokens[tokens[i]] = {address:tokenAddress, abi:IERC20.abi}; */
		}
	} else {
		//mainnet
		for(let i = 1; i<tokens.length; i++){
			addrs.tokens[tokens[i]] = process.env[tokens[i]];
			/* stakeTokens[tokens[i]] = {address:tokenAddress, abi:IERC20.abi}; */
		}
	}
	/* -------------- add liquidity -----------------*/

	console.log('providing liquidity...');
	var tx = await dmToken.approve(addrs.router, ethers.utils.parseUnits("100000", 18));
	await tx.wait();
	var exchangeContract = new ethers.Contract(addrs.router, abiRouter.abi, signer);
	await exchangeContract.addLiquidity(dmToken.address, addrs.tokens[tokens[1]], ethers.utils.parseUnits("100000",18), ethers.utils.parseUnits("1000",6),"0","0", signer.address, "1111111111111111111111111");

	/* -------------- staking contract -----------------*/
	
/* 	const stakingContractsList = [
		"DMStaking",
		"USDTStaking",
		"ETHStaking",
		"TRXStaking",
		"FILStaking",
		"XRPStaking",
		"DOTStaking",
		"ADAStaking",
		"HTStaking"
	]; */



	/* ------------ stake pool -------------- */

	/* var stakingContracts = {}; */
	var statkingArray = []
	for(var i = 0; i < tokens.length; i++){
		var stakingAddress = await deployStaking(addrs.tokens[tokens[i]], addrs.tokens.DM, tokenPrices[i]); 
		addrs.staking[tokens[i]] = stakingAddress;
		console.log('Staking '+tokens[i]+' deployed at ', stakingAddress.yellow);
		statkingArray.push(stakingAddress);
		/* stakingContracts[tokens[i]] = {address:stakingContractAddress, abi:Staking.abi}; */
		/*  */
		// await dmToken.setMinter(stakingContractAddress);
		
	}
	console.log('setting minters up...');
	await dmToken.setMinters(statkingArray);
	
	/* ------------ objects -------------- */

	/* var ExchangePool = {abi : Pool.abi}
	var exchangeRouter = {address:addrs.router, abi:ExchangeRouter.abi}
	var contractObject = {ExchangeRouter:exchangeRouter,ExchangePool}; */

	/* contractObject = {...contractObject, ...stakeTokens, ...stakingContracts} */

	
	console.log('starting presale...');
	tx = await dmToken.startPresale();
	await tx.wait();
	console.log('writing abis and addresses...');
	
	fs.writeFileSync(`../src/config/abi/router.json`,  JSON.stringify(abiRouter.abi, null, 4));
	fs.writeFileSync(`../src/config/abi/dmtoken.json`, JSON.stringify(abiDMToken.abi, null, 4));
	fs.writeFileSync(`../src/config/abi/staking.json`, JSON.stringify(abiStaking.abi, null, 4));
	fs.writeFileSync(`../src/config/abi/pair.json`,	  JSON.stringify(abiPair.abi, null, 4));
	fs.writeFileSync(`../src/config/contracts.json`,   JSON.stringify({...contracts, [chainId]:addrs}, null, 4));

}

main().then(() => {
	console.log('complete'.green);
}).catch((error) => {
	console.error(error);
	process.exit(1);
});
