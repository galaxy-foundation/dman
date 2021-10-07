import {ethers} from 'ethers';
import contracts from "./4002.json"

const rpc = process.env.REACT_APP_NETWORK_URL;
const provider = new ethers.providers.JsonRpcProvider(rpc);

const DMTokenContract = new ethers.Contract(contracts.DM.address, contracts.DM.abi,provider);
const ExchangeRouter = new ethers.Contract(contracts.ExchangeRouter.address, contracts.ExchangeRouter.abi, provider);

const USDTContract = new ethers.Contract(contracts.USDT.address, contracts.USDT.abi,provider);
const ETHContract = new ethers.Contract(contracts.ETH.address, contracts.ETH.abi,provider);
const TRXContract = new ethers.Contract(contracts.TRX.address, contracts.TRX.abi,provider);
const FILContract = new ethers.Contract(contracts.FIL.address, contracts.FIL.abi,provider);
const XRPContract = new ethers.Contract(contracts.XRP.address, contracts.XRP.abi,provider);
const DOTContract = new ethers.Contract(contracts.DOT.address, contracts.DOT.abi,provider);
const ADAContract = new ethers.Contract(contracts.ADA.address, contracts.ADA.abi,provider);
const HTContract = new ethers.Contract(contracts.HT.address, contracts.HT.abi,provider);
const DMStakingContract = new ethers.Contract(contracts.DMStaking.address, contracts.DMStaking.abi,provider);
const USDTStakingContract = new ethers.Contract(contracts.USDTStaking.address, contracts.USDTStaking.abi,provider);
const ETHStakingContract = new ethers.Contract(contracts.ETHStaking.address, contracts.ETHStaking.abi,provider);
const TRXStakingContract = new ethers.Contract(contracts.TRXStaking.address, contracts.TRXStaking.abi,provider);
const FILStakingContract = new ethers.Contract(contracts.FILStaking.address, contracts.FILStaking.abi,provider);
const XRPStakingContract = new ethers.Contract(contracts.XRPStaking.address, contracts.XRPStaking.abi,provider);
const DOTStakingContract = new ethers.Contract(contracts.DOTStaking.address, contracts.DOTStaking.abi,provider);
const ADAStakingContract = new ethers.Contract(contracts.ADAStaking.address, contracts.ADAStaking.abi,provider);
const HTStakingContract = new ethers.Contract(contracts.HTStaking.address, contracts.HTStaking.abi,provider);

export {
    DMTokenContract,USDTContract,ExchangeRouter,
    ETHContract,TRXContract,FILContract,XRPContract,DOTContract,ADAContract,HTContract,
    DMStakingContract,USDTStakingContract,ETHStakingContract,TRXStakingContract,FILStakingContract,XRPStakingContract,DOTStakingContract,ADAStakingContract,HTStakingContract
}

