const Order = require('../model/Order');
const Product = require('../model/Products');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail');


// ======================================
// CREATE ORDER
// ======================================

const createOrder = async (req, res) => {
  try {

    const { items, address } = req.body;


    // ==============================
    // LOGIN CHECK
    // ==============================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          'Please login before placing an order.',
      });
    }


    // ==============================
    // VALIDATION
    // ==============================

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      !address ||
      !['fullName', 'street', 'city', 'state', 'postalCode', 'country']
        .every((field) => typeof address[field] === 'string' && address[field].trim())
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid order data.',
      });
    }


    console.log('[Order] Create request', {
      userId: req.user._id.toString(),
      itemCount: items.length,
      demoPayment: process.env.DEMO_PAYMENT === 'true',
    });

    if (process.env.DEMO_PAYMENT !== 'true') {
      return res.status(503).json({
        success: false,
        message: 'Payment verification is required before placing an order.',
      });
    }

    const quantitiesByProduct = new Map();
    for (const item of items) {
      const quantity = Number(item.qty);
      if (!item.product || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Each order item must include a product and a positive whole-number quantity.',
        });
      }

      const productId = String(item.product);
      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({
          success: false,
          message: 'One or more product IDs are invalid.',
        });
      }
      quantitiesByProduct.set(productId, (quantitiesByProduct.get(productId) || 0) + quantity);
    }

    const products = await Product.find({
      _id: { $in: [...quantitiesByProduct.keys()] },
    }).select('_id name price stock');

    if (products.length !== quantitiesByProduct.size) {
      return res.status(400).json({
        success: false,
        message: 'One or more products are no longer available.',
      });
    }

    const productsById = new Map(products.map((product) => [String(product._id), product]));
    const validatedItems = [];
    let totalAmount = 0;

    for (const [productId, qty] of quantitiesByProduct) {
      const product = productsById.get(productId);
      if (qty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `${product.name} does not have enough stock.`,
        });
      }

      const price = Number(product.price);
      validatedItems.push({ product: product._id, qty, price });
      totalAmount += price * qty;
    }

    totalAmount = Number(totalAmount.toFixed(2));
    const paymentId = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;


    // ==============================
    // CREATE ORDER
    // ==============================

    const order = await Order.create({
      user: req.user._id,

      items: validatedItems,

      totalAmount,

      address: {
        fullName: address.fullName.trim(),
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        postalCode: address.postalCode.trim(),
        country: address.country.trim(),
      },

      paymentId,
    });


    // ==============================
    // EMAIL
    // ==============================

    const message = `
Dear ${req.user.name},

Thank you for your order!

Your Order ID: ${order._id}

Total Amount: ₹${totalAmount}

Payment ID: ${paymentId}

Shipping Address:
${address.fullName}
${address.street}
${address.city}
${address.postalCode}
${address.country}

We will notify you once your order is shipped.

Team ShopNest
`;


    try {

      await sendEmail(
        req.user.email,

        'Order Created Successfully',

        message
      );

    } catch (emailError) {

      console.error(
        'Email sending failed:',
        emailError
      );

      // Order should still remain successful
    }


    res.status(201).json({
      success: true,

      message:
        'Order placed successfully.',

      order,
    });

  } catch (error) {

    console.error(
      'Create order error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Error creating order.',
    });
  }
};



// ======================================
// MY ORDERS
// ======================================

const myOrders = async (req, res) => {
  try {

    const orders =
      await Order.find({
        user: req.user._id,
      })
        .populate(
          'items.product',
          'name price imageUrl'
        )
        .sort({
          createdAt: -1,
        });


    res.json({
      success: true,
      orders,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Error fetching orders.',
    });
  }
};



// ======================================
// ALL ORDERS - ADMIN
// ======================================

const getOrders = async (req, res) => {
  try {

    const orders =
      await Order.find({})
        .populate(
          'user',
          'name email'
        )
        .populate(
          'items.product',
          'name price imageUrl'
        )
        .sort({
          createdAt: -1,
        });


    res.json(orders);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        'Error fetching orders',
    });
  }
};



// ======================================
// UPDATE ORDER STATUS
// ======================================

const updateOrderStatus = async (req, res) => {
  try {

    let { status } = req.body;

    console.log('Order ID:', req.params.id);
    console.log('Status received:', status);

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }


    // Convert to lowercase

    status = status.toLowerCase();


    const allowedStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];


    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status: ${status}`,
      });
    }


    const order = await Order.findById(
      req.params.id
    );


    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }


    order.status = status;

    await order.save();


    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });

  } catch (error) {

    console.error('Update order status error:', error);

    return res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};


module.exports = {
  createOrder,
  myOrders,
  getOrders,
  updateOrderStatus,
};
