const sendgrid = require('@sendgrid/mail')

sendgrid.setApiKey(process.env.EMAIL_KEY)

const sendWelcomeemail = ( email, name ) => {
    sendgrid.send({
        to: email,
        from: 'purujain0101@gmail.com',
        subject: 'Welcome',
        text: `I am happy that you came,${name}`
    })
}

const sendGoodgyeemail = ( email, name ) => {
    sendgrid.send({
        to: email,
        from: 'purujain0101@gmail.com',
        subject: 'Welcome',
        text: `Why are you leaving,${name}`
    })
}

module.exports = {
    sendWelcomeemail,
    sendGoodgyeemail
}