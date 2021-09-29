import { createSlice } from '@reduxjs/toolkit';

const locales = {
    "en-US": require('./locales/en-US.json'),
    "zh-CN": require('./locales/zh-CN.json'),
	/* ,
	
	"japanese": require('./locales/japanese.json'),
	"korean": require('./locales/korean.json'),
    "ru-RU": require('./locales/ru-RU.json'), */
};
const lang = window.localStorage.getItem('lang') || 'zh-CN';

export default createSlice({
    name: 'data',
    initialState: {
        lang,
        L: locales[lang],
        page: 'home',
        address: null,
        
    }, 
    reducers: {
        login: (state, action) => {
            console.log(action);
            state.address = action.payload;
        },
        logout: state => {
            state.address = null;
        },
        rejected: state => {
            state.address = null;
        },
        update: (state,action) => {
            for(let k in action.payload) {
                if (state[k]!==undefined) {
                    state[k] = action.payload[k];
                } else {
                    new Error('🦊 undefined account item')
                }
            }
        },
        lang: (state, action) => {
            state.lang = action.payload;
            state.L = locales[action.payload];
            window.localStorage.setItem('lang',action.payload)
        },
    }
});