/* import React from 'react'; */
/* import { useSelector} from 'react-redux'; */
import { useEffect,useState } from 'react';
import Layout from '../components/Layout';
import {useHistory} from "react-router-dom";
import {useWallet} from 'use-wallet';
import {ethers} from 'ethers';
import {
	DMTokenContract,USDTContract,
    ETHContract,TRXContract,FILContract,XRPContract,DOTContract,ADAContract,HTContract,
    DMStakingContract,USDTStakingContract,ETHStakingContract,TRXStakingContract,FILStakingContract,XRPStakingContract,DOTStakingContract,ADAStakingContract,HTStakingContract
} from "../config"
import { errHandler, tips } from '../util';

import {useAppContext} from '../context';

const contracts = {
	DM:{
		stakeTokenContract: DMTokenContract,
		stakingContract:DMStakingContract,
	},
	USDT:{
		stakeTokenContract: USDTContract,
		stakingContract:USDTStakingContract,
	},
	ETH:{
		stakeTokenContract: ETHContract,
		stakingContract:ETHStakingContract,
	},
	TRX:{
		stakeTokenContract: TRXContract,
		stakingContract:TRXStakingContract,
	},
	FIL:{
		stakeTokenContract: FILContract,
		stakingContract:FILStakingContract,
	},
	XRP:{
		stakeTokenContract: XRPContract,
		stakingContract:XRPStakingContract,
	},
	DOT:{
		stakeTokenContract: DOTContract,
		stakingContract:DOTStakingContract,
	},
	ADA:{
		stakeTokenContract: ADAContract,
		stakingContract:ADAStakingContract,
	},
	HT:{
		stakeTokenContract: HTContract,
		stakingContract:HTStakingContract,
	},
}

const MineAct = (props) => {
	const wallet = useWallet();
	const connected = wallet.status==="connected"
	const [,,tokenPrices,{referral}] = useAppContext();
	//routing
	let history = useHistory();
	const {id} = props.match.params;
	
	useEffect(()=>{
		if(contracts[id]===undefined) {
			history.push("/")
		}
	},[])

	const [signedTokenContracts,setSignedTokenContracts] = useState(DMTokenContract);
	const [signedStakingContracts,setSignedStakingContracts] = useState(DMStakingContract);
	useEffect(()=>{
		if(contracts[id]!==undefined) {
			const setSignedContracts = async ()=>{
				try {
				const provider = new ethers.providers.Web3Provider(wallet.ethereum);
				const signer =await provider.getSigner();
				var signedTokenContracts = (contracts[id].stakeTokenContract).connect(signer);
				var signedStakingContracts = (contracts[id].stakingContract).connect(signer);
				console.log(signedTokenContracts)
				setSignedTokenContracts(signedTokenContracts);
				setSignedStakingContracts(signedStakingContracts);
				} catch (err) {
					errHandler(err);
				}
			}
			
			if(connected){
				setSignedContracts();
			}
		}
	},[wallet.status])

	// status
	const [status,setStatus] = useState({
		rewardable:0,
		rewards:0,
		interest:0,
		stakedAmount:0,
		stakeAmount:0,
		withdrawAmount:0,

		total:0,
		apr:0,
		multiplier:0,
		
	});
	const [loading,setLoading] = useState(false);

	//setStatus

	const handleAmount = (e:any)=>{
		setStatus({...status,stakeAmount:e.target.value});
	}

	const setStakedStatus =async ()=>{
		try{
			const  res =await signedStakingContracts.getStakeInfo(wallet.account);
			const {_total, _staking, _rewards, _rewardable} = res;
			if (tokenPrices[id]) {
				const price = tokenPrices[id]
				setStatus({...status, stakedAmount:Number(_staking.div(1e18)), rewards:_rewards, rewardable:Number(_rewardable.div(1e18))});
				
				// var reward =await signedStakingContracts.rewards(wallet.account);
				// setStatus({...status, reward:_reward});	
			}
			
		} catch (err) {
			errHandler(err)
		}
	}

	useEffect(()=>{
		if(connected){
			setStakedStatus();
		}
	},[signedStakingContracts])

	//actions 

	const handleStaking =async ()=>{
		try {
			if (status.stakeAmount<=0) return tips("少于100以上")
			if (wallet.status!=="connected") return tips("请连接Metamask钱包")
			if (loading) return tips("已进行中")
			setLoading(true);
			let tokenDecimals = (await signedTokenContracts.decimals()).toString();
			let stakeAmount = ethers.utils.parseUnits((status.stakeAmount).toString(),tokenDecimals)
			var allowance =await signedTokenContracts.allowance(wallet.account,signedStakingContracts.address);
			if(id==="USDT"&&allowance.toString()!=="0"&&allowance<stakeAmount){
				stakeAmount = allowance;
			}
			if(allowance<stakeAmount) {
				var tx = await signedTokenContracts.approve(signedStakingContracts.address,stakeAmount.sub(allowance))
				if(tx!=null) {
					await tx.wait();
				}
			}
			await staking(stakeAmount);
		} catch (err) {
			errHandler(err)
		}
		setLoading(false);
	}

	const staking =async (stakeAmount:any)=>{
		var tx = await signedStakingContracts.stake(stakeAmount, referral ? referral : '0x0000000000000000000000000000000000000000')
		if(tx!=null){
			await tx.wait();
		}
	}

	const handleClaimReward = async ()=>{
		try {
			if (wallet.status!=="connected") return tips("请连接Metamask钱包")
			if (loading) return tips("已进行中")
			setLoading(true);
			var tx = await signedStakingContracts.claimRewards();
			if(tx!=null){
				await tx.wait();
				
			}
		} catch (err) {
			errHandler(err)
		}
		setLoading(false);
	}

	const handleUnstaking = async ()=>{
		try {
			if (wallet.status!=="connected") return tips("请连接Metamask钱包")
			if (loading) return tips("已进行中")
			setLoading(true);
			var tx = await signedStakingContracts.unstaking()
			if(tx!=null) {
				await tx.wait();
			}
		} catch (err) {
			errHandler(err)
		}
		setLoading(false);
	}

	return <Layout className="mine">
		<div style={{display:'flex',padding:20}}>
			<div style={{width:'50%'}}>
				<h3>已赚取</h3>
				<code className="h3">{connected ? status.rewards : '-'}</code>
			</div>
			<div style={{width:'50%'}}>
				<h3>年化利率</h3>
				<code className="h3">{connected ? status.interest + '%' : '-'}</code>
			</div>
		</div>
		<div className="mt-3" style={{backgroundColor:'#2e3548', borderRadius: 5, padding: '20px 50px'}}>
			<h3><span className="success">DM</span>可赚取</h3>
			<div className="mt-4" style={{display:'flex', justifyContent:'space-between'}}>
				<span className="success">{connected ? status.rewardable : '-'}</span>
				<button className="h3 btn btn-success round" onClick={handleClaimReward}>收割</button>
			</div>
		</div>
		<div className="mt-3" style={{backgroundColor:'#2e3548', borderRadius: 5, padding: '20px 50px'}}>
			<h3><span className="success">开始挖矿</span></h3>
			<input onChange={handleAmount} type="number" value={status.stakeAmount} className="h3" style={{marginBottom:0}} maxLength={12} />
			<div className="mt-4">
				<button className="w-100 h3 btn btn-success round" onClick={handleStaking}>解锁钱包</button>
			</div>
		</div>
		<div className="mt-3" style={{backgroundColor:'#2e3548', borderRadius: 5, padding: '20px 50px'}}>
			<h3><span className="success">DM</span>Unstaking</h3>
			<div className="mt-4" style={{display:'flex', justifyContent:'space-between'}}>
				<span className="success">{connected ? status.stakedAmount : '-'}</span>
			</div>
			<div className="mt-4">
				<button className="w-100 h3 btn btn-warning round" onClick={handleUnstaking}>Submit</button>
			</div>
		</div>
		<div className="mt-3 h3" style={{fontWeight:400}}>
			<div className="mt-3" style={{display:'flex', justifyContent:'space-between'}}>
				<span>年化利率</span>
				<span>{connected ? status.interest + '%' : '-'}</span>
			</div>
			<div className="mt-3" style={{display:'flex', justifyContent:'space-between'}}>
				<span>倍数</span>
				<span>{connected ? status.multiplier + 'x' : '-'}</span>
			</div>
			<div className="mt-3" style={{display:'flex', justifyContent:'space-between'}}>
				<span>流动性</span>
				<span>{connected ? '$' + status.total : '-'}</span>
			</div>
		</div>
	</Layout>;
};

export default MineAct;