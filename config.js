'use strict'

module.exports = {
  mailer: {
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_PROVIDER,
      pass: process.env.NODEMAILER_PASSWORD
    }
  },
  dbConnstring: 'mongodb://127.0.0.1:27017/codetutor',
  sessionKey: 'codetutorsessionkey'
}
