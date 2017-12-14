'use strict'

module.exports = {
  mailer: {
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_PROVIDER,
      pass: process.env.NODEMAILER_PASSWORD
    }
  },
  dbConnstring: 'mongodb://admin:chicken@ds137336.mlab.com:37336/codetutor',
  sessionKey: 'codetutorsessionkey'
}
