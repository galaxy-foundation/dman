import React ,{createContext, useContext, useMemo} from 'react';

import { toast } from 'react-toastify';
import {ethers} from "ethers"
import {DMTokenContract,USDTContract} from "./contracts";
import {tips, NF, fromValue, toValue, tokenData, errHandler} from './util';
import { useWallet } from "use-wallet";


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


export default function Provider ({children}) {
    const wallet = useWallet();    
	const [status, setStatus] = React.useState<ContractStatus>({
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

	React.useEffect(()=>{
		if (wallet.status==="connected") {
			checkBalance(wallet.account);
		}
	},[wallet.status])

	const checkBalance = async (account) => {
		console.log('checkBalance')
		if (!account) return;
		try {
			const res = await DMTokenContract.getStakerInfo(account);
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
	}

	return (
		<AppContext.Provider
			value = {useMemo(
				()=>[
					status,
					{
						checkBalance
					}
				],
				[status]
			)}
		>
			{children}
		</AppContext.Provider>
	);
};
