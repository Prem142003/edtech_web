const express = require("express")
const router = express.Router()
const { checkCloudinary } = require("../controllers/Health")

router.get("/cloudinary", checkCloudinary)

module.exports = router
