import React ,{createContext, useContext, useState, useEffect, useMemo} from 'react';

/* import { toast } from 'react-toastify'; */
import {ethers} from "ethers"
import {DMTokenContract/* ,USDTContract,ExchangeRouter,poolAbi,provider */} from "./config";
import {/* tips, NF,  */fromValue, /* toValue, tokenData,  */errHandler} from './util';
import { useWallet } from "use-wallet";
import axios from "axios";


const AppContext = createContext<any>({})

export const useAppContext = ()=>{
	return useContext(AppContext)
}
interface PoolTypes {
	[key:string]: {
		reward: number
		daily:  number
		apr:	number
		total : any
	}
}

export interface ContractStatus {
	inited: boolean
	available: boolean
	
	isEnd: boolean
	presaleEndtime: number
	limit1: number
	limit2: number
	remainder: number
	reward: number
	dmBalance: number
	usdtBalance: number
	unlockable: number
	rewardPool: number 
	rewardedTotal: number
	insurancePool: number
	insuranceBurnt: number
	reserve0:number
	reserve1:number
	feeCacheAmount:number
	
	pools: PoolTypes
}
export interface CURRENCYPRICE {
	CNY:	number
	DM:		number
	USDT:	number
	ETH:	number
	TRX:	number
	FIL:	number
	XRP:	number
	DOT:	number
	ADA:	number
	HT:		number
}
export interface PoolResearve {
	reserve0: Number 
	reserve1: Number
}


export default function Provider ({children}) {
    const wallet = useWallet();    
	const [status, setStatus] = useState<ContractStatus>({
		inited: false,
		available: false,

		isEnd:false, 
		presaleEndtime: 0,
		limit1:0, 
		limit2:0, 
		remainder:0, 
		reward:0, 
		dmBalance:0, 
		usdtBalance:0,
		unlockable:0,
		rewardPool: 0,
		rewardedTotal: 0,
		insurancePool: 0,
		insuranceBurnt: 0,
		reserve0:0,
		reserve1:0,
		feeCacheAmount:0,
		pools:{}
	})

	/* const [poolBalance , setPoolBalance] = useState<PoolResearve>({
		reserve0:0,
		reserve1:0
	}) */

	const [tokenPrices, setTokenPrices] = useState<CURRENCYPRICE>({
		"CNY": 6.4,
		"DM": 1,
		"USDT": 1,
		"ETH": 3501.15,
		"TRX": 0.094338,
		"FIL": 68.66,
		"XRP": 1,
		"DOT": 33.69,
		"ADA": 2.12,
		"HT": 7.25
	})
	const [logs, setLogs] = useState<Array<{time:number, tvl:number}>>([]);

	const [referral,setReferral] = useState("");

	React.useEffect(()=>{
		checkBalance(wallet.account || '0x0000000000000000000000000000000000000000');
	},[wallet.status])

	const updateTokenPrices = async () => {
		try{
			const tokenPrices:any = await axios.post(process.env.REACT_APP_ENDPOINT+"api/logs");
			const {logs, prices} = tokenPrices.data
			setTokenPrices(prices);
			setLogs(logs);
		}catch(err){
			console.log(err)
		}
	}

	useEffect(()=>{
		getReferral();
		setInterval(updateTokenPrices,5000);
	},[])

	useEffect(()=>{
		
		const timer = setTimeout(()=>checkBalance(wallet.account),5000);
		return ()=>clearTimeout(timer)
	})

	const checkBalance = async (account) => {
		console.log('checkBalance',account)
		try {
			const Daily = 360000;
			const poolList = [
				{token:'DM',   daily:Math.round(Daily*0.22)},  
				{token:'USDT', daily:Math.round(Daily*0.10)},  
				{token:'ETH',  daily:Math.round(Daily*0.10)},  
				{token:'TRX',  daily:Math.round(Daily*0.10)},  
				{token:'FIL',  daily:Math.round(Daily*0.10)},  
				{token:'XRP',  daily:Math.round(Daily*0.10)},  
				{token:'DOT',  daily:Math.round(Daily*0.10)},  
				{token:'ADA',  daily:Math.round(Daily*0.10)},  
				{token:'HT',   daily:Math.round(Daily*0.8),},  
			];
			const res = await DMTokenContract.getStakerInfo(account || '0x0000000000000000000000000000000000000000');
			let {isEnd, params, pools, isFirst} = res;
			let i = 0;
			let presaleEndtime = Number(params[i++]);
			let limit1=fromValue(params[i++], 'DM');
			let limit2=fromValue(params[i++], 'DM');
			let remainder=fromValue(params[i++], 'DM');
			let reward=fromValue(params[i++], 'USDT');
			let dmBalance=fromValue(params[i++], 'DM');
			let usdtBalance=fromValue(params[i++], 'USDT');
			let unlockable=fromValue(params[i++], 'DM');
			let rewardPool=fromValue(params[i++], 'USDT');
			let rewardedTotal=fromValue(params[i++], 'USDT');
			let insurancePool=fromValue(params[i++], 'USDT');
			let insuranceBurnt=fromValue(params[i++], 'DM');
			let reserve0 = fromValue(params[i++], 'USDT'); // Number(ethers.utils.formatUnits(pairUsdtBalance,6)),
			let reserve1 = fromValue(params[i++], 'DM'); // Number(ethers.utils.formatUnits(pairDMBalance,18))
			let feeCacheAmount = fromValue(params[i++], 'DM');

			if (isFirst) {
				let tmp = reserve1;
				reserve1 = reserve0
				reserve0 = tmp
			}

			const available = !isEnd && limit1 <= remainder

			let _pools:PoolTypes = {};

			let k=0;
			for(let i=0; i<poolList.length; i++) {
				const v = poolList[i];
				let _total = pools[k++];
				let _staking = pools[k++];
				let _reward = pools[k++];
				let _decimals = Number(pools[k++]);
				
				_decimals = Number(_decimals)
				_total = Number(ethers.utils.formatUnits(_total, _decimals))
				_staking = Number(ethers.utils.formatUnits(_staking, _decimals))
				_reward = Number(ethers.utils.formatUnits(_reward, 18))

				/* console.log("total",total, Number((v.daily * _staking / total).toFixed(2))); */
				_pools[v.token] = {
					reward: _reward,
					daily:  _total===0 ? 0 : Number((v.daily * _staking / _total).toFixed(2)),
					apr:	_total===0 ? 0 : (v.daily * 365) / _total / tokenPrices[v.token]*100,
					total:  _total
				}
			}

			setStatus({
				inited:true,
				available,
				isEnd,
				presaleEndtime, 
				limit1, 
				limit2, 
				remainder, 
				reward, 
				dmBalance, 
				usdtBalance,
				unlockable,
				rewardPool,
				rewardedTotal,
				insurancePool,
				insuranceBurnt,
				reserve0,
				reserve1,
				feeCacheAmount,
				pools: _pools
			});
			console.log('checked Balance', _pools);
		} catch (err:any) {
			errHandler(err)
		}
	}

	const getReferral = ()=>{
		const matches = window.location.search.match(/\?r=([^&]*)/)
		if (matches) {
			var referral = String(matches[1]);
			if (/^0x[0-9a-fA-F]{40}$/.test(referral)) {
				setReferral(referral);
			}
		}
	}

	return (
		<AppContext.Provider
			value = {useMemo(
				()=>[
					status,
					tokenPrices,
					{
						checkBalance,
						referral,
						logs
					},
					
				],
				[status,tokenPrices,logs,referral]
			)}
		>
			{children}
		</AppContext.Provider>
	);
};
