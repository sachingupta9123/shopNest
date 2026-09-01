const Order = require('../model/Order');
const User = require('../model/User');
const Product = require('../model/Products');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    const orders = await Order.find({});

    const totalRevenueData = orders.reduce(
      (acc, order) => acc + (order.totalAmount || 0),
      0
    );

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenueData,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching admin stats',
      error: error.message,
    });
  }
};

module.exports = { getAdminStats };