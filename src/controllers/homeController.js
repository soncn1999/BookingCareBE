import { json } from 'body-parser';
import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log("================================================");
        console.log(data);
        console.log("================================================");
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

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    // console.log(req.body);
    console.log(message);
    return res.send('post CRUD from server');
}

module.exports = {
    getHomePage: getHomepage,
    getCRUD: getCRUD,
    postCRUD: postCRUD
}