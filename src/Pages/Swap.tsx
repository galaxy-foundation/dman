import React from 'react';
/* import { useSelector} from 'react-redux'; */

import Layout from '../components/Layout';

import imgBgCell from '../assets/bg-cell.webp';

import imgBG01 from '../assets/swap-bg-01.webp';
/* import imgBG02 from '../assets/swap-bg-02.webp'; */
import imgBG03 from '../assets/swap-bg-03.webp';
import imgIC01 from '../assets/swap-ic-01.webp';
import imgIC02 from '../assets/swap-ic-02.webp';
import imgICExchange from '../assets/swap-ic-exchange.webp';
import {ethers} from "ethers"
import {tips, NF, /* fromValue, toValue,  */tokenData, errHandler} from '../util';
import {useWallet} from 'use-wallet';
import {/* DMTokenContract,USDTContract, */ExchangeRouter} from "../config";

import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import {useAppContext} from '../context';

const styledNum = (data:Number)=>{
	return parseFloat(Number(data).toFixed(8))
}

const feeRates = {
	"insurrancePool" : 0.13,
	"rewardPool":0.33
}

const Swap = () => {
	const wallet = useWallet();
	const connected = wallet.status==="connected"
	const [status,,{checkBalance}] = useAppContext();

	const [token2,setToken2] = React.useState({
		token:"DM",
		amount:0,
	})
	
	const [token1,setToken1] = React.useState({
		token:"USDT",
		amount:0,
	})

	const [focus,setFocus] = React.useState(0)
	const [loading,setLoading] = React.useState(false);

  	/* const getAmountIn = async ()=>{
		if (token2.amount === 0&&status.reserve0 === 0&&status.reserve1 === 0) return;
		if(token1.token === "USDT"){
			let numerator = status.reserve0 * token2.amount;
			let denominator = (status.reserve1 - token2.amount)*0.997;
			setToken1({...token1,amount:(numerator /denominator) + 1});
		} else {
			let numerator = status.reserve1 * token2.amount;
			let denominator = (status.reserve0 - token2.amount)*0.997;
			setToken1({...token1,amount:(numerator /denominator) + 1});
		}
    } */

	const vGetAmountOut = (amount) =>{
		let amountWithFee = amount * 997 * 0.85;
		let numerator = amountWithFee * status.reserve1;
		let denominator = status.reserve0 * 1000 + amountWithFee;
		let amountOut =   numerator / denominator;
		
		return amountOut;
	}

	const getAmountOut = async ()=>{
		if (token1.amount === 0 && status.reserve0 === 0&& status.reserve1 === 0) return;
		if(token1.token === "USDT"){
			let amountWithFee = token1.amount * 997;
			let numerator = amountWithFee * status.reserve0;
			let denominator = status.reserve1 * 1000 + amountWithFee;
			let amountOut =   numerator / denominator;

			// console.log(`amountOut:${amountOut}`)
			setToken1({...token1, amount:styledNum(token1.amount + 0)})
			setToken2({...token2, amount:styledNum(amountOut/*  * 0.85 */)}); // 
		} else {
			let amountWithFee = token1.amount * 997 * 0.85;
			let numerator = amountWithFee * status.reserve1;
			let denominator = status.reserve0 * 1000 + amountWithFee;
			let amountOut =   numerator / denominator;
			setToken1({...token1, amount:styledNum(token1.amount + 0)})
			console.log(styledNum(token1.amount + 0))
			setToken2({...token2, amount:styledNum(amountOut)}); // 	
		}
    }

	React.useEffect(()=>{
		if(focus === 0){
			getAmountOut();
		}
	},[token1.amount])

	/* React.useEffect(()=>{
		if(focus === 1){
			getAmountIn();
		}
	},[token2.amount]) */

	const handleChangeTokens = ()=>{
		setFocus(0);
		setToken2({...token1});
		setToken1({...token2});
	}

	const handleSwap = async ()=>{
		var amountInBalance = token1.token === "DM" ? status.dmBalance :status.usdtBalance ;
		if(amountInBalance < token1.amount ) return tips("余额不足");
		try {
			if (token1.amount<=0) return tips("最少 10 u")
			if (token2.amount<=0) return tips("最少 10 u")
			if (wallet.status!=="connected") return tips("请连接Metamask钱包")
			if (loading) return tips("已进行中")
			setLoading(true)
			const provider = new ethers.providers.Web3Provider(wallet.ethereum);
			const signer =await provider.getSigner();
			let swapAmount = ethers.utils.parseUnits((token1.amount).toString(),tokenData[token1.token].decimals)
	
			const sigendContract = tokenData[token1.token].contract.connect(signer);
			var allowance =await sigendContract.allowance(wallet.account, ExchangeRouter.address);
			if(allowance.lt(swapAmount)) {
				var tx;
				if (token1.token==="USDT" && Number(allowance) > 0) {
					tx = await sigendContract.approve(ExchangeRouter.address, 0)
					if(tx != null) {
						await tx.wait();
					}
				}
				tx = await sigendContract.approve(ExchangeRouter.address, swapAmount)
				if(tx != null) {
					await tx.wait();
				}
			}
			await swapToken();
			
		} catch (err:any) {
			errHandler(err)
		}
		setLoading(false)
	}

	const swapToken =async ()=>{
		const provider = new ethers.providers.Web3Provider(wallet.ethereum);
		const signer =await provider.getSigner();
		var path = [tokenData[token1.token].address,tokenData[token2.token].address];
		let swapAmount = ethers.utils.parseUnits((token1.amount).toString(),tokenData[token1.token].decimals);
		var date=new Date();
		var seconds = Math.floor(date.getTime() / 1000)+1000000;
		const sigendExchangeContract = ExchangeRouter.connect(signer);
		var tx = await sigendExchangeContract.swapExactTokensForTokensSupportingFeeOnTransferTokens(swapAmount,0,path,wallet.account,seconds)
		if(tx != null){
			await tx.wait();
			await checkBalance(wallet.account);
			setToken1({...token1, amount:0});
			setToken2({...token2, amount:0});
		}
	}

	const handleAmount1 = async (e:any)=>{
		setFocus(0)
		if(Number(e.target.value)<0){
			setToken1({...token1,amount:0})
		} else {
			var amount = parseFloat(Number(e.target.value).toFixed(8))
			setToken1({...token1,amount:amount})
		}
	}

	const handleAmount2 = async (e:any)=>{
		setFocus(1)
		if(Number(e.target.value)<0){
			setToken2({...token2,amount:0})
		} else {
			var amount = parseFloat(Number(e.target.value).toFixed(8))
			setToken2({...token2,amount:amount})
		}
	}

	return <Layout className="swap">
		<div style={{position:'relative'}}>
			<div>
				<img src={imgBG01} alt="bg" style={{width:'100%',height:'auto'}} />
			</div>
			<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, display:'flex', alignItems:'center', justifyContent: 'center',padding:10}}>
				<img src={imgIC01} alt="icon" style={{width:'6em',height:'auto'}} />
				<h2>兑换获得奖励</h2>
			</div>
		</div>
		{status.inited ? (
			<>
				<div className="mt-3" style={{backgroundColor:'#363d50',borderRadius: 5, padding: 10}}>
					<h3 className="text-center">兑换</h3>
					<div style={{display:'flex', justifyContent: 'space-between'}}>
						<div><b>{token1.token}</b></div>
						<div style={{color:'#aaa'}}>余额 {connected ? NF(token1.token==="USDT" ? status.usdtBalance : status.dmBalance, 2) + ' ' + token1.token : '-'}</div>
					</div>
					<div style={{position:'relative',border:'1px solid gray', padding: 10}}>
						<input onChange={handleAmount1} type="number" value={parseFloat(Number(token1.amount).toFixed(8))} className="h3" style={{marginBottom:0}} maxLength={12} />
						<button onClick={()=>setToken1({...token1, amount:token1.token==='USDT' ? status.usdtBalance : status.dmBalance })} className="btn btn-sm btn-outline-success" style={{position:'absolute',right:10}}>MAX</button>
					</div>
					<p className="text-center mt-3"><img src={imgICExchange}  alt="icon" style={{width:'1.5em',height:'auto'}} onClick = {handleChangeTokens}/></p>
					<div style={{display:'flex', justifyContent: 'space-between'}}>
						<div><b>{token2.token}</b></div>
						<div style={{color:'#aaa'}}>余额 {connected ? NF(token2.token==="USDT" ? status.usdtBalance : status.dmBalance, 2) + ' ' + token2.token : '-'}</div>
					</div>
					<div style={{position:'relative',border:'1px solid gray', padding: 10}}>
						<input disabled={true} /* onChange={handleAmount2} */ type="number" value={parseFloat(Number(token2.amount).toFixed(8))} className="h3" style={{marginBottom:0}} maxLength={12} />
						{/* <button onClick={()=>setToken1({...token2, amount:token2.token==='USDT' ? status.usdtBalance : status.dmBalance })} className="btn btn-sm btn-outline-success" style={{position:'absolute',right:10}}>MAX</button> */}
					</div>
					<div className="text-center mt-3">
						{connected ? <button className="btn btn-success px-5 round" onClick = {handleSwap}>提交</button> : <span>请连接钱包</span>}
					</div>
				</div>
				<div className="mt-3" style={{position:'relative'}}>
					<div style={{opacity:0.8}}>
						<img src={imgBgCell} alt="bg" style={{width:'100%',height:'auto'}} />
					</div>
					<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, display:'flex', alignItems:'center', justifyContent: 'center'}}>
						<h3 style={{marginRight:20}}>交易就送DM</h3>
						<img src={imgIC02} alt="bg" style={{width:'10em',height:'auto'}} />
					</div>
				</div>
				<div className="mt-3" style={{position:'relative'}}>
					<div style={{opacity:0.8}}>
						<img src={imgBG03} alt="bg" style={{width:'100%',height:'auto'}} />
					</div>
					<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, padding: 20, display:'flex', flexDirection:'column'}}>
						<div style={{flexGrow:1}}>
							<h3>权益池</h3>
							<code>{Math.round(status.rewardPool + status.rewardedTotal + vGetAmountOut(status.feeCacheAmount*feeRates["rewardPool"]))}枚</code>
						</div>
						<div style={{display:'flex',justifyContent:'space-between'}}>
							<span>剩余币量：{Math.round(status.rewardPool + vGetAmountOut(status.feeCacheAmount*feeRates["rewardPool"]))}枚</span>
							<span>总分红币量：{Math.round(status.rewardedTotal)}枚</span>
						</div>
					</div>
				</div>
				<div className="mt-3" style={{position:'relative'}}>
					<div style={{opacity:0.8}}>
						<img src={imgBG03} alt="bg" style={{width:'100%',height:'auto'}} />
					</div>
					<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, padding: 20, display:'flex', flexDirection:'column'}}>
						<div style={{flexGrow:1}}>
							<h3>保险池</h3>
							<code>{Math.round(status.insurancePool + vGetAmountOut(status.feeCacheAmount*feeRates["insurrancePool"]) )}枚</code>
						</div>
						<div style={{display:'flex',justifyContent:'end'}}>
							销毁 {Math.round(status.insuranceBurnt)}枚
						</div>
					</div>
				</div>
			</>
		) : (
			<SkeletonTheme color="#3a455f" highlightColor="#45516e">
				<div className="mt-3" style={{backgroundColor:'#363d50',borderRadius: 5, padding: 10}}>
					<h3 className="text-center">兑换</h3>
					<div style={{display:'flex', justifyContent:'space-between'}}>
						<Skeleton width={50} />
						<Skeleton width={100} />
					</div>
					<div><Skeleton height={50} /></div>
					<p className="text-center mt-3"><img src={imgICExchange}  alt="icon" style={{width:'1.5em',height:'auto'}} /></p>
					<div style={{display:'flex', justifyContent:'space-between'}}>
						<Skeleton width={50} />
						<Skeleton width={100} />
					</div>
					<div><Skeleton height={50} /></div>
					<div style={{display:'flex', justifyContent:'center'}}><Skeleton width={150} height={50} /></div>
				</div>
				<div className="mt-3" style={{position:'relative'}}>
					<div style={{opacity:0.8}}>
						<img src={imgBgCell} alt="bg" style={{width:'100%',height:'auto'}} />
					</div>
					<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, display:'flex', alignItems:'center', justifyContent: 'center'}}>
						<h3 style={{marginRight:20}}>交易就送DM</h3>
						<img src={imgIC02} alt="bg" style={{width:'10em',height:'auto'}} />
					</div>
				</div>
			</SkeletonTheme>
		)}
	</Layout>;
};

export default Swap;