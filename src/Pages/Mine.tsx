import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import Layout from '../components/Layout'
import Icons from '../components/Icons'
import imgBgCell from '../assets/bg-cell.webp'
import imgCurve from '../assets/mine-curve.svg'
import imgRadial from '../assets/mine-radial.webp'
import imgSpin from '../assets/spin.svg'
import {useWallet} from 'use-wallet';

import {MineState} from '../@types/store'
import {useAppContext} from '../context'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer} from 'recharts'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'

const Mine = () => {
	const wallet = useWallet();
	const [status,,prices] = useAppContext();
	/* const Daily = 328767; */

	const [data] = React.useState<MineState>({
		pairs: [
			'DM',
			'USDT',
			'ETH',
			'TRX',
			'FIL',
			'XRP',
			'DOT',
			'ADA',
			'HT',
		],

		chart: [
			{time:'17:00', y:100},
			{time:'18:00', y:200},
			{time:'19:00', y:150}, 
			{time:'20:00', y:300},
			{time:'21:00', y:250},
			{time:'22:00', y:500}
		]
	});
	const connected = wallet.status==="connected"

	/* useEffect(()=>{
		console.log("prices",prices);
	},[]) */

	const chart = {
		min: -1000,
		max: 0
	};

	for(let v of data.chart) {
		if (v.y && chart.max < v.y) {
			chart.max = v.y;
		}
		if (chart.min===-1000) {
			chart.min = v.y;
		} else if (chart.min>v.y) {
			chart.min = v.y;
		}
	}
	
	return <Layout className="mine">
		<div style={{position:'relative'}}>
			<div>
				<img src={imgBgCell} alt="bg" style={{width:'100%',height:'auto'}} />
			</div>
			<div style={{position:'absolute',bottom:20, right:70, textAlign: 'right'}}>
				<img src={imgCurve} alt="curve" style={{width:'50%',height:'auto'}} />
			</div>
			<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, padding:'50px 30px 10px 30px',backgroundColor:'#38497e63'}}>
				<h3>提供流动性获得奖励</h3>
				<div className="mt-3" style={{textAlign:'right'}}>
					<button className="btn btn-primary round">查看</button>
				</div>
			</div>
		</div>
		<div className="mt-3" style={{display:'flex',backgroundColor:'#2e3548', borderRadius: 5, padding: '10px 50px'}}>
			<div style={{position:'relative', width: "50%"}}>
				<img src={imgRadial} alt="radial" style={{width:'100%',height:'auto'}} />
				<div style={{position:'absolute',left:0,right:0,top:0,bottom:0,display:'flex', alignItems:'center',justifyContent:'center'}}>
					<div className="text-center">
						<h4>流动性挖矿</h4>
						<small>总锁仓量（USDT）</small>
					</div>
				</div>
			</div>
			<div style={{flexGrow:1, display:'flex', alignItems:'center', paddingLeft:20}}>
				<div>
					<h3 style={{display:'flex'}}><span className="ball" style={{backgroundColor:'#fda661',marginRight:10}} />LP</h3>
					<h3 style={{display:'flex'}}><span className="ball" style={{backgroundColor:'#868cff',marginRight:10}} />单币种</h3>
				</div>
			</div>
		</div>
		<div className="mt-2" style={{display:'flex',justifyContent:'space-between'}}>
			<div style={{display:'flex',alignItems:'center'}}>
				<span className="spin" style={{color:'red'}}>交易对/TVL</span>
				<div style={{display:'flex',flexDirection:'column'}}>
					<img src={imgSpin} alt="spin" style={{width:12,height:6,marginBottom:1}} />
					<img src={imgSpin} alt="spin" style={{width:12,height:6,marginTop:1,transform: 'rotate(180deg)'}} />
				</div>
			</div>
			<div style={{display:'flex',alignItems:'center'}}>
				<span className="spin">个人收益</span>
				<div style={{display:'flex',flexDirection:'column'}}>
					<img src={imgSpin} alt="spin" style={{width:12,height:6,marginBottom:1}} />
					<img src={imgSpin} alt="spin" style={{width:12,height:6,marginTop:1,transform: 'rotate(180deg)'}} />
				</div>
			</div>
			<div style={{display:'flex',alignItems:'center'}}>
				<span className="spin">日产量</span>
				<div style={{display:'flex',flexDirection:'column'}}>
					<img src={imgSpin} alt="spin" style={{width:12,height:6,marginBottom:1}} />
					<img src={imgSpin} alt="spin" style={{width:12,height:6,marginTop:1,transform: 'rotate(180deg)'}} />
				</div>
			</div>
			<div style={{display:'flex',alignItems:'center'}}>
				<span className="spin">APR</span>
				<div style={{display:'flex',flexDirection:'column'}}>
					<img src={imgSpin} alt="spin" style={{width:12,height:6,marginBottom:1}} />
					<img src={imgSpin} alt="spin" style={{width:12,height:6,marginTop:1,transform: 'rotate(180deg)'}} />
				</div>
			</div>
		</div>
		{!status.inited ? (
			<SkeletonTheme color="#3a455f" highlightColor="#45516e">
			<div className="mt-2" style={{display:'flex',backgroundColor:'#2e3548', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10}}>
				<table style={{width:'100%'}} cellPadding="5">
					<tbody>
						{data.pairs.map((v,k)=><Skeleton key={k} height={50} />)}
					</tbody>
				</table>
			</div>
			</SkeletonTheme>
		) : (
			<>
				<div className="mt-2" style={{display:'flex',backgroundColor:'#2e3548', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: 10}}>
					<table style={{width:'100%'}} cellPadding="5">
						<tbody>
							{data.pairs.map((v,k)=>
							<tr key={k}>
								<td>
									<img src={Icons[v]} alt="token" style={{width:"2em",marginRight:10}} /> 
									<span>{v}/ DM</span>
								</td>
								<td>
									<div>{connected && status.pools[v] ? '$ '+status.pools[v].reward : '-'}</div>
									<small>{connected ? '￥ ' + Number((Number(status.pools[v].reward) *prices.CNY).toFixed(2)) : '-'}</small>
								</td>
								<td>
									<div>{connected ? status.pools[v].daily + ' DM' : '-'}</div>
								</td>
								<td>
									<Link to = {`/mine/action/${v}`}>
										<span style={{color:"white",display:'block',backgroundColor:((status.pools[v] && status.pools[v].apr || 0)>=0?'green':'red'),padding:5,borderRadius:5,textAlign:'center'}}>{(status.pools[v] && status.pools[v].apr || 0)>0?'+':''}{(status.pools[v] && status.pools[v].apr || 0).toFixed(2)}</span>
									</Link>
								</td>
							</tr>)}
						</tbody>
					</table>
				</div>
				{/* <div className="mt-3" style={{backgroundColor:'#2e3548', borderRadius: 5, padding:20}}>
					<div style={{display:'flex',justifyContent:'space-between'}}>
						<div className="text-center">
							<h3>选区总量</h3>
							<div>1800万枚</div>
						</div>
						<div className="text-center">
							<h3>区块高度</h3>
							<div>36144</div>
						</div>
						<div className="text-center">
							<h3>已挖数量</h3>
							<div>1万枚</div>
						</div>
					</div>
					<div style={{display:'flex',justifyContent:'space-between', marginTop:20}}>
						<div className="text-center">
							<h3>出块时间</h3>
							<div>3秒</div>
						</div>
						<div className="text-center">
							<h3>活跃矿工</h3>
							<div>12</div>
						</div>
					</div>
				</div> */}
				<div className="mt-4 text-center">
					<h1><span style={{color:'#cc0404'}}>DM</span><span style={{color:'#14d1cb'}}>Staking</span></h1>
					<h2 className="mt-3">流动性总锁仓</h2>
					<div className="mt-3" style={{display:'flex',justifyContent:'center'}}>
						<div className="h2" style={{marginBottom:0,padding:10,color:'#cc0404',border:'1px solid #cc0404'}}>
							$1,100,400
						</div>
					</div>
				</div>
				<div className="mt-3">
					<h4>全网实时算力</h4>
					<p style={{textAlign:'right'}}>过去24小时</p>
					<div style={{ width: '100%', height: 300 }}>
						<ResponsiveContainer>
							<AreaChart data={data.chart} style={{width:'100%'}} margin={{top: 0,right: 10,left: -20,bottom: 0}}>
								<Area type="monotone" dataKey="y" stroke="#097853" fill="#20273a" />
								<CartesianGrid stroke="#ccc" vertical={false} />
								<XAxis dataKey="time"  />
								<YAxis />
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>
			</>
		)}
	</Layout>;
};

export default Mine;