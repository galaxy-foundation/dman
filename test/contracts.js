const { expect } = require("chai");
const { ethers } = require("hardhat");

var exchangeRouter;
var exchangeFactory;
var wETH;
var dMToken;
var usdt;

describe("Exchange deploy and deploy", function () {

  it("Factory deploy", async function () {
    
    const [owner] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("PancakeswapFactory");
    
    exchangeFactory = await Factory.deploy(owner.address);
    await exchangeFactory.deployed();
    
  });

  
  it("WETH deploy", async function () {
    
    const [owner] = await ethers.getSigners();
    const WETH = await ethers.getContractFactory("WETH9");
    
    wETH = await WETH.deploy();
    await wETH.deployed();
    
  });
  
  it("Router deploy", async function () {

    const [owner] = await ethers.getSigners();
    const Router = await ethers.getContractFactory("PancakeswapRouter");
    exchangeRouter = await Router.deploy(exchangeFactory.address,wETH.address);
    await exchangeRouter.deployed();

  });

// describe("Token contract", function () {
//   it("Deployment should assign the total supply of tokens to the owner", async function () {
//     const [owner] = await ethers.getSigners();

//     const Token = await ethers.getContractFactory("Token");

//     const hardhatToken = await Token.deploy();

//     const ownerBalance = await hardhatToken.balanceOf(owner.address);
//     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
//   });
});