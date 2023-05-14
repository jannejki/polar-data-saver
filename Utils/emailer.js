import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async(letter) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAILER_SERVICE,
            auth: {
                user: process.env.EMAILER_HOST,
                pass: process.env.EMAILER_PWD,
            },

        });

        const mailOptions = {
            from: process.env.EMAILER_HOST,
            to: process.env.EMAIL_TO,
            subject: letter.subject ||'Polar Data saver', 
            text: letter.mail,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log({error});
                reject(error);
            } else {
                console.log(`Email sent: ${info.response}`);
                resolve(info.response);
            }
        });

    });
};

export default sendEmail;