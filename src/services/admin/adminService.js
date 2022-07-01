const userDao = require('../../dao/userDao').userDetails;
const responseMessages = require('../../utils/responseMessages');
const jwt = require('jsonwebtoken');
const config = require('../../../db/config/config_detail');
const Promise = require('bluebird');
const constant = require('../../utils/constant');
const _ = require('underscore');
const universalFunction = require('../../utils/universalFunction');
const bcrypt = require('bcryptjs')
const authJwt = require('../../middleware/validateAccessToken').authCheck;
const salt = 10;
const adminServices = {

    adminLogin: (data) => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let plain_text_password = data.password;
                let admin = yield adminDao.getAdminDetailsByEmail(data);
               
                if (admin.length == 0) {
                    throw new Error(responseMessages.ERROR.NOT_REGISTERED.customMessage)
                    
                }
                else {
                    yield adminDao.validateEmailIdAndPassword(data);

                }
                let accessTokenData = {
                    access_token_creation: new Date(),
                    device_token: data.device_token,
                    device_type: data.device_type,
                    device_model: data.device_model,
                    os_version: data.os_version,
                    is_active: constant.isActive.TRUE
                }

                let randomString = new Date() + admin.id;
                let accessTokenExpiryDays = constant.accessTokenExpiryDays.days;

                let token = jwt.sign({
                    user_id: admin.id,
                    user_role: admin.user_role,
                    phone_number: admin.phone_number,
                    email_id: admin.email_id,
                    string: randomString
                }, config.jwt_key, { expiresIn: accessTokenExpiryDays });

                accessTokenData.access_token = token;
                accessTokenData.user_role = admin.user_role
                accessTokenData.user_id = admin.id,
                yield adminDao.insertAdminAccessToken(accessTokenData);
                yield adminDao.updateAdminLoginDetails(admin);
                return {
                    data: {
                        user_id: admin.id,
                        access_token: token,
                        first_name: admin.first_name,
                        last_name: admin.last_name,
                        email_id: admin.email_id,
                        password: plain_text_password,
                        phone_number: admin.phone_number
                    }
                }
            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        })
    },

    adminLogOut: data => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                yield adminDao.destroyAdminSession(data);
            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        })
    },

    sendAdminResetPasswordToken: data => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let adminExists = yield adminDao.getAdminDetailsByEmail(data);
                if (adminExists.length == 0) {
                    throw new Error(responseMessages.ERROR.USER_NOT_FOUND.customMessage);
                }
                yield adminDao.updateAdminForgotPasswordToken(data);
                return {
                    data: {
                        verification_otp: data.verification_otp
                    }
                }

            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    },
    verifyAdminForgotPasswordToken: data => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let userOTPDetails = yield adminDao.getAdminDetailsByEmail(data);
                if (userOTPDetails.length == 0) {
                    throw new Error(responseMessages.ERROR.USER_NOT_FOUND.customMessage);
                }
                if (userOTPDetails.forgot_password_token == data.forgot_password_token) {
                    yield adminDao.updateAdminEmailIdVerificationStatus(data);
                    return { data: { is_email_id_verified: userOTPDetails.is_email_id_verified } }
                } else {
                    throw new Error(responseMessages.ERROR.INVALID_VERIFICATION_OTP.customMessage);
                }
            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    },

    resetAdminPassword: (data) => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let userExists = yield adminDao.getAdminDetailsByEmail(data);
                if (userExists.length == 0) {
                    throw new Error(responseMessages.ERROR.USER_NOT_FOUND.customMessage);
                }

                let password_policy = yield adminDao.getPasswordPolicy();
                if (password_policy.length == 0) {
                    yield adminDao.insertPasswordPolicy()
                    password_policy = yield adminDao.getPasswordPolicy();
                }
                let checkPasswordStrength = universalFunction.getUserPasswordStrength(password_policy, data);
                if (checkPasswordStrength.status == "Password weak") {
                    throw new Error(responseMessages.ERROR.PASSWORD_LENGTH.customMessage.replace('{PASSWORD_LENGTH}', password_policy.min_length))
                }

                if (checkPasswordStrength.status == "Password strength are not statisfied") {
                    let passwordStrength = `atleast ${password_policy.min_numeric_char} numeric char and ${password_policy.min_upper_char} upper char and ${password_policy.min_lower_char} lower char and ${password_policy.min_special_char} special char`
                    throw new Error(responseMessages.ERROR.PASSWORD_STRENGTH.customMessage.replace('{STRENGTH_DETAILS}', passwordStrength));
                }
                if (checkPasswordStrength.status == true) {
                    let password = bcrypt.hashSync(data.password, salt);
                    let generatedPassword = {
                        password: password,
                        user_id: userExists.id
                    }
                    yield adminDao.insertAdminPassword(generatedPassword);
                    return { data: {} }
                }

            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    },

    updateAdminProfile: (data) => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let userDetails = yield userDao.getUserDetailsById(data);
                if (userDetails.length == 0) {
                    throw new Error(responseMessages.ERROR.USER_NOT_FOUND.customMessage);
                }
                if(data.is_profile_picture_upload == 0) {
                    let user_password = yield adminDao.validateIdAndPassword(data);
                    data.new_password = bcrypt.hashSync(data.new_password, salt);
                }
                yield adminDao.updateAdminProfile(data);
                return {
                    data: {}

                }
            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });

        });
    },

    getUsersList: (data) => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let usersList = yield userDao.getUsersList(data);
                return {
                    data: {
                        users : usersList
        
                    }
                }
            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    },
    getZendeskTicketList: (data, res) => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let validateUser = yield authJwt.getAccessToken(data.access_token);
                validateUser = validateUser.data;
                data.user_id = validateUser.user_id
                universalFunction.sendHttpRequestForZendeskTickets(data, res)
            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    },
    
    getZendeskImportantTicketList: (data) => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                if(data.is_important == constant.isImportant.FALSE) {
                    yield adminDao.removeZendeskImportantMessage(data);
                }
                let ZendeskDetails = yield adminDao.addZendeskImportantMessage(data);
                data.id=ZendeskDetails.insertId
                let zendesk_tickets= yield adminDao.getZendeskImportantTickets(data)
                return {
                    data: {
                        zendesk_tickets : zendesk_tickets
    
                    }
                }
            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    },
}

module.exports = { adminServices };