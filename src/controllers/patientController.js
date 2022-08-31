import patientService from '../services/patientService';

let postBookAppointment = async (req, res) => {
    try {
        let response = await patientService.handlePostBookAppointment(req.body);
        return res.status(200).json(response);
    } catch (errors) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from Server'
        })
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
}