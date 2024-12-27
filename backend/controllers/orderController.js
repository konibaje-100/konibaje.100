import paystackAPI from 'paystack-api';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import CoinPayments from 'coinpayments';
import nodemailer from 'nodemailer';

// global variables
const currency = 'NGN';


const calculateDeliveryCharge = (state) => {
    if (state.toLowerCase() === "lagos") {
        return 4000; // Delivery charge for Lagos state
    }
    return 10000; // Default delivery charge for other states
};

// gateway initialize
const paystack = paystackAPI(process.env.PAYSTACK_SECRET_KEY);
const coinPaymentsClient = new CoinPayments({
    key: process.env.COINPAYMENTS_PUBLIC_KEY,
    secret: process.env.COINPAYMENTS_PRIVATE_KEY,
});

// placing order using cod method
const placeOrder = async (req,res) => {
    
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData); 
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{cartData:{}});

        res.json({success:true, message:"Order Placed"});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }

};

const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        // Create order in the database
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Paystack",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Calculate delivery charge based on state
        const deliveryChargeAmount = calculateDeliveryCharge(address.state);

        // Calculate total amount (sum of item prices and delivery charge)
        const totalAmount =
            items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
            deliveryChargeAmount;

        // Initialize Paystack payment
        const response = await paystack.transaction.initialize({
            email: address.email, // Paystack requires the user's email
            amount: totalAmount * 100, // Convert to kobo
            currency: currency,
            metadata: {
                cancel_action: `${origin}/verify?success=false&orderId=${newOrder._id}`,
                callback_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            },
        });

        // Send Email to Admin
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: 'support@konibaje100.com', // Replace with your Zoho email
                pass: 'bkCf9Phfe1kP',     // Replace with your Zoho email password or app-specific password
            },
        });

        const mailOptions = {
            from: 'support@konibaje100.com', // Sender's email
            to: 'konibaje100@gmail.com',   // Admin's email
            subject: 'New Order Received',
            text: `You have received a new order with Order ID: ${newOrder._id}. Please check the admin panel for details.`,
        };

        await transporter.sendMail(mailOptions);

        // Return session URL to frontend
        res.json({ success: true, session_url: response.data.authorization_url });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Paystack Payment
const verifyStripe = async (req, res) => {
    const { orderId, success, userId, reference } = req.body;

    try {
        // Proceed with verification if payment success is "true"
        if (success === "true") {
            // Verify the transaction on Paystack with the reference
            const response = await paystack.transaction.verify({ reference });

            // Check if Paystack response indicates success
            if (response.data.status === "success") {
                // Update order and user data if payment is successful
                await orderModel.findByIdAndUpdate(orderId, { payment: true });
                await userModel.findByIdAndUpdate(userId, { cartData: {} });
                res.json({ success: true });
            } else {
                // If Paystack verification failed
                res.json({ success: false, message: "Payment verification failed" });
            }
        } else {
            // If success is not "true", delete the order
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// placing order using razorpay method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    // Create order in the database
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay", // Should be "Razorpay" for the case
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Calculate the total amount in USD (or another currency CoinPayments accepts)
    const totalAmount = amount; // Adjust currency conversion if necessary

    // Create a CoinPayments transaction
    const transaction = await coinPaymentsClient.createTransaction({
      currency1: 'NGN', // Currency from your platform
      currency2: 'LTC', // Currency to receive
      amount: totalAmount,
      buyer_email: address.email,
      item_name: `Order ${newOrder._id}`,
      custom: newOrder._id.toString(),
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, payment_url: transaction.checkout_url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazor = async (req, res) => {
    const { orderId, success, userId, txn_id } = req.body;
  
    try {
      if (success === "true") {
        // Verify the transaction
        const response = await coinPaymentsClient.getTx({ txid: txn_id });
        await newOrder.save();
        if (response.status === 100) {
          // Update order and user data if payment is successful
          await orderModel.findByIdAndUpdate(orderId, { payment: true });
          await userModel.findByIdAndUpdate(userId, { cartData: {} });
          res.json({ success: true });
        } else {
          res.json({ success: false, message: "Payment verification failed" });
        }
      } else {
        // If success is not "true", delete the order
        await orderModel.findByIdAndDelete(orderId);
        res.json({ success: false });
      }
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  };

// All orders data for admin panel
const allOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,orders});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
};

// User order data for frontend
const userOrders = async (req,res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({success: true, orders});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
};

// Update orders status from admin panel
const updateStatus = async (req,res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, {status});
        res.json({success:true,message:'Status Updated'});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
};

export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazor };
