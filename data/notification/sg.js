const cron = require('node-cron');
const mailer = require('nodemailer');
var transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: '',
        pass: ''
    }
});
const mailOptions = {
        from: '',
        to: '',
        subject: `Appointment successful`,
        html:`Your appointment is succeed`
      };
      transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            console.log(error)
        }
    });