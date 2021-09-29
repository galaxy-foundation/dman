/* import React from 'react';
import { useSelector} from 'react-redux'; */

import imgSect from '../assets/sym-section.svg';
import imgArrow from '../assets/sym-arrow.png';

import imgBtn1 from '../assets/ic-home-bt-01.webp';
import imgBtn2 from '../assets/ic-home-bt-02.webp';
import imgBtn3 from '../assets/ic-home-bt-03.webp';

import imgBtn11 from '../assets/ic-home-bt-11.webp';
import imgBtn12 from '../assets/ic-home-bt-12.webp';
import imgBtn13 from '../assets/ic-home-bt-13.webp';

import imgBtn31 from '../assets/ic-home-bt-31.webp';
import imgBtn32 from '../assets/ic-home-bt-32.webp';
import imgBtn33 from '../assets/ic-home-bt-33.webp';
import imgBtn34 from '../assets/ic-home-bt-34.webp';
import imgBtn35 from '../assets/ic-home-bt-35.webp';
import imgBtn36 from '../assets/ic-home-bt-36.webp';
import imgBtn37 from '../assets/ic-home-bt-37.webp';
import imgBtn38 from '../assets/ic-home-bt-38.webp';
import imgBtn39 from '../assets/ic-home-bt-39.webp';

import imgSocial1 from '../assets/ic-social-01.webp';
import imgSocial2 from '../assets/ic-social-02.webp';
import imgSocial3 from '../assets/ic-social-03.webp';
import imgSocial4 from '../assets/ic-social-04.webp';
import imgSocial5 from '../assets/ic-social-05.webp';

import imgBook from '../assets/ic-home-book.webp';
import imgBgCell from '../assets/bg-cell.webp';

import Layout from '../components/Layout';

const btn1s = [imgBtn11,imgBtn12,imgBtn13];
const btn3s = [
	[imgBtn31,imgBtn32,imgBtn33],
	[imgBtn34,imgBtn35,imgBtn36],
	[imgBtn37,imgBtn38,imgBtn39]
];
const btnSs = [
	imgSocial1,imgSocial2,imgSocial3,imgSocial4,imgSocial5
];

var cssBtn1 = {
	background: "url(" + imgBtn1 + ") no-repeat right bottom",
	backgroundSize: '60px 48px'
};
var cssBtn2 = {
	background: "url(" + imgBtn3 + ") no-repeat right bottom",
	backgroundSize: '60px 48px'
};
var cssBtn3 = {
	background: "url(" + imgBtn2 + ") no-repeat right bottom",
	backgroundSize: '60px 48px'
};

  

const Home = () => {
	/* const L = useSelector(state => state.contract.L); */
	return <Layout className="home">
		<div>
			<img src={imgBgCell} alt="bg" style={{width:'100%',height:'auto'}} />
		</div>
		<h3 className="vcenter" style={{marginTop:200}}>
			<img src={imgSect} alt="Section" style={{width:'0.5em',height:'auto', marginRight: 10}} />
			去中心化应用
		</h3>
		<div className="group">
			<div className="button p-2">
				<div className="icon" style={cssBtn1}></div>
				K线大师
				<div>
					<img src={imgArrow} alt="arrow" style={{width:'0.8em',height:'auto'}} />
				</div>
			</div>
			<div className="button p-2">
				<div className="icon" style={cssBtn2}></div>
				Defi 社交
				<div>
					<img src={imgArrow} alt="arrow" style={{width:'0.8em',height:'auto'}} />
				</div>
			</div>
			<div className="button p-2">
				<div className="icon" style={cssBtn3}></div>
				Defi 教育
				<div>
					<img src={imgArrow} alt="arrow" style={{width:'0.8em',height:'auto'}} />
				</div>
			</div>
		</div>

		<h3 className="vcenter mt-5">
			<img src={imgSect} alt="Section" style={{width:'0.5em',height:'auto', marginRight: 10}} />
			审计机构
		</h3>
		<div className="group">
			{btn1s.map((v,k)=><div key={k} className="button" style={{backgroundColor:'#757c8f'}}>
				<img src={v} alt="arrow" style={{width:'100%',height:'auto'}}/>
			</div>)}
		</div>
		<div style={{position:'relative'}}>
			
			<h3 className="vcenter mt-5">
				<img src={imgSect} alt="Section" style={{width:'0.5em',height:'auto', marginRight: 10}} />
				合作伙伴
			</h3>
			{btn3s.map((vs,ks)=><div key={ks} className="group mt-2">
				{vs.map((v,k)=>
					<div key={k} className="button" style={{backgroundColor:'#ccced0'}}>
						<img src={v} alt="arrow" style={{width:'100%',height:'auto'}}/>
					</div>
				)}
			</div>)}
		</div>
		
		<div className="mt-5" style={{position:'relative'}}>
			<div>
				<img src={imgBgCell} alt="bg" style={{width:'100%',height:'auto'}} />
			</div>
			<div style={{position:'absolute',right:0, bottom:0, opacity:0.5}}>
				<img src={imgBook} alt="book" style={{width:'100%',height:'auto'}} />
			</div>
			<div style={{position:'absolute',left:0, right:0, top:0, bottom:0, display:'flex', alignItems:'center', justifyContent: 'center'}}>
				<div style={{display:'flex', flexDirection:'column'}}>
					<h3>白皮书技术报告</h3>
					<button className="btn btn-primary mt-3 round">点击下载</button>
				</div>
			</div>
		</div>
		<div className="group mt-5 pl-3 px-3">
			{btnSs.map((v,k)=><button key={k} className="social">
				<img src={v} alt="arrow" style={{width:'100%',height:'auto'}}/>
			</button>)}
		</div>
	</Layout>;
};

export default Home;