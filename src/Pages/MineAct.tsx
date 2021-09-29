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
} from "../contracts"

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
	//routing
	let history = useHistory();
	const {id} = props.match.params;
	useEffect(()=>{
		if(contracts[id]===undefined)
			history.push("/")
	},[])

	//wallet & contracts
	const wallet = useWallet();
	const [signedTokenContracts,setSignedTokenContracts] = useState(DMTokenContract);
	const [signedStakingContracts,setSignedStakingContracts] = useState(DMStakingContract);
	
	useEffect(()=>{
		const setSignedContracts = async ()=>{
				const provider = new ethers.providers.Web3Provider(wallet.ethereum);
				const signer =await provider.getSigner();
				var signedTokenContracts =contracts[id]===undefined?"":((contracts[id].stakeTokenContract).connect(signer));
				var signedStakingContracts =contracts[id]===undefined?"":((contracts[id].stakingContract).connect(signer));
				console.log(signedTokenContracts)
				setSignedTokenContracts(signedTokenContracts);
				setSignedStakingContracts(signedStakingContracts);
			}
		
		if(wallet.status==="connected"){
			setSignedContracts();
		}
	},[wallet.status])

	// status
	const [status,setStatus] = useState({
		reward:0,
		stakedAmount:0,
		stakeAmount:0,
		withdrawAmount:0
	});
	const [loading,setLoading] = useState(false);

	//setStatus

	const handleAmount = (e:any)=>{
		setStatus({...status,stakeAmount:e.target.value});
	}

	const setStakedStatus =async ()=>{
		var stakedAmount =await signedStakingContracts.stakeAmounts(wallet.account);
		setStatus({...status,stakedAmount:stakedAmount});
		var reward =await signedStakingContracts.rewards(wallet.account);
		setStatus({...status,reward:reward});
	}

	useEffect(()=>{
		if(wallet.status==="connected"){
			setStakedStatus();
		}
	},[signedStakingContracts])

	//actions 

	const handleStaking =async ()=>{
		if(loading!==true&&wallet.status==="connected"&&status.stakeAmount!==0){
			let tokenDecimals = (await signedTokenContracts.decimals()).toString();
			let stakeAmount = ethers.utils.parseUnits((status.stakeAmount).toString(),tokenDecimals)

			var allowance =await signedTokenContracts.allowance(wallet.account,signedStakingContracts.address);
			if(id==="USDT"&&allowance.toString()!=="0"&&allowance<stakeAmount){
				stakeAmount = allowance;
			}
			if(allowance<stakeAmount) {
				var tx = await signedTokenContracts.approve(signedStakingContracts.address,stakeAmount.sub(allowance))
					.catch((err)=>{
						console.log(err)
						alert("OOPs, Something wrong while approve!");
						setLoading(false)
					});
				if(tx!=null){
					await tx.wait();
					staking(stakeAmount);
				}
			}
			else {
				staking(stakeAmount);
			}
		}
		else {
			alert("OOPs, Something wrong!");
		}
	}

	const staking =async (stakeAmount:any)=>{
		var tx = await signedStakingContracts.stake(stakeAmount)
			.catch(err=>{
				console.log(err)
				setLoading(false);
			})
		if(tx!=null){
			await tx.wait();
			setLoading(false);
		}
	}

	const handleClaimReward = async ()=>{
		if(loading!==true&&wallet.status==="connected"){
			
			setLoading(true);
			var tx = await signedStakingContracts.claimRewards()
			.catch(err=>{
				alert("You can't harvest in 30 Days");
				console.log(err)
				setLoading(false);
			})
			if(tx!=null){
				await tx.wait();
				setLoading(false);
			}
		}
	}

	const handleWithdraw = async ()=>{
		if(loading!==true&&wallet.status==="connected"){
			setLoading(true);
			let tokenDecimals = (await signedTokenContracts.decimals()).toString();
			let amount = ethers.utils.parseUnits((status.withdrawAmount).toString(),tokenDecimals)

			var tx = await signedStakingContracts.withdraw(amount)
			.catch(err=>{
				console.log(err)
				setLoading(false);
			})
			if(tx!=null){
				await tx.wait();
				setLoading(false);
			}
		}
	}
	return <Layout className="mine">
		<div style={{display:'flex',padding:20}}>
			<div style={{width:'50%'}}>
				<h3>已赚取</h3>
				<code className="h3">0.00</code>
			</div>
			<div style={{width:'50%'}}>
				<h3>年化利率</h3>
				<code className="h3">117.83%</code>
			</div>
		</div>
		<div className="mt-3" style={{backgroundColor:'#2e3548', borderRadius: 5, padding: '20px 50px'}}>
			<h3><span className="success">DM</span>已赚取</h3>
			<div className="mt-4" style={{display:'flex', justifyContent:'space-between'}}>
				<span className="success">0.00</span>
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
		<div className="mt-3 h3" style={{fontWeight:400}}>
			<div className="mt-3" style={{display:'flex', justifyContent:'space-between'}}>
				<span>年化利率</span>
				<span>117.83%</span>
			</div>
			<div className="mt-3" style={{display:'flex', justifyContent:'space-between'}}>
				<span>倍数</span>
				<span>1x</span>
			</div>
			<div className="mt-3" style={{display:'flex', justifyContent:'space-between'}}>
				<span>流动性</span>
				<span>$ 6,139,061</span>
			</div>
		</div>
	</Layout>;
};

export default MineAct;