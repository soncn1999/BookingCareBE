import userService from '../services/userService';

let handleLogin = async(req, res) => {
    //Ktra Email cua ng dung co ton tai khong, ktra pass co dung khong
    //Tra lai thong tin ng dung + access_token (JWT)
    console.log(req);
    let email = req.body.email;
    let password = req.body.password;
    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter!',
        });
    }

    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //type: id, ALL

    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter!',
            users: [],
        });
    }

    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users: users,
    });
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body.user);
    console.log(message);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    console.log(req.body);
    let data = req.body.user;
    let message = await userService.updateUser(data);
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'User not found',
        })
    }

    let message = await userService.deleteUser(req.body.id);

    return res.status(200).json(message);
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeServices(req.query.type);
        return res.status(200).json(data);
    } catch (errors) {
        console.log(errors);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
}