import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = '';
    result = `${process.env.URL_REACTJS}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}

let handlePostBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.email && data.doctorId && data.timeType && data.date && data.fullname) {

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                    }
                });
                let isCheckDuplicateBookingShiftResult = await isCheckDuplicateBookingShift(data, user[0].id);
                let isCurrentExaminationShiftResult = await isCurrentExaminationShift(data);

                if (user && user[0] && isCurrentExaminationShiftResult && isCheckDuplicateBookingShiftResult) {
                    let token = uuidv4();

                    await db.Booking.create({
                        statusId: 'S1',
                        patientId: user[0].id,
                        doctorId: data.doctorId,
                        date: data.date,
                        timeType: data.timeType,
                        token: token,
                    });

                    await emailService.sendSimpleEmail({
                        receiverEmail: data.email,
                        patientName: data.fullname,
                        time: data.timeTypeData,
                        doctorName: data.doctorFullname,
                        redirectLink: buildUrlEmail(data.doctorId, token),
                        language: data.language,
                        bookingTime: data.bookingTime,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        message: 'This appointment is existing. Please book an new appointment'
                    })
                }

                resolve({
                    errCode: 0,
                    message: 'OK',
                });
            } else {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                })
            }
        } catch (errors) {
            reject(errors);
        }
    });
}

let handlePostVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.token && data.doctorId) {
                let appointment = await db.Booking.findOne({
                    where: {
                        token: data.token,
                        doctorId: data.doctorId,
                        statusId: 'S1',
                    },
                });

                if (appointment) {
                    await db.Booking.update({
                        statusId: 'S2',
                    }, {
                        where: {
                            token: data.token,
                        }
                    });
                    resolve({
                        errCode: 0,
                        message: 'OK',
                    });

                    await setCurrentExaminationShift(data);
                } else {
                    resolve({
                        errCode: 2,
                        message: 'Appointment does not active or exist'
                    });
                }
            } else {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter token or doctorId',
                })
            }
        } catch (errors) {
            reject(errors);
        }
    });
}

let isCheckDuplicateBookingShift = async (data, patientId) => {
    let result = true;
    let response = await db.Booking.findOne({
        where: {
            patientId: patientId,
            date: data.date,
            timeType: data.timeType,
        }
    });
    if (response) {
        result = false;
    }
    return result;
}

let setCurrentExaminationShift = async (data) => {
    let searchingBookingParam = await db.Booking.findOne({
        where: {
            token: data.token,
            doctorId: data.doctorId,
        }
    });
    if (searchingBookingParam) {
        let currentExamination = await db.Schedule.findOne({
            where: {
                date: searchingBookingParam.date,
                timeType: searchingBookingParam.timeType,
                doctorId: searchingBookingParam.doctorId,
            }
        })
        if (currentExamination) {
            await db.Schedule.update({
                currentNumber: +currentExamination.currentNumber + 1,
            }, {
                where: {
                    id: currentExamination.id,
                }
            });
        }
    }
}

let isCurrentExaminationShift = async (data) => {
    let result = false;
    let response = await db.Schedule.findOne({
        where: {
            date: data.date,
            timeType: data.timeType,
            doctorId: data.doctorId,
        }
    });
    if (response && response.currentNumber < response.maxNumber) {
        result = true;
    }
    return result;
}

module.exports = {
    handlePostBookAppointment: handlePostBookAppointment,
    handlePostVerifyBookAppointment: handlePostVerifyBookAppointment,
}