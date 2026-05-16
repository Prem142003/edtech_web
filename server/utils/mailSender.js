const nodemailer = require("nodemailer")

const createTransportOptions = () => {
  const mailOptions = {
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  }

  if (process.env.MAIL_SERVICE) {
    mailOptions.service = process.env.MAIL_SERVICE
  } else {
    mailOptions.host = process.env.MAIL_HOST
    mailOptions.port = Number(process.env.MAIL_PORT) || 587
    mailOptions.secure = process.env.MAIL_SECURE === "true"
    if (mailOptions.port === 587) {
      mailOptions.requireTLS = true
      mailOptions.tls = { rejectUnauthorized: false }
    }
  }

  return mailOptions
}

const createTransporter = (options) => {
  return nodemailer.createTransport({
    ...options,
    pool: {
      maxConnections: 1,
      maxMessages: 100,
    },
  })
}

const sendWithTransporter = async (transporter, email, title, body) => {
  await transporter.verify()
  return transporter.sendMail({
    from: `"Studynotion | " <${process.env.MAIL_USER}>`,
    to: `${email}`,
    subject: `${title}`,
    html: `${body}`,
  })
}

const mailSender = async (email, title, body) => {
  const transportOptions = createTransportOptions()
  const transporter = createTransporter(transportOptions)

  try {
    const info = await sendWithTransporter(transporter, email, title, body)
    console.log("Email sent successfully:", info.response)
    return info
  } catch (error) {
    console.log("Error sending email:", error.message)

    if (
      transportOptions.port === 587 &&
      process.env.MAIL_HOST &&
      process.env.MAIL_HOST.includes("gmail")
    ) {
      console.log("Retrying with Gmail secure port 465...")
      const alternateOptions = {
        ...transportOptions,
        port: 465,
        secure: true,
        requireTLS: true,
      }
      const alternateTransporter = createTransporter(alternateOptions)
      try {
        const info = await sendWithTransporter(alternateTransporter, email, title, body)
        console.log("Email sent successfully on retry:", info.response)
        return info
      } catch (retryError) {
        console.log("Retry also failed:", retryError.message)
        throw retryError
      }
    }

    throw error
  }
}

module.exports = mailSender
