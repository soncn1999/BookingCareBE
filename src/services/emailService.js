require('dotenv').config();
import moment from 'moment';
const nodemailer = require("nodemailer");


let sendSimpleEmail = async (data) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: data.language === 'vi' ? `"Trại nghiện Nàng tiên nâu 🐶" <${process.env.EMAIL_APP}>` : `"Brown Fairy Addiction Camp 🐶" <${process.env.EMAIL_APP}>`, // sender address
        to: data.receiverEmail, // list of receivers
        subject: data.language === 'vi' ? `Thông tin đặt lịch khám bệnh từ cainghienonline.com` : `Information to book a medical appointment from cainghienonline.com`, // receiverEmail line
        html: getBodyHTMLEmail(data),
    });
}

let getBodyHTMLEmail = (data) => {
    let result = '';
    let language = data.language;
    let bookingTime = language === 'vi' ? moment(+data.bookingTime).locale('vi').format('HH:mm - dddd - DD/MM/YYYY') : moment(+data.bookingTime).format('HH:mm - dddd - DD/MM/YYYY');

    if (language === 'vi') {
        result = `<h3>Xin chào ${data.patientName}! </h3>
        <p>Bạn nhận được email này vì đã đặt một lịch khám bệnh online trên cainghienonline.com vào lúc ${bookingTime}</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${data.time}</b></div>
        <div><b>Bác sĩ khám: ${data.doctorName}</b></div>
        <p>Để xác nhận thông tin đặt lịch khám bệnh của bạn, click vào <a href=${data.redirectLink} target="_blank">LINK</a> để hoàn tất đặt lịch</p>
        <h3>Cảm ơn, chúc bạn có trải nghiệm vui vẻ!</h3>
        `;
    } else if (language === 'en') {
        result = `<h3>Dear ${data.patientName}! </h3>
        <p>You received this email because you booked an online medical appointment on cainghienonline.com at ${bookingTime}</p>
        <p>Information to book a medical appointment: </p>
        <div><b>Time: ${data.time}</b></div>
        <div><b>Doctor: ${data.doctorName}</b></div>
        <p>To confirm your appointment booking information, click here <a href=${data.redirectLink} target="_blank">LINK</a> to complete the booking</p>
        <h3>Thank you, wish you have a good experience!</h3>
        `;
    }
    return result;
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail
}