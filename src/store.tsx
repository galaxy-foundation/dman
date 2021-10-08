import {configureStore} from '@reduxjs/toolkit';
import dataSlice from './reducer'

export default configureStore({
    reducer: {
        data: dataSlice.reducer,
    }
})