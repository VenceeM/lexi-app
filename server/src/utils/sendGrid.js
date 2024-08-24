import sgMail from '@sendgrid/mail'
import { config } from 'dotenv'
config()


export const sendEmail = async (to, subject, message) => {


    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        to: to,
        from: process.env.SENGRID_FROM,
        subject: subject,
        text: message,
        html: `<strong>Your Code: ${message}</strong>`,
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((err) => {
            console.error(err);

        })


}