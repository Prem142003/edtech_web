const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT || 587,
      secure: process.env.MAIL_SECURE === 'true' ? true : false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
      pool: {
        maxConnections: 1,
        maxMessages: 100,
      },
    })

    let info = await transporter.sendMail({
      from: `"Studynotion | " <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log("Email sent successfully:", info.response)
    return info
  } catch (error) {
    console.log("Error sending email:", error.message)
    throw error
  }
}

module.exports = mailSender
