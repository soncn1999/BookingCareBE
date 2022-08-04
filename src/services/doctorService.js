import db from '../models/index';

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
            console.log('input data: ', inputData);
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
                resolve({
                    errCode: 1,
                    message: 'missing required parameter'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    let doctorCreate = await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    });
                    if (doctorCreate) {
                        resolve({
                            errCode: 0,
                            message: 'OK',
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            message: 'Something went wrong',
                        })
                    }
                }
                if (inputData.action === 'EDIT') {
                    let doctorEdit = await db.Markdown.update({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        updatedAt: new Date(),
                    }, { where: { doctorId: inputData.doctorId } })

                    if (doctorEdit) {
                        resolve({
                            errCode: 0,
                            message: 'OK',
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            message: 'Something went wrong',
                        })
                    }
                }
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
                    ],
                    raw: false,
                    nest: true,
                })
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

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
}