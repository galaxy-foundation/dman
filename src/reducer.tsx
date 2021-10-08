import { createSlice } from '@reduxjs/toolkit';

const locales = {
    "en-US": require('./locales/en-US.json'),
    "zh-CN": require('./locales/zh-CN.json'),
	/*
	"japanese": require('./locales/japanese.json'),
	"korean": require('./locales/korean.json'),
    "ru-RU": require('./locales/ru-RU.json'), */
};

const lang = window.localStorage.getItem('lang') || 'zh-CN';

export interface ContractStatus {
    
    lang: string
    L: {[lang:string]:any}
    page: string

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

const initialState: ContractStatus = {
	lang,
    L: locales[lang],
    page:'home',

	inited: false,
	available: false,
	
	isEnd: false,

	limit1: 0,
	limit2: 0,
	remainder: 0,
	reward: 0,
	dmBalance: 0,
	usdtBalance: 0,
	unlockable: 0,
	rewardPool: 0,
	rewardedTotal: 0,
	insurancePool: 0,
	insuranceBurnt: 0,
}

export default createSlice({
	name: 'share',
	initialState,
	reducers: {
		update: (state:any, action) => {
			for (const k in action.payload) {
				if (state[k] === undefined) new Error('🦊 undefined account item')
				state[k] = action.payload[k]
			}
		}
	}
})
