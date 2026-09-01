const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

       // Hash Password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Generate 6 digit OTP
const otp = Math.floor(100000 + Math.random() * 900000).toString();

// Create User
const user = await User.create({
    name,
    email,
    password: hashedPassword,
    otp: otp,
    otpExpire: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    isVerified: false,
});

        const message = `
Hello ${name},

Welcome to ShopNest!

We're excited to have you as part of our community.

Your OTP for registration is: ${otp}

Thank you,
Team ShopNest
`;

        await sendEmail(
            email,
            "Welcome to ShopNest - OTP Verification",
            message
        );

       res.status(201).json({
    success: true,
    message: "OTP sent successfully. Please verify your email.",
});

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

//otp verify

// Verify OTP
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        // Check OTP
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Check OTP Expiry
        if (user.otpExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        // Verify User
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};



// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });

        // Check user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Login successful
        return res.status(200).json({
            success: true,
            message: "Login successful",

            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,

            token: generateToken(user._id),
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};



// Resend OTP
const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        // Generate New OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        const message = `
Hello ${user.name},

Your new ShopNest OTP is:

${otp}

This OTP will expire in 10 minutes.

Thank You,
ShopNest Team
`;

        await sendEmail(
            user.email,
            "ShopNest - Resend OTP",
            message
        );

        res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        const message = `
Hello ${user.name},

Your password reset OTP is:

${otp}

This OTP will expire in 10 minutes.

Team ShopNest
`;

        await sendEmail(
            user.email,
            "ShopNest Password Reset OTP",
            message
        );

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully.",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};


// Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check OTP
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Check Expiry
        if (user.otpExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired",
            });
        }

        // Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        // Clear OTP
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }
};



// Get All Users
const getUsers = async (req, res) => {
  try {

    const users = await User.find({})
      .select('-password -otp -otpExpire')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {

    console.error('Get users error:', error);

    return res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};





module.exports = {
    registerUser,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    loginUser,
    getUsers,
};
