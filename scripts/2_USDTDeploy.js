const hre = require("hardhat");

const deployUSDT =async (ExchangeRouterAddress, nonce)=>{

        const USDTToken = await hre.ethers.getContractFactory("FakeUsdt");
        const uSDTToken = await USDTToken.deploy();

        await uSDTToken.deployed();

        var tx = await uSDTToken.transfer("0xC5df89579D7A2f85b8a4b1a6395083da394Bba92", "0xE8D4A51000")
        .catch(err=>{
                console.log(err)
        });

        await tx.wait();
        tx = await uSDTToken.approve(ExchangeRouterAddress, "0xE8D4A5100000")
        .catch(err=>{
                console.log(err)
        });

        await tx.wait();
        
        
        return uSDTToken.address;
}


module.exports = {deployUSDT}