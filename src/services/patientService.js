import db from '../models/index';
require('dotenv').config();

let handlePostBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.email && data.doctorId && data.timeType && data.date) {
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                    }
                });

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                        },
                        defaults: {
                            statusId: 'S1',
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType,
                        }
                    });
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

module.exports = {
    handlePostBookAppointment: handlePostBookAppointment,
}