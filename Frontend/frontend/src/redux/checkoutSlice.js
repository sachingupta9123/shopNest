import { createSlice } from '@reduxjs/toolkit';

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    buyNowItem: null,
  },
  reducers: {
    startBuyNow: (state, action) => {
      state.buyNowItem = {
        ...action.payload,
        quantity: 1,
      };
    },
    increaseBuyNowQuantity: (state) => {
      if (
        state.buyNowItem &&
        state.buyNowItem.quantity < Number(state.buyNowItem.stock)
      ) {
        state.buyNowItem.quantity += 1;
      }
    },
    decreaseBuyNowQuantity: (state) => {
      if (state.buyNowItem && state.buyNowItem.quantity > 1) {
        state.buyNowItem.quantity -= 1;
      }
    },
    clearBuyNow: (state) => {
      state.buyNowItem = null;
    },
  },
});

export const {
  startBuyNow,
  increaseBuyNowQuantity,
  decreaseBuyNowQuantity,
  clearBuyNow,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
