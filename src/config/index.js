import {ethers} from 'ethers';
import contracts from "./contracts.json"
import abiRouter from './abi/router.json'
import abiPair from './abi/pair.json'
import abiDM from './abi/dmtoken.json'
import abiERC20 from './abi/erc20.json'
import abiStaking from './abi/staking.json'

const rpc = process.env.REACT_APP_NETWORK_URL;
const chainid = process.env.REACT_APP_CHAIN_ID;
const addrs = contracts[chainid];

const provider = new ethers.providers.JsonRpcProvider(rpc);

const ExchangeRouter =      new ethers.Contract(addrs.router,      abiRouter,  provider);
const DMTokenContract =     new ethers.Contract(addrs.tokens.DM.address,   abiDM,      provider);

const USDTContract=         new ethers.Contract(addrs.tokens.USDT.address, abiERC20,   provider);
const ETHContract =         new ethers.Contract(addrs.tokens.ETH.address,  abiERC20,   provider);
const TRXContract =         new ethers.Contract(addrs.tokens.TRX.address,  abiERC20,   provider);
const FILContract =         new ethers.Contract(addrs.tokens.FIL.address,  abiERC20,   provider);
const XRPContract =         new ethers.Contract(addrs.tokens.XRP.address,  abiERC20,   provider);
const DOTContract =         new ethers.Contract(addrs.tokens.DOT.address,  abiERC20,   provider);
const ADAContract =         new ethers.Contract(addrs.tokens.ADA.address,  abiERC20,   provider);
const HTContract  =         new ethers.Contract(addrs.tokens.HT.address,   abiERC20,   provider);

const DMStakingContract  =  new ethers.Contract(addrs.staking.DM,  abiStaking, provider);
const USDTStakingContract=  new ethers.Contract(addrs.staking.USDT,abiStaking, provider);
const ETHStakingContract =  new ethers.Contract(addrs.staking.ETH, abiStaking, provider);
const TRXStakingContract =  new ethers.Contract(addrs.staking.TRX, abiStaking, provider);
const FILStakingContract =  new ethers.Contract(addrs.staking.FIL, abiStaking, provider);
const XRPStakingContract =  new ethers.Contract(addrs.staking.XRP, abiStaking, provider);
const DOTStakingContract =  new ethers.Contract(addrs.staking.DOT, abiStaking, provider);
const ADAStakingContract =  new ethers.Contract(addrs.staking.ADA, abiStaking, provider);
const HTStakingContract  =  new ethers.Contract(addrs.staking.HT,  abiStaking, provider);

const poolAbi = abiPair;

export {
    provider,
    ExchangeRouter,
    poolAbi,
    
    DMTokenContract,
    USDTContract,
    ETHContract,
    TRXContract,
    FILContract,
    XRPContract,
    DOTContract,
    ADAContract,
    HTContract,

    DMStakingContract,
    USDTStakingContract,
    ETHStakingContract,
    TRXStakingContract,
    FILStakingContract,
    XRPStakingContract,
    DOTStakingContract,
    ADAStakingContract,
    HTStakingContract
}

