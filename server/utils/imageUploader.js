const cloudinary = require("cloudinary").v2

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  
  if (!file) {
    throw new Error("No file provided to uploadImageToCloudinary")
  }
  if (!file.tempFilePath) {
    const keys = Object.keys(file || {}).join(", ")
    throw new Error(
      `File is missing tempFilePath. Received file keys: ${keys}. Make sure express-fileupload is configured correctly and running on a supported OS.`
    )
  }

  const options = { folder }
  if (height) {
    options.height = height
  }
  if (quality) {
    options.quality = quality
  }
  options.resource_type = "auto"
  console.log("OPTIONS", options)

  // If DISABLE_CLOUDINARY is set, use local fallback for uploads
  const disableCloud = String(process.env.DISABLE_CLOUDINARY || "").toLowerCase() === "true"
  if (disableCloud) {
    // move file to project uploads dir and construct a pseudo-cloudinary response
    const fs = require("fs")
    const path = require("path")
    const unique = (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.randomUUID)
      ? globalThis.crypto.randomUUID()
      : Date.now()
    const ext = path.extname(file.name) || ""
    const filename = `${unique}${ext}`
    const destPath = path.join(__dirname, "..", "uploads", filename)
    fs.copyFileSync(file.tempFilePath, destPath)
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`
    const secure_url = `${baseUrl}/uploads/${filename}`
    const duration = file.mimetype && file.mimetype.startsWith("video") ? 0 : undefined
    return { secure_url, duration }
  }

  try {
    return await cloudinary.uploader.upload(file.tempFilePath, options)
  } catch (error) {
    // If network error (DNS) or Cloudinary unreachable, fall back to local storage
    if (error && (error.code === "ENOTFOUND" || error.message && error.message.includes("ENOTFOUND"))) {
      console.warn("Cloudinary unreachable; falling back to local storage. Error:", error.message)
      const fs = require("fs")
      const path = require("path")
      const unique = (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.randomUUID)
        ? globalThis.crypto.randomUUID()
        : Date.now()
      const ext = path.extname(file.name) || ""
      const filename = `${unique}${ext}`
      const destPath = path.join(__dirname, "..", "uploads", filename)
      fs.copyFileSync(file.tempFilePath, destPath)
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`
      const secure_url = `${baseUrl}/uploads/${filename}`
      const duration = file.mimetype && file.mimetype.startsWith("video") ? 0 : undefined
      return { secure_url, duration }
    }

    if (error && error.http_code === 401) {
      throw new Error(
        "Cloudinary authentication failed. Check CLOUD_NAME, API_KEY and API_SECRET environment variables. Original error: " +
          (error.message || "")
      )
    }
    // Re-throw otherwise so upstream handlers can log full details
    throw error
  }
}
