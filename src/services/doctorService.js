import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: +limitInput,
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                where: {
                    roleId: 'R2'
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            });

            if (users) {
                resolve({
                    errCode: 0,
                    message: 'OK',
                    data: users
                })
            } else {
                resolve({
                    errCode: 1,
                    message: 'No data found, query failed',
                    data: [],
                });
            }
        } catch (errors) {
            reject(errors);
        }
    });
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                attributes: {
                    exclude: ['password', 'image']
                },
                where: {
                    roleId: 'R2'
                }
            });
            resolve({
                errCode: 0,
                message: 'OK',
                data: doctors
            })
        } catch (errors) {
            reject(errors);
        }
    });
}

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action
                || !inputData.priceId || !inputData.provinceId || !inputData.paymentId || !inputData.addressClinic
                || !inputData.nameClinic || !inputData.note) {
                resolve({
                    errCode: 1,
                    message: 'missing required parameter'
                });
            } else {
                if (inputData.action === 'CREATE') {
                    let doctorCreate = await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                    if (!doctorCreate) {
                        resolve({
                            errCode: 1,
                            message: 'Something went wrong',
                        });
                    }
                }
                if (inputData.action === 'EDIT') {
                    let doctorEdit = await db.Markdown.update({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        updatedAt: new Date(),
                    }, { where: { doctorId: inputData.doctorId } })

                    if (!doctorEdit) {
                        resolve({
                            errCode: 1,
                            message: 'Something went wrong',
                        })
                    }
                }

                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false,
                });

                if (doctorInfo) {
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.priceId;
                    doctorInfo.provinceId = inputData.provinceId;
                    doctorInfo.paymentId = inputData.paymentId;
                    doctorInfo.addressClinic = inputData.addressClinic;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.note = inputData.note;
                    let response = await doctorInfo.save();
                    if (!response) {
                        reject({
                            errCode: 1,
                            message: 'Something went wrong, Update Failed!',
                        })
                    }
                } else {
                    let response = await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.priceId,
                        provinceId: inputData.provinceId,
                        paymentId: inputData.paymentId,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                    });

                    if (!response) {
                        reject({
                            errCode: 1,
                            message: 'Something went wrong, Create Failed!',
                        })
                    }
                }

                resolve({
                    errCode: 0,
                    message: 'OK',
                })
            }
        } catch (errors) {
            reject(errors);
        }
    });
}

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'missing required parameter!',
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentMarkdown', 'contentHTML'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Doctor_Info, as: 'doctorData', attributes: ['priceId', 'provinceId', 'paymentId', 'addressClinic', 'nameClinic', 'note'] },
                        // {
                        //     model: db.Doctor_Info, as: 'doctorData',
                        //     attributes: {
                        //         exclude: ['id', 'doctorId'],
                        //     },
                        //     include: [
                        //         { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        //         { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        //         { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        //     ]
                        // }
                    ],
                    raw: false,
                    nest: true,
                });
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    message: 'OK',
                    data: data,
                })
            }
        } catch (errors) {
            reject(errors);
        }
    })
}

let handleBulkCreateShedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = data.arrSchedule;
            if (schedule && schedule.length > 0 && data.doctorId && data.formatedDate) {
                schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;
                    return item;
                });

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                });

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                if (toCreate && toCreate.length > 0) {
                    let response = await db.Schedule.bulkCreate(toCreate);
                    if (response) {
                        resolve({
                            errCode: 0,
                            message: 'OK'
                        });
                    } else {
                        resolve({
                            errCode: 2,
                            message: 'Can not create schedule data'
                        });
                    }
                } else {
                    resolve({
                        errCode: 3,
                        message: 'Something went wrong'
                    });
                }
            } else {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                })
            }
        } catch (errors) {
            reject(errors);
        }
    });
}

let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (doctorId && date) {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: true,
                    nest: true,
                });

                if (data.length > 0) {
                    resolve({
                        errCode: 0,
                        message: 'OK',
                        data: data
                    })
                } else {
                    resolve({
                        errCode: 2,
                        message: 'can not find schedule! try again',
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                })
            }
        } catch (errors) {
            reject(errors);
        }
    })
}

let handleGetExtraInfoDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await db.Doctor_Info.findOne({
                where: {
                    doctorId: id
                },
                attributes: {
                    exclude: ['id', 'doctorId'],
                },
                include: [
                    { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            });
            if (response) {
                resolve({
                    errCode: 0,
                    message: 'OK',
                    data: response,
                });
            } else {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter',
                })
            }
        } catch (errors) {
            reject(errors);
        }
    });
}

let handleGetProfileDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Markdown, attributes: ['description', 'contentMarkdown', 'contentHTML'] },
                    {
                        model: db.Doctor_Info, as: 'doctorData',
                        attributes: {
                            exclude: ['id', 'doctorId'],
                        },
                        include: [
                            { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        ]
                    }
                ],
                raw: false,
                nest: true,
            });
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary');
            }
            if (!data) {
                data = {}
            }
            resolve({
                errCode: 0,
                message: 'OK',
                data: data,
            })
        } catch (errors) {
            reject(errors);
        }
    });
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    handleBulkCreateShedule: handleBulkCreateShedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    handleGetExtraInfoDoctorById: handleGetExtraInfoDoctorById,
    handleGetProfileDoctorById: handleGetProfileDoctorById,
}