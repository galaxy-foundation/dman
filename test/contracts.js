const { expect } = require("chai");
const { ethers } = require("hardhat");

var exchangeRouter;
var exchangeFactory;
var wETH;

var dMToken;
var usdt;

var staking;

var owner;
var userWallet;

describe("Create UserWallet", function () {
  it("Create account", async function () {
	userWallet = ethers.Wallet.createRandom();
	[owner] = await ethers.getSigners();
	
    console.log(userWallet.address,owner.address);
  });
});

describe("Exchange deploy and deploy", function () {

  it("Factory deploy", async function () {
    const Factory = await ethers.getContractFactory("PancakeswapFactory");
    exchangeFactory = await Factory.deploy(owner.address);
    await exchangeFactory.deployed();
  });

  it("WETH deploy", async function () {
    const WETH = await ethers.getContractFactory("WETH9");
    wETH = await WETH.deploy();
    await wETH.deployed();
  });
  
  it("Router deploy", async function () {
    const Router = await ethers.getContractFactory("PancakeswapRouter");
    exchangeRouter = await Router.deploy(exchangeFactory.address,wETH.address);
    await exchangeRouter.deployed();
  });

});

describe("Token contract deploy", function () {
	it("Usdt Deploy", async function () {
		const FakeUsdt = await ethers.getContractFactory("FakeUsdt");
		usdt = await FakeUsdt.deploy();
	});

	it("DM Deploy and Initial", async function () {
		const DMToken = await ethers.getContractFactory("DMToken");
		dMToken = await DMToken.deploy();
		var tx = await dMToken.setInitialAddresses(exchangeRouter.address,usdt.address);
		await tx.wait();
	});

  	it("DM Add Liquidity", async function () {
		var tx = await dMToken.approve(exchangeRouter.address,ethers.utils.parseUnits("1000000",18));
		await tx.wait();
		tx = await usdt.approve(exchangeRouter.address,ethers.utils.parseUnits("100000",6));
		await tx.wait();

		tx = await exchangeRouter.addLiquidity(
			dMToken.address,
			usdt.address,
			ethers.utils.parseUnits("1000000",18),
			ethers.utils.parseUnits("10000",6),
			0,
			0,
			owner.address,
			"111111111111111111111"
		);
		await tx.wait();
	});

	it("DM Staking Deploy and setMinter", async function () {
		
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
		
		const Staking = await ethers.getContractFactory("staking");
		staking = await Staking.deploy(rewardSteps,rewardPerBlocks,stakeTokenAddress,rewardTokenAddress)
		var tx = await dMToken.setInitialAddresses(exchangeRouter.address,usdt.address);
		await tx.wait();
	});

});

describe("dM test", function () {
	it("", async function () {
		const FakeUsdt = await ethers.getContractFactory("FakeUsdt");
		usdt = await FakeUsdt.deploy();
	});

});
