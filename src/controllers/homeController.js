import { json } from 'body-parser';
import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    console.log('********************************');
    console.log(data);
    console.log('********************************');
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    console.log(req.query.id);
    if(userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        res.render('editCRUD.ejs', {
            userData: userData
        });
    } else {
        res.send('Del co cai id nay!');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data);
    return res.send('Update Done!');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send('post CRUD from server');
}

module.exports = {
    getHomePage: getHomepage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
}