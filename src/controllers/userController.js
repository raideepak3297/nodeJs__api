
const constant = require('../utils/constant');
const universalFun = require('../utils/universalFunction');
const responseMessages = require('../utils/responseMessages');
const authJwt = require('../middleware/validateAccessToken').authCheck;
const Promise = require('bluebird');
const userServices = require('../services/userService').userServices



/** Register API */
exports.userRegister = (payload, res) => {
    Promise.coroutine(function* () {

        payload.user_role = constant.userRole.USER
        let registerParams = {
            email_id: payload.email_id,
            first_name: payload.first_name,
            last_name: payload.last_name,
            full_name: payload.first_name + " " + payload.last_name,
            phone_number: payload.phone_number,
            password: payload.password,
            is_active: constant.isActive.TRUE,
            user_role: payload.user_role
        };

        if (payload.user_role == constant.userRole.USER) {
            let result = yield userServices.userRegister(registerParams);
            return result;
        }
        else {
            throw new Error(responseMessages.ERROR.UNATHORIZE_ACCES.customMessage)
        }

    })().then((result) => {

        universalFun.sendSuccess(responseMessages.SUCCESS.REGISTER, result.data, res);
    }, (error) => {
        universalFun.sendError(error, res);
    });
};


/** Login API */

exports.userLogin = (payload, res) => {
    Promise.coroutine(function* () {
        payload.user_role = constant.userRole.USER
        let params = {
            email_id: payload.email_id,
            password: payload.password

        }
        if (payload.user_role == constant.userRole.USER) {
            let result = yield userServices.userLogin(params)
            return result;
        }
        else {
            throw new Error(responseMessages.ERROR.UNATHORIZE_ACCES.customMessage)
        }

    })().then((result) => {
        universalFun.sendSuccess(responseMessages.SUCCESS.LOGIN, result.data, res);
    }, (error) => {
        universalFun.sendError(error, res);
    });
};

exports.checkAnagram = (payload, res) => {
    Promise.coroutine(function* () {
        let validateUser = yield authJwt.getAccessToken(payload.access_token);
        validateUser = validateUser.data;
        let params = {
            user_id: validateUser.user_id,
            first_input : payload.first_input,
            second_input : payload.second_input
        }
        if (validateUser.user_role == constant.userRole.USER) {
            let first_input_length = params.first_input.length;
            let second_input_length = params.second_input.length;

            if(first_input_length !== second_input_length) {
                throw new Error('Invalid Input');
            }

            let first_string = params.first_input.split('').sort().join('');
            let second_string = params.second_input.split('').sort().join('');

            if(first_string == second_string) {
                return {
                    data : {
                        status : true
                    }
                }
            }else {
                return {
                    data : {
                        status : false
                    }
                }
            }
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
