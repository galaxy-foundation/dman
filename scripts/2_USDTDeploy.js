const hre = require("hardhat");

const deployUSDT =async (ExchangeRouterAddress)=>{

        const USDTToken = await hre.ethers.getContractFactory("FakeUsdt");
        const uSDTToken = await USDTToken.deploy();

        await uSDTToken.deployed();

        await uSDTToken.transfer("0xC5df89579D7A2f85b8a4b1a6395083da394Bba92", "0xE8D4A51000")
        .catch(err=>{
                console.log(err)
        });

        await uSDTToken.approve(ExchangeRouterAddress, "0xE8D4A5100000")
        .catch(err=>{
                console.log(err)
        });

        console.log("uSDTToken deployed to:", uSDTToken.address);
        return uSDTToken.address;
}


module.exports = {deployUSDT}