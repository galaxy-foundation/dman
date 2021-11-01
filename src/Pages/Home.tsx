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

import imgSlide1 from '../assets/1ec5d237c779c855127d8bd44de61891.jpg'
import imgSlide2 from '../assets/5c221b05eec120714903cf51db125bb4.jpg'
import imgSlide3 from '../assets/66f3813a93a9bfbaaa1b791d634ccd03.jpg'
import imgSlide4 from '../assets/5581f65ad0a889c1394664dc4335081d.jpg'
import imgSlide5 from '../assets/8438a66a412ee1ec72e253586b1e1964.jpg'
import imgSlide6 from '../assets/60679e847858cb531aabab56f7401570.jpg'

import Layout from '../components/Layout';
import {DMTokenContract} from "../config";
import { Slide  } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const btn1s = [imgBtn11,imgBtn12,imgBtn13];
const btn3s = [
	[
		{src: imgBtn31, url: 'https://www.coingecko.com/en'},
		{src: imgBtn32, url: 'https://mathwallet.org/en-us/'},
		{src: imgBtn33, url: 'https://bitkeep.org/'}
	],
	[
		{src: imgBtn34, url: 'https://bitkeep.org/'},
		{src: imgBtn35, url: ''},
		{src: imgBtn36, url: 'https://trustwallet.com/'}
	],
	[
		{src: imgBtn37, url: 'www.binance.com'},
		{src: imgBtn38, url: ''},
		{src: imgBtn39, url: 'https://www.tokenpocket.pro/'}
	]
];
const btnSs = [
	{src: imgSocial1, url: 'https://twitter.com/DmanswapDao'},
	{src: imgSocial2, url: 'https://t.me/DmanDao'},
	{src: imgSocial3, url: 'https://github.com/galaxy-foundation/dman'},
	{src: imgSocial4, url: 'https://medium.com/@edward36012'},
	{src: imgSocial5, url: (process.env.REACT_APP_BLOCK_EXPLORER || '') + '/address/' + DMTokenContract.address},
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

const images = [
	{
		url: imgSlide1,
		caption: ''
	},
	{
		url: imgSlide2,
		caption: ''
	},
	{
		url: imgSlide3,
		caption: ''
	},
	{
		url: imgSlide4,
		caption: ''
	},
	{
		url: imgSlide5,
		caption: ''
	},
	{
		url: imgSlide6,
		caption: ''
	},
];
   

const Home = () => {
	/* const L = useSelector(state => state.contract.L); */
	return <Layout className="home">
		<div style={{margin:-15}}>
			<Slide>
			{images.map((slideImage, index)=> (
				<div className="each-slide" key={index}>
				<div style={{'backgroundImage': `url(${slideImage.url})`, height: 200, backgroundSize: 'contain'}}>
					<span>{slideImage.caption}</span>
				</div>
				</div>
			))} 
			</Slide>
		</div>
		
		<h3 className="vcenter" style={{marginTop:50}}>
			<img src={imgSect} alt="Section" style={{width:'0.5em',height:'auto', marginRight: 10}} />
			去中心化应用
		</h3>
		<div className="group">
			<a href="https://dman.app/" style={{color:'white'}} className="button p-2">
				<div className="icon" style={cssBtn1}></div>
				K线大师
				<div>
					<img src={imgArrow} alt="arrow" style={{width:'0.8em',height:'auto'}} />
				</div>
			</a>
			<a href="https://dman.app/" style={{color:'white'}} className="button p-2">
				<div className="icon" style={cssBtn2}></div>
				Defi 社交
				<div>
					<img src={imgArrow} alt="arrow" style={{width:'0.8em',height:'auto'}} />
				</div>
			</a>
			<a href="https://dman.app/" style={{color:'white'}} className="button p-2">
				<div className="icon" style={cssBtn3}></div>
				Defi 教育
				<div>
					<img src={imgArrow} alt="arrow" style={{width:'0.8em',height:'auto'}} />
				</div>
			</a>
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
					<a href={v.url} target="_blank" key={k} className="button" style={{backgroundColor:'#ccced0'}}>
						<img src={v.src} alt="arrow" style={{width:'100%',height:'auto'}}/>
					</a>
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
			{btnSs.map((v,k)=><a href={v.url} target="_blank" key={k} className="social">
				<img src={v.src} alt="arrow" style={{width:'100%',height:'auto'}}/>
			</a>)}
		</div>
	</Layout>;
};

export default Home;