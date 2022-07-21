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

module.exports = {
    handleLogin: handleLogin,
}