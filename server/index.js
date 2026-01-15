// Importing necessary modules and packages
const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const healthRoutes = require("./routes/Health");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const os = require("os");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Setting up port number
const PORT = process.env.PORT || 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();
 
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

// Use OS temp directory for file uploads (works cross-platform)
const tempDir = path.join(os.tmpdir(), "uploads");
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: tempDir,
	})
);

// Ensure a project-level uploads folder exists for local fallback and serve it statically
const projectUploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(projectUploadsDir)) {
	fs.mkdirSync(projectUploadsDir, { recursive: true })
}
app.use("/uploads", express.static(projectUploadsDir))

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
// Health checks
app.use("/api/v1/health", healthRoutes);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.
