const express = require('express');

const router = express.Router();

const {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const {
  protect,
} = require('../middleware/authMiddleware');

const {
  admin,
} = require('../middleware/adminMiddleware');


// Create Order

router.post(
  '/',
  protect,
  createOrder
);


// Logged-in User Orders

router.get(
  '/my-orders',
  protect,
  myOrders
);


// Admin - Get All Orders

router.get(
  '/',
  protect,
  admin,
  getOrders
);


// Admin - Update Order Status

router.put(
  '/:id',
  protect,
  admin,
  updateOrderStatus
);


module.exports = router;