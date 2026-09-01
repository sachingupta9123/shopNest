import { createSlice } from '@reduxjs/toolkit';

const getCartItems = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedCart = localStorage.getItem('cartItems');

    if (!storedCart) {
      return [];
    }

    const items = JSON.parse(storedCart);

    // Make sure every old cart item has quantity
    return items.map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 1,
    }));
  } catch (error) {
    console.error('Failed to load cart:', error);
    return [];
  }
};

const initialState = {
  cartItems: getCartItems(),
};

const saveCart = (cartItems) => {
  localStorage.setItem(
    'cartItems',
    JSON.stringify(cartItems)
  );
};

const cartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {

    // Add product to cart
    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cartItems.find(
        (product) => product._id === item._id
      );

      if (existingItem) {
        // Increase quantity
        existingItem.quantity += 1;
      } else {
        // First time adding product
        state.cartItems.push({
          ...item,
          quantity: 1,
        });
      }

      saveCart(state.cartItems);
    },

    // Increase quantity
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (product) => product._id === action.payload
      );

      if (item) {
        if (item.quantity < item.stock) {
          item.quantity += 1;
        }
      }

      saveCart(state.cartItems);
    },

    // Decrease quantity
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (product) => product._id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      saveCart(state.cartItems);
    },

    // Remove product
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (product) => product._id !== action.payload
      );

      saveCart(state.cartItems);
    },

    // Clear cart
    clearCart: (state) => {
      state.cartItems = [];

      localStorage.removeItem('cartItems');
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;