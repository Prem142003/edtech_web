const cloudinary = require("cloudinary").v2; //! Cloudinary is being required

exports.cloudinaryConnect = () => {
	try {
		if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
			console.warn(
				"Cloudinary env vars missing: ensure CLOUD_NAME, API_KEY and API_SECRET are set in your .env"
			)
		}
		cloudinary.config({
			//!    ########   Configuring the Cloudinary to Upload MEDIA ########
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
		});
	} catch (error) {
		console.log(error);
	}
};
