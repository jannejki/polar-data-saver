import nodemailer from 'nodemailer';

let transporter = undefined;

const initEmailer = () => {
    transporter = nodemailer.createTransport({
        service: process.env.EMAILER_SERVICE,
        auth: {
            user: process.env.EMAILER_HOST,
            pass: process.env.EMAILER_PWD,
        },
    });

    return transporter;
};

const sendEmail = async (letter) => {
    return new Promise(async (resolve, reject) => {

        const mailOptions = {
            from: process.env.EMAILER_HOST,
            to: process.env.EMAIL_TO,
            subject: letter.subject || 'Polar Data saver',
            text: letter.mail,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject(false);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
};

export default initEmailer;

export { sendEmail };