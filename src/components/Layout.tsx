import React from 'react';
import {Link} from "react-router-dom";
import { useSelector, useDispatch} from 'react-redux';
import dataSlice from '../reducer';

import Icons from './Icons'
import imgLang from '../assets/sym-lang.png';
import imgMetamask from '../assets/metamask.svg';
import imgBsc from '../assets/bnb.svg';
import imgElips from '../assets/sym-elips.png';

import imgHome from '../assets/footer-home.webp';
import imgSwap from '../assets/footer-swap.webp';
import imgMine from '../assets/footer-mine.webp';
import imgApp from '../assets/footer-app.webp';

import { DataState } from '../@types/store';

import imgBgHeader from '../assets/bg-header.webp';
import imgEarch from '../assets/earth.webp';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/* import { toast } from 'react-toastify'; */
import {useWallet} from 'use-wallet';
import {ethers} from "ethers";

const Section =  (props:any) => {
	return <section className={props.className} style={{backgroundImage: `url(${imgBgHeader})`}}>{props.children}</section>;
};

const Layout = (props:any) => {
    
	const wallet = useWallet();
    const L = useSelector((state:DataState) => state.data.L);
    const [status, setStatus] = React.useState({
        address:'',
        connecting: false
    });     
    var styledAddress =wallet.account? wallet.account.slice(0,4)+".."+wallet.account.slice(-4):"";
    
	const dispatch = useDispatch();
    React.useEffect(() => {
        const { connector } = window
        if (connector && connector.connected && connector.address) {
            setStatus({ connecting: false, address: connector.address })
        }
    }, [])

    function changeLang(lang:string){
        dispatch(dataSlice.actions.update({lang}));
    }

    //check connection
    const handleChainChanged = (chainId)=>{
        let {ethereum} = window;
        if(ethereum.isConnected()&&Number(chainId) === 4002){
            onConnect("metamask");
        }
    }

    const checkConnection =async ()=>{
        let {ethereum} = window;
        if(ethereum!==undefined){
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            if(accounts.length!==0&&Number(chainId) === 4002){
                onConnect("metamask");
            }
            ethereum.on('chainChanged', handleChainChanged);
        }
    }

    React.useEffect(()=>{
        checkConnection();
    },[])
    
    //connection
    const onConnect = (walletname: string) => {
        if(wallet.status!=="connected"){
            wallet.connect().catch((err) => {
                alert("please check metamask!")
            });
        }
    }

    return (<>
        <header>
            <Link className="title vcenter" to="/">
                <img src={imgElips} alt="Ellipsis" style={{width:"1em",height:"auto"}} />
                <img src={Icons.DM} alt="logo" style={{width:"1.2em",height:"1.2em"}} />
                DmanSwap
            </Link>
            <div style={{display:'flex'}}>
                <div className="dropdown custom_dropdown" style={{marginRight:10}}>
                    <button data-mdb-toggle="dropdown" className="btn bg-kubj text-white vcenter" style={{minWidth:60}}>
                        <img src={imgLang} alt="lang" style={{width:"1.2em",height:"1.2em",marginRight:10}} /> {L.lang}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end custom_dropdown_menu bg_blue_9" aria-labelledby="dropdownLangButton">
                        <li onClick={()=>changeLang('zh-CN')}>
                            中国语（简体）
                        </li>
                        <li onClick={()=>changeLang('en-US')}>
                            ENGLISH
                        </li>
                    </ul>
                </div>
                { wallet.status === "connected" ? (
                    <button className="btn bg-kubj text-warning vcenter" style={{textTransform:'none'}}>
                        <img src={imgBsc} alt="wallet" style={{width:"1.5em",height:"1.5em",marginRight:10}} />
                        {styledAddress}
                    </button>
                ) : (
                    <button onClick={()=>onConnect('metamask')} className="btn bg-kubj text-warning vcenter">
                        {wallet.status === "connecting"? (
                            <div className="spinner-border" role="status" style={{width:"1.5em",height:"1.5em",marginRight:10}}>
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                            <img src={imgMetamask} alt="wallet" style={{width:"1.5em",height:"1.5em",marginRight:10}} />
                        ) }
                        {L['wallet.connect']}    
                    </button>
                ) }
                
            </div>
        </header>
        <Section className={props.className}>
            <div style={{position:'absolute',right:-150, top:180, zIndex:-1}}>
                <img alt="bg" src={imgEarch} style={{width:250,height:'auto'}} />
            </div>
            <div style={{position:'absolute',left:-150, top:620, zIndex:-1}}>
                <img alt="bg" src={imgEarch} style={{width:250,height:'auto'}} />
            </div>
            {props.children}
            <ToastContainer />
        </Section>
        <footer>
            <div>
                <Link to="/">
                    <img src={imgHome} alt="home" style={{width:"2em",height:"auto"}} /> 
                    <div>首页</div>
                </Link>
            </div>
            <div>
                <Link to="/presale">
                    <img src={imgApp} alt="app" style={{width:"2em",height:"auto"}} /> 
                    <div>预售</div>
                </Link>
            </div>
            <div>
                <Link to="/swap">
                    <img src={imgSwap} alt="swap" style={{width:"2em",height:"auto"}} /> 
                    <div>兑换</div>
                </Link>
            </div>
            <div>
                <Link to="/mine">
                    <img src={imgMine} alt="mine" style={{width:"2em",height:"auto"}} /> 
                    <div>矿池</div>
                </Link>
            </div>
        </footer>
    </>);
}

export default Layout;