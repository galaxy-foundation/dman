import React,{useState,useEffect} from 'react';
import Layout from '../components/Layout';
import {tips, NF, fromValue, toValue, tokenData, errHandler} from '../util';
import imgBG01 from '../assets/swap-bg-01.webp';
import imgBG03 from '../assets/swap-bg-03.webp';
import imgIC01 from '../assets/swap-ic-01.webp';
import {ethers} from "ethers"
import {useWallet} from 'use-wallet';
import {DMTokenContract} from "../contracts";

import {useAppContext} from '../context';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

const PRICE = 0.005;

const Presale = () => {
	const wallet = useWallet();

	const [token1Status,setToken1Status] = useState({token:"USDT",amount:200})
	const [token2Status,setToken2Status] = useState({token:"DM",amount:0})
	const [focus,setFocus] = useState(0)
	const [loading,setLoading] = useState(false)
	const [status,{checkBalance}] = useAppContext();
	const connected = wallet.status==="connected"
  	const getAmountIn =  ()=>{
		  setToken1Status({...token1Status,amount:token2Status.amount*PRICE});
    }

	const getAmountOut = ()=>{
		  setToken2Status({...token2Status,amount:token1Status.amount/PRICE});
    }

	useEffect(()=>{
		if(focus === 0){
			getAmountOut();
		}
	},[token1Status.amount])

	useEffect(()=>{
		if(focus === 1){
			getAmountIn();
		}
	},[token2Status.amount])

	
	const submit = async ()=>{
		try {
			if (token1Status.amount<status.limit1 * PRICE) return tips("最少 "+(status.limit1 * PRICE)+" u")
			if (token1Status.amount>status.limit2 * PRICE) return tips("最大 "+(status.limit2 * PRICE)+" u")
			if (connected) return tips("请连接Metamask钱包")
			if (loading) return tips("已进行中")
			setLoading(true)
			const provider = new ethers.providers.Web3Provider(wallet.ethereum);
			const signer =await provider.getSigner();
			let swapAmount = toValue(token1Status.amount, token1Status.token)
			const sigendContract = tokenData[token1Status.token].contract.connect(signer);
			var allowance =await sigendContract.allowance(wallet.account,DMTokenContract.address);
			if(allowance<swapAmount) {
				var tx = await sigendContract.approve(DMTokenContract.address,swapAmount.sub(allowance));
				await tx.wait();
			}
			await presale();
		} catch (err:any) {
			errHandler(err)
		}
		setLoading(false)
	}

	const presale =async ()=>{
		try {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum);
			const signer =await provider.getSigner();
			let swapAmount = toValue(token1Status.amount, token1Status.token)
			const sigendDMTokenContract = DMTokenContract.connect(signer);
			var tx = await sigendDMTokenContract.presale(swapAmount);
			if(tx) {
				await tx.wait();
				await checkBalance(wallet.account);
			}
		} catch (err:any) {
			errHandler(err)
		}
		setLoading(false);
	}

	const handleAmount1 = async (e:any)=>{
		setFocus(0)
		if(Number(e.target.value)<0){
			setToken1Status({...token1Status,amount:0})
		}
		else {
			var amount = parseFloat(Number(e.target.value).toFixed(8))
			setToken1Status({...token1Status,amount:amount})
		}
	}

	/* const handleAmount2 = async (e:any)=>{
		setFocus(1)
		if(Number(e.target.value)<0){
			setToken2Status({...token2Status,amount:0})
		}
		else {
			var amount = parseFloat(Number(e.target.value).toFixed(8))
			setToken2Status({...token2Status,amount:amount})
		}
	} */
	const unlock = async ()=>{
		try {
			if(connected) {
				setLoading(true);
				const provider = new ethers.providers.Web3Provider(wallet.ethereum);
				const signer =await provider.getSigner();
				const sigendDMTokenContract = DMTokenContract.connect(signer);
				
				var tx = await sigendDMTokenContract.unlock();
				if(tx){
					await tx.wait();
					await checkBalance(wallet.account);
				}
				setLoading(false);
			}
		} catch (err:any) {
			errHandler(err)
		}
	}
	const claimReward = async ()=>{
		try {
			if(connected) {
				setLoading(true);
				const provider = new ethers.providers.Web3Provider(wallet.ethereum);
				const signer =await provider.getSigner();
				const sigendDMTokenContract = DMTokenContract.connect(signer);
				
				var tx = await sigendDMTokenContract.claimReward();
				if(tx){
					await tx.wait();
					await checkBalance(wallet.account);
				}
				setLoading(false);
			}
		} catch (err:any) {
			errHandler(err)
		}
	}
	
	return <Layout className="swap">
		<div style={{position:'relative'}}>
			<div>
				<img src={imgBG01} alt="bg" style={{width:'100%',height:'auto'}} />
			</div>
			<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, display:'flex', alignItems:'center', justifyContent: 'center',padding:10}}>
				<img src={imgIC01} alt="icon" style={{width:'6em',height:'auto'}} />
				<h2>认购</h2>
			</div>
		</div>
		{status.inited ? (
			<>
				<div className="mt-3" style={{backgroundColor:'#363d50',borderRadius: 5, padding: 10}}>
					<div>{token1Status.token}</div>
					<div style={{/* position:'relative', */border:'1px solid gray', padding: 10}}>
						<input disabled={!status.available} onChange={handleAmount1} type="number" value={parseFloat(Number(token1Status.amount).toFixed(8))} min={status.limit1 * PRICE} max={status.limit2 * PRICE} className="h3" style={{marginBottom:0}} maxLength={12} />
					</div>
					<div>余额：{connected ? NF(status.usdtBalance, 2) + ' USDT' : '-'}</div>
					<div>认购限制： {!connected ? '-' : (!status.available ? <span style={{color:'red'}}>预售已经终了</span> : `${status.limit1 * PRICE} ~ ${status.limit2 * PRICE} USDT`)}</div>
					<p className="text-center mt-3"></p>
					<div>{token2Status.token}</div>
					<div style={{/* position:'relative', */border:'1px solid gray', padding: 10}}>
						<span className="h3" style={{color:'gray'}}>{NF(token2Status.amount, 2)}</span>
					</div>
					<div>余额： {connected ? NF(status.dmBalance, 2) + ' DM' : '-'}</div>
					<div className="text-center mt-3">
						<button disabled={!status.available || loading} className="btn btn-success px-5 round" onClick = {submit}>
							{loading?'处理中...':'预售认购'}
						</button>
					</div>
				</div>
				<div className="mt-3" style={{backgroundColor:'#363d50',borderRadius: 5, padding: 10}}>
					<div>认购稀放：</div>
					<div style={{/* position:'relative', */border:'1px solid gray', padding: 10}}>
						<span className="h3" style={{color:'gray'}}>{connected ? NF(status.unlockable, 2) + ' DM' : '-' }</span>
					</div>
					<div className="text-center mt-3">
						<button disabled={status.unlockable==0} className="btn btn-success px-5 round" onClick = {unlock}>
							提交稀放
						</button>
					</div>
				</div>
				<div className="mt-3" style={{position:'relative'}}>
					<div style={{opacity:0.8}}>
						<img src={imgBG03} alt="bg" style={{width:'100%',height:'auto'}} />
					</div>
					<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, padding:10, display:'flex', flexDirection:'column'}}>
						<div style={{flexGrow:1}}>
							<h3>解仓</h3>
							<div>{connected ? NF(status.reward, 2) + ' DM' : '-' }</div>
						</div>
						<div className="text-center mt-3">
							<button disabled={!connected || status.reward===0} className="btn btn-success px-5 round" onClick = {claimReward}>Claim Reward</button>
						</div>
					</div>
				</div>
			</>
		) : (
			<SkeletonTheme color="#3a455f" highlightColor="#45516e">
				<div className="mt-3" style={{backgroundColor:'#363d50',borderRadius: 5, padding: 10}}>
					<div><Skeleton width={50} /></div>
					<div><Skeleton height={50} /></div>
					<div><Skeleton width={100} /></div>
					<div><Skeleton width={50} /></div>
					<div><Skeleton height={50} /></div>
					<div><Skeleton width={100} /></div>
					<div style={{display:'flex', justifyContent:'center'}}><Skeleton width={150} height={50} /></div>
				</div>
				<div className="mt-3" style={{backgroundColor:'#363d50',borderRadius: 5, padding: 10}}>
					<div><Skeleton width={100} /></div>
					<div><Skeleton height={50} /></div>
					<div style={{display:'flex', justifyContent:'center'}}><Skeleton width={150} height={50} /></div>

				</div>
				<div className="mt-3" style={{position:'relative'}}>
					<div style={{opacity:0.8}}>
						<img src={imgBG03} alt="bg" style={{width:'100%',height:'auto'}} />
					</div>
					<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, padding:10, display:'flex', flexDirection:'column'}}>
						<div style={{flexGrow:1}}>
							<Skeleton width={100} />
						</div>
						<Skeleton className="text-center mt-3" height={50} />
					</div>
				</div>
			</SkeletonTheme>
		)}
	</Layout>
};

export default Presale;
