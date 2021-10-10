const { expect } = require("chai");
const { ethers } = require("hardhat");

const {delay, fromBigNum, toBigNum} = require("./utils.js")

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
	});
});

describe("Exchange deploy and deploy", function () {

  it("Factory deploy", async function () {
    const Factory = await ethers.getContractFactory("PancakeswapFactory");
    exchangeFactory = await Factory.deploy(owner.address);
    await exchangeFactory.deployed();
	console.log(await exchangeFactory.INIT_CODE_PAIR_HASH())
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

		tx = await dMToken.startPresale();
		await tx.wait()
	});

  	it("DM Add Liquidity", async function () {
		var tx = await dMToken.approve(exchangeRouter.address,ethers.utils.parseUnits("100000000",18));
		await tx.wait();
		tx = await usdt.approve(exchangeRouter.address,ethers.utils.parseUnits("10000000",6));
		await tx.wait();

		tx = await exchangeRouter.addLiquidity(
			dMToken.address,
			usdt.address,
			ethers.utils.parseUnits("5000000",18),
			ethers.utils.parseUnits("500000",6),
			0,
			0,
			owner.address,
			"111111111111111111111"
		);
		await tx.wait();
	});

	it("DM Staking Deploy and setMinter", async function () {
		
		var price = ethers.BigNumber.from("1000000000000");
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
		staking = await Staking.deploy(rewardSteps,rewardPerBlocks,usdt.address,dMToken.address);
		await staking.deployed();
		
		var tx = await dMToken.setMinter(staking.address);
		tx.wait();
	});

});

describe("dM test", function () {

	it("DM-USDT test", async function () {
		
		var swapAmount = ethers.utils.parseUnits("100000",18);
		
		var initUsdtBalance = await usdt.balanceOf(owner.address);
		var initDMTokenBalance = await dMToken.balanceOf(owner.address);
		var exceptSwapBalance = (await exchangeRouter.getAmountsOut(swapAmount,[dMToken.address,usdt.address]))[1];

		var tx = await dMToken.approve(exchangeRouter.address,swapAmount);
		await tx.wait();

		tx = await exchangeRouter.swapExactTokensForTokens(
			swapAmount,
			0,
			[dMToken.address,usdt.address],
			owner.address,
			"99000000000000000"
		)
		await tx.wait()

		let  buyUsdtAmount= await usdt.balanceOf(owner.address);
		let  buyDMTokenAmount= await dMToken.balanceOf(owner.address);

		// console.log(
		// 	"DM-USDT ",
		// 	ethers.utils.formatUnits(initDMTokenBalance.sub(buyDMTokenAmount),18),
		// 	ethers.utils.formatUnits(buyUsdtAmount.sub(initUsdtBalance),6),
		// 	ethers.utils.formatUnits(exceptSwapBalance,6)
		// );
	});

	it("USDT-DM test", async function () {

		var swapAmount = ethers.utils.parseUnits("5000000",6);
		
		var initUsdtBalance = await usdt.balanceOf(owner.address);
		var initDMTokenBalance = await dMToken.balanceOf(owner.address);
		var exceptSwapBalance = (await exchangeRouter.getAmountsOut(swapAmount,[usdt.address,dMToken.address]))[1];

		var tx = await usdt.approve(exchangeRouter.address,swapAmount);
		await tx.wait();

		tx = await exchangeRouter.swapExactTokensForTokens(
			swapAmount,
			0,
			[usdt.address, dMToken.address],
			owner.address,
			"99000000000000000"
		)
		await tx.wait(); 

		let  buyUsdtAmount= await usdt.balanceOf(owner.address);
		let  buyDMTokenAmount= await dMToken.balanceOf(owner.address);

		// console.log(
		// 	"USDT-DM",
		// 	ethers.utils.formatUnits(initUsdtBalance.sub(buyUsdtAmount),6),
		// 	ethers.utils.formatUnits(buyDMTokenAmount.sub(initDMTokenBalance),18),
		// 	ethers.utils.formatUnits(exceptSwapBalance,18)
		// );

	});

	it("transfer test", async function () {
		var tx = await dMToken.transfer(owner.address,"1000000000000");
		await tx.wait();
		console.log("token Balance", fromBigNum(await dMToken.balanceOf(dMToken.address),18))
		console.log("rewardPoolBalance", fromBigNum(await dMToken.rewardPoolBalance(),6))
		console.log("rewardedTotalBalance", fromBigNum(await dMToken.rewardedTotalBalance(),6))
	})

	it("presale test", async function () {

		var buyAmount = ethers.utils.parseUnits("500",6);
		var initUsdtBalance = await usdt.balanceOf(owner.address);
		var initDMTokenBalance = await dMToken.balanceOf(owner.address);

		var tx = await usdt.approve(dMToken.address,buyAmount);
		await tx.wait();

		tx = await dMToken.presale(buyAmount);
		
		var res = await tx.wait();
		let sumEvent = res.events.pop();
		let  buyUsdtAmount= sumEvent.args[1];
		let  buyDMTokenAmount= sumEvent.args[2];

		expect(buyDMTokenAmount).to.equal("100000000000000000000000","presale amount");

	});

	it("unlock test", async function () {
		// get total lockedAmount
		var lockedAmount = ethers.utils.formatUnits((await dMToken.presales(owner.address)).amount,18);
		var unlockedAmount = 0 ;

		for (var i=0;i<6;i++){
			
			// test transactions
			var buyAmount = ethers.utils.parseUnits("500",6);
			var tx = await usdt.approve(dMToken.address,buyAmount);
			await tx.wait();
			
			// get unlockable amount
			var unlockAmount = await dMToken.getUnlockAmount(owner.address);

			if(Number(unlockAmount)>0){
				var tx =await dMToken.unlock();
				var res = await tx.wait();

				let sumEvent = res.events.pop();
				let _stakeAmount = ethers.utils.formatUnits(sumEvent.args[1],18);
				unlockedAmount += Number(_stakeAmount);
				console.log(unlockedAmount,Number(sumEvent.args[2]))
			}
			await delay(3000);
		}

		expect(unlockedAmount).to.equal(Number(lockedAmount),"All presale unlocked")
	})

});


describe("staking test", function () {
	
	it("staking test", async function () {
		var stakeAmount = ethers.utils.parseUnits("10000", 6);
		var tx = await usdt.approve(staking.address, stakeAmount);
		await tx.wait();

		var tx = await staking.stake(stakeAmount)
		var res = await tx.wait();

		let sumEvent = res.events.pop();
		let _stakeAmount = sumEvent.args[1];

		expect(stakeAmount).to.equal(_stakeAmount,"stake Amount")
	})

	it("withdraw test", async function () {
		var withdrawAmount = ethers.utils.parseUnits("1000", 6); 
		var initialBalance = await usdt.balanceOf(owner.address);
		
		tx = await staking.withdraw(withdrawAmount);
		await tx.wait();

		var cBalance = await usdt.balanceOf(owner.address);

		expect(cBalance.sub(initialBalance)).to.equal(withdrawAmount,"withdraw test");
	})

	it("getRewards test", async function () {
		var initialBalance = await dMToken.balanceOf(owner.address);
		
		tx = await staking.claimRewards();
		await tx.wait();

		var cBalance = await dMToken.balanceOf(owner.address);

		expect(Number(cBalance.sub(initialBalance))).to.greaterThan(0,"get Reward test");
	})
})
