const cloudinary = require("cloudinary").v2
const dns = require("dns").promises

exports.checkCloudinary = async (req, res) => {
  try {
    // DNS check
    await dns.lookup("api.cloudinary.com")
  } catch (dnsErr) {
    console.error("Cloudinary DNS lookup failed:", dnsErr)
    return res.status(503).json({
      success: false,
      message: "DNS lookup failed for api.cloudinary.com",
      error: dnsErr.message,
    })
  }

  try {
    // Try a lightweight API call to validate credentials and connectivity
    const resources = await cloudinary.api.resources({ max_results: 1 })
    return res.status(200).json({
      success: true,
      message: "Cloudinary is reachable and API call succeeded",
      resourcesSummary: {
        total_count: resources.total_count,
        resources_fetched: resources.resources.length,
      },
    })
  } catch (err) {
    console.error("Cloudinary API call failed:", err)
    return res.status(502).json({
      success: false,
      message:
        "Cloudinary API request failed. Check credentials and network access to api.cloudinary.com",
      error: err.message,
    })
  }
}