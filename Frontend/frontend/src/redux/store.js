import {configureStore} from '@reduxjs/toolkit';
import cartReducer from '../redux/cartSlice';
import checkoutReducer from '../redux/checkoutSlice';

const store = configureStore({
    reducer:{
        cart: cartReducer,
        checkout: checkoutReducer,
    },
});

export default store;
