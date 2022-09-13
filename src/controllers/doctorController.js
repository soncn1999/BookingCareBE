import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;

    if (!limit) {
        limit = 10;
    }
    try {
        let response = await doctorService.getTopDoctorHome(limit);
        return res.status(200).json(
            response
        );
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server',
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (errors) {
        console.log(errors);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server'
        });
    }
}

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body);
        return res.status(200).json(response)
    } catch (errors) {
        console.log(errors);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server',
        });
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(info);
    } catch (errors) {
        console.log(errors);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server',
        })
    }
}

let bulkCreateShedule = async (req, res) => {
    try {
        let response = await doctorService.handleBulkCreateShedule(req.body);
        return res.status(200).json(response);
    } catch (errors) {
        console.log(errors);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!'
        })
    }
}

let getScheduleDoctorByDate = async (req, res) => {
    let info = await doctorService.getScheduleDoctorByDate(req.query.doctorId, req.query.date);
    return res.status(200).json(info);
}

let getExtraInfoDoctorById = async (req, res) => {
    try {
        let response = await doctorService.handleGetExtraInfoDoctorById(req.query.id);
        return res.status(200).json(response);
    } catch (errors) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server',
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let response = await doctorService.handleGetProfileDoctorById(req.query.id);
        return res.status(200).json(response);
    } catch (errors) {
        res.status(200).json({
            errCode: -1,
            message: `Error from server! ${errors}`,
        });
    }
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctor: postInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateShedule: bulkCreateShedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById,
}