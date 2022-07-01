const constant = require('../../utils/constant');
const universalFun = require('../../utils/universalFunction');
const responseMessages = require('../../utils/responseMessages');
const authJwt = require('../../middleware/validateAccessToken').authCheck;
const Promise = require('bluebird');
const adminServices = require('../../services/admin/adminService').adminServices;


/**  GET USERS LIST API */

exports.getUsersList = (payload, res) => {
    Promise.coroutine(function* () {
        
        if (payload.user_role == constant.userRole.ADMIN) {
            let result = yield adminServices.getUsersList(payload);
            return result;
        }
        else {
            throw new Error(responseMessages.ERROR.UNATHORIZE_ACCES.customMessage);
        }

    })().then((result) => {
        universalFun.sendSuccess(responseMessages.SUCCESS.DEFAULT, result.data, res);
    }, (error) => {
        universalFun.sendError(error, res);
    });
};

