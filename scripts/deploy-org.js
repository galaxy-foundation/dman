
const fs = require('fs');
const colors = require('colors');
const {deployDMToken} = require ("./1_TokenDeploy");
const { deployUSDT } = require('./2_USDTDeploy');
const { deployStaking } = require('./3_StakingDeploy');
/* const { deployInsurrancePool } = require('./4_insurranceDeploy'); */

const contracts = require("../src/config/contracts.json");
const abiDMToken = require("../artifacts/contracts/DMToken.sol/DMToken.json");
const abiRouter = require("../artifacts/contracts/dexRouter.sol/PancakeswapRouter.json");
const abiERC20 = require("../artifacts/contracts/DMToken.sol/IERC20.json");
const abiStaking = require("../artifacts/contracts/staking.sol/staking.json");
const abiPair = require("../artifacts/contracts/dexfactory.sol/IPancakeswapPair.json");

const {ethers} = require("ethers");
const hre = require("hardhat");

/* const tokens = [
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
 */

const tokenPrices = {
	DM: 	1,
	USDT: 	1,
	ETH: 	3000,
	TRX: 	0.1,
	FIL: 	77.8,
	XRP: 	1.07,
	DOT: 	35.15,
	ADA: 	2.4,
	HT: 	14.26,
}

const getDecimals = async (address, signer) => {
	const contract = new ethers.Contract(address, abiRouter.abi, signer);
	return await contract.decimals();
}


async function main() {
	const tokens = Object.keys(tokenPrices);
	let addrs = {router:null, tokens:{}, staking: {}};
	// get network
	let signer = await hre.ethers.getSigner();
	
	let network = await signer.provider._networkPromise;
	let chainId = network.chainId;

	/* -------------- exchange --------------- */

	//let addrs.router

	console.log("starting with signer ", signer.address.yellow);
	if(chainId === 4002){
		addrs.router = "0x8e12fD09f7A761AABaD0C8E0e574d797FE27b8A6";
	} else {
		addrs.router = process.env.ROUTER;
	}
	let address = '';
	/* -------------- USDT --------------- */
	if(chainId === 4002){
		address= await deployUSDT(addrs.router);
		console.log("Fake USDT Deployed at ", address.yellow);
	} else {
		address = process.env["USDT"];
	}
	addrs.tokens.USDT = { address, decimals:0}
	/* -------------- DM --------------- */

	let dmToken = await deployDMToken(addrs.tokens.USDT.address, addrs.router);
	address = dmToken.address;
	addrs.tokens.DM = { address, decimals:0 };
	console.log('DM deployed at ', address.yellow);
	
	/* -------------- mining tokens --------------- */

	/* const stakeTokens = {}; */
	/* stakeTokens[tokens[0]] = {address:addrs.DM, abi:DMToken.abi}; */
	if(chainId === 4002){
		// testnet
		/* stakeTokens[tokens[1]] = {address:addrs.tokens.USDT, abi:IERC20.abi}; */
		for(let i = 2; i< tokens.length; i++){
			address = (await deployUSDT(addrs.router));
			addrs.tokens[tokens[i]] = {address, decimals:0};
			console.log('Fake '+tokens[i] + " deployed at ", address.yellow);
		}
	} else {
		//mainnet
		for(let i = 1; i<tokens.length; i++){
			addrs.tokens[tokens[i]] = {address:process.env[tokens[i]], decimals:0};
		}
	}
	for(let k of tokens) {
		addrs.tokens[k].decimals = await getDecimals(addrs.tokens[k].address, signer);
	}
	/* -------------- add liquidity -----------------*/

	console.log('providing liquidity...');
	var tx = await dmToken.approve(addrs.router, ethers.utils.parseUnits("100000", 18));
	await tx.wait();
	var exchangeContract = new ethers.Contract(addrs.router, abiRouter.abi, signer);
	await exchangeContract.addLiquidity(dmToken.address, addrs.tokens[tokens[1]].address, ethers.utils.parseUnits("100000",18), ethers.utils.parseUnits("1000",6),"0","0", signer.address, "1111111111111111111111111");

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
	for (let v of tokens) {
		// (1e27).toLocaleString('en', {useGrouping:false})
		const p1 = Math.round(tokenPrices[v] * 1e6);
		const p2 = 10 ** (24 - addrs.tokens[v].decimals);
		const price = ethers.BigNumber.from(p1).mul(ethers.BigNumber.from(p2));
		console.log("price", price.toString(), 'p1', p1, 'p2', p2)
		const stakingAddress = await deployStaking(addrs.tokens[v].address, addrs.tokens.DM.address, price); 
		addrs.staking[v] = stakingAddress;
		console.log('Staking '+v+' deployed at ', stakingAddress.yellow);
		statkingArray.push(stakingAddress);
		/* stakingContracts[v] = {address:stakingContractAddress, abi:Staking.abi}; */
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
	
	fs.writeFileSync(`./src/config/abi/router.json`,  JSON.stringify(abiRouter.abi, null, 4));
	fs.writeFileSync(`./src/config/abi/dmtoken.json`, JSON.stringify(abiDMToken.abi, null, 4));
	fs.writeFileSync(`./src/config/abi/staking.json`, JSON.stringify(abiStaking.abi, null, 4));
	fs.writeFileSync(`./src/config/abi/pair.json`,	  JSON.stringify(abiPair.abi, null, 4));
	fs.writeFileSync(`./src/config/contracts.json`,   JSON.stringify({...contracts, [chainId]:addrs}, null, 4));
}

main().then(() => {
	console.log('complete'.green);
}).catch((error) => {
	console.error(error);
	process.exit(1);
});
