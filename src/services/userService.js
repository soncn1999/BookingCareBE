import db from '../models/index';
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user is true, compare password
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });

                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';

                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User isn't exist!`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your email isn't exist!`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId.trim() === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password'],
                    },
                });
            }

            if (userId && userId.trim() !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password'],
                    }
                });
            }
            resolve(users);
        } catch (errors) {
            reject(errors);
        }
    });
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);

            if (check) {
                resolve({
                    errCode: 1,
                    message: 'Email already in use, plz try again later',
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);

                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    phonenumber: data.phonenumber,
                    positionId: data.position,
                    image: data.avatar,
                });

                resolve({
                    errCode: 0,
                    message: 'OK',
                });
            }
        } catch (errors) {
            reject(errors);
        }
    });
};


let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            console.log(error);
        }
    })
}

let editUser = (id) => {

}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        if (!data.id || !data.roleId || !data.position || !data.gender) {
            resolve({
                errcode: 1,
                message: "Missing Required Parameter",
            })
        } else {
            try {
                let user = await db.User.findOne({
                    where: { id: data.id },
                });

                if (!user) {
                    resolve({
                        errCode: 2,
                        message: 'User not found, update is rejected',
                    });
                }

                await db.User.update({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    roleId: data.roleId,
                    gender: data.gender,
                    positionId: data.position,
                    image: data.avatar,
                }, {
                    where: { id: data.id },
                });

                resolve({
                    errCode: 0,
                    message: 'OK',
                });
            } catch (error) {
                reject(error);
            }
        }
    });
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.destroy({
                where: { id: id },
            });
            if (user) {
                resolve({
                    errCode: 0,
                    message: 'OK',
                });
            } else {
                resolve({
                    errCode: 2,
                    message: "User not found in DB",
                });
            }
        } catch (errors) {
            reject(errors);
        }
    });
};

let getAllCodeServices = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    message: 'Missing Require Parameter',
                });
            } else {
                let res = {};
                let allCodes = await db.Allcode.findAll(
                    { where: { type: typeInput } }
                );
                res.errCode = 0;
                res.message = 'OK';
                res.data = allCodes;
                resolve(res);
            }

        } catch (errors) {
            reject(errors);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    editUser: editUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllCodeServices: getAllCodeServices,
}