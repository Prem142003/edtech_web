const Razorpay = require("razorpay");

exports.instance = new Razorpay({
	key_id: process.env.RAZORPAY_KEY,
	key_secret: process.env.RAZORPAY_SECRET,
});


// key_id → identifies who you are

// key_secret → proves you are authorized