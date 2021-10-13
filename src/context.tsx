import React ,{createContext, useContext, useState, useEffect, useMemo} from 'react';

import { toast } from 'react-toastify';
import {ethers} from "ethers"
import {DMTokenContract,USDTContract,ExchangeRouter,poolAbi,provider} from "./contracts";
import {tips, NF, fromValue, toValue, tokenData, errHandler} from './util';
import { useWallet } from "use-wallet";
import axios from "axios";


const AppContext = createContext<any>({})

export const useAppContext = ()=>{
	return useContext(AppContext)
}

export interface ContractStatus {
	inited: boolean
	available: boolean
	
	isEnd: boolean

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
	})

	const [poolBalance , setPoolBalance] = useState<PoolResearve>({
		reserve0:0,
		reserve1:0
	})

	const [tokenPrices, setTokenPrices] = useState<any>({
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

	const [stakeRate, setStakeRate] = useState<any>({});

	React.useEffect(()=>{
		checkBalance(wallet.account);
		getPoolBalance();
	},[wallet.status])

	const getPoolBalance = async () => {
		try{
			var pairAddress = await DMTokenContract.pancakeswapMDUSDTPair();
			var pairUsdtBalance = await USDTContract.balanceOf(pairAddress);
			var pairDMBalance = await DMTokenContract.balanceOf(pairAddress);
			setPoolBalance ({
				reserve0 : Number(ethers.utils.formatUnits(pairUsdtBalance,6)),
				reserve1 : Number(ethers.utils.formatUnits(pairDMBalance,18))
			})
		} catch (err:any) {
			errHandler(err)
		}
	}

	const updateTokenPrices = async () => {
		try{
			let tokenPrices = await axios.post(process.env.REACT_APP_ENDPOINT+"api/getCoinPrice");
			setTokenPrices(tokenPrices.data)
		}catch(err){

		}
	}

	useEffect(()=>{
		setInterval(updateTokenPrices,5000);
	},[])

	const checkBalance = async (account) => {
		console.log('checkBalance')
		try {
			const res = await DMTokenContract.getStakerInfo(account || '0x0000000000000000000000000000000000000000');
			let {isEnd, params} = res;
			let i = 0;
			let limit1=fromValue(params[i++], 'DM');
			let limit2=fromValue(params[i++], 'DM');
			let remainder=fromValue(params[i++], 'DM');
			let reward=fromValue(params[i++], 'DM');
			let dmBalance=fromValue(params[i++], 'DM');
			let usdtBalance=fromValue(params[i++], 'USDT');
			let unlockable=fromValue(params[i++], 'DM');
			let rewardPool=fromValue(params[i++], 'DM');
			let rewardedTotal=fromValue(params[i++], 'DM');
			let insurancePool=fromValue(params[i++], 'DM');
			let insuranceBurnt=fromValue(params[i++], 'DM');
	
			const available = !isEnd && limit1 <= remainder
			setStatus({
				inited:true,
				available,
				isEnd, 
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
			})
		} catch (err:any) {
			errHandler(err)
		}

		try {
			getPoolBalance()
		} catch (err:any) {
			errHandler(err)
		}
	}

	return (
		<AppContext.Provider
			value = {useMemo(
				()=>[
					status,
					poolBalance,
					tokenPrices,
					{
						checkBalance
					}
				],
				[status,poolBalance,tokenPrices]
			)}
		>
			{children}
		</AppContext.Provider>
	);
};
