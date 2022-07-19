import db from '../models/index';
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstname,
                lastName: data.lastname,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleid,
                phonenumber: data.phonenumber,
            });
            resolve('Created new user!');
        } catch (error) {
            console.log(error);
        }
    });
}

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

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            console.log(error);
        }
    });
}

let getUserInfoById = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            let user = db.User.findOne({
                where: { id: userId },
                raw: true,
            })
            if (user) {
                resolve(user);
            } else {
                resolve([]);
            }
        } catch (error) {

        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            });

            if (user) {
                user.firstName = data.firstName,
                user.lastName = data.lastName,
                user.address = data.address
                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else { 
                resolve();
            }
            // let user = await db.User.update({
            //     firstName: data.firstName,
            //     lastName: data.lastName,
            //     address: data.address,
            // }, {
            //     where: { id: data.id }
            // });
            // if (user) {
            //     resolve();
            // } else {
            //     resolve();
            // }
        } catch (error) {
            console.log(error);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
};