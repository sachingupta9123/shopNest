const express = require("express");
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();




// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

app.use('/api', (req, res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl} authorization=${req.headers.authorization ? 'present' : 'missing'}`);
  next();
});

// Home Route
app.get("/", (req, res) => {
    res.send("ShopNest Backend is working properly!");
});

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

//product Routes
app.use('/api/products', require('./routes/productRoutes'));

//order Routes
app.use('/api/orders', require('./routes/orderRoutes'));

   //payment Routes

app.use('/api/payment' , require('./routes/paymentRoutes'));

  // analytics Routes
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON request body.',
    });
  }

  console.error('Unhandled server error:', error);
  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

