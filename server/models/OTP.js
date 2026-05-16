const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email from Studynotion",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
		return mailResponse;
	} catch (error) {
		console.log("Error occurred while sending email: ", error.message);
		console.log("Note: OTP has been saved but email notification may have failed");
		// Don't throw - allow OTP to be saved even if email fails
		return null;
	}
}

// Define a pre-save hook that runs before saving the document
OTPSchema.pre("save", async function (next) {
	console.log("New document is about to be saved ");

	// Only send a verification email when a new OTP document is created
	if (this.isNew) {
		try {
			await sendVerificationEmail(this.email, this.otp);
		} catch (error) {
			// Log but don't block OTP creation
			console.log("Warning: Email send failed but OTP was created");
		}
	}
	next();
});
// Mongoose wants to save OTP

// Runs pre-save hook

// Waits while email is sent

// Email finishes

// next() is called

// Mongoose saves OTP to DB
const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;


