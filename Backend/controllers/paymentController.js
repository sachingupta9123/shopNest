const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();


// ======================================
// CREATE PAYMENT ORDER
// ======================================

const createOrder = async (req, res) => {
  try {

    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }


    // ==================================
    // DEMO PAYMENT MODE
    // ==================================

    if (process.env.DEMO_PAYMENT === 'true') {

      const demoPaymentId =
        'DEMO_' +
        Date.now() +
        '_' +
        Math.floor(
          Math.random() * 10000
        );

      return res.status(200).json({
        success: true,
        demo: true,

        paymentId: demoPaymentId,

        amount: Number(amount),

        currency: 'INR',

        message:
          'Demo payment created successfully',
      });
    }


    // ==================================
    // REAL RAZORPAY
    // ==================================

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message:
          'Razorpay credentials are not configured.',
      });
    }


    const razorpay = new Razorpay({
      key_id:
        process.env.RAZORPAY_KEY_ID,

      key_secret:
        process.env.RAZORPAY_KEY_SECRET,
    });


    const options = {
      amount:
        Math.round(Number(amount) * 100),

      currency: 'INR',

      receipt:
        crypto
          .randomBytes(10)
          .toString('hex'),
    };


    const order =
      await razorpay.orders.create(
        options
      );


    res.status(200).json({
      success: true,
      demo: false,
      ...order,
    });

  } catch (error) {

    console.error(
      'Create payment error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};



// ======================================
// VERIFY PAYMENT
// ======================================

const verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;


    // ==================================
    // DEMO PAYMENT
    // ==================================

    if (
      process.env.DEMO_PAYMENT === 'true'
    ) {

      if (
        !razorpay_payment_id ||
        !razorpay_payment_id.startsWith(
          'DEMO_'
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid demo payment.',
        });
      }


      return res.status(200).json({
        success: true,

        message:
          'Demo payment verified successfully.',

        paymentId:
          razorpay_payment_id,
      });
    }


    // ==================================
    // REAL RAZORPAY VERIFICATION
    // ==================================

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Payment details are missing.',
      });
    }


    const generatedSignature =
      crypto
        .createHmac(
          'sha256',
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          razorpay_order_id +
            '|' +
            razorpay_payment_id
        )
        .digest('hex');


    if (
      generatedSignature ===
      razorpay_signature
    ) {

      return res.status(200).json({
        success: true,

        message:
          'Payment verified successfully.',

        paymentId:
          razorpay_payment_id,
      });

    }


    return res.status(400).json({
      success: false,
      message:
        'Payment verification failed.',
    });

  } catch (error) {

    console.error(
      'Payment verification error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


module.exports = {
  createOrder,
  verifyPayment,
};