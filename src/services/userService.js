const userDao = require('../dao/userDao').userDetails;
const responseMessages = require('../utils/responseMessages');
const jwt = require('jsonwebtoken');
const config = require('../../db/config/config_detail');
const Promise = require('bluebird');
const constant = require('../utils/constant');
const _ = require('underscore');
const universalFunction = require('../utils/universalFunction');
const bcrypt = require('bcryptjs')
const salt = 10;

const userServices = {
    userRegister: data => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let userExists = yield userDao.getUserDetailsByEmail(data);
                if (userExists.length > 0) {
                    userExists = userExists[0]
                    if (userExists.is_registered == constant.isRegistered.TRUE && userExists.is_active == constant.isActive.FALSE) {
                        throw new Error(responseMessages.ERROR.ACCOUNT_DEACTIVATED.customMessage);
                    }
                    if (userExists.is_registered == constant.isRegistered.TRUE
                        && userExists.is_active == constant.isActive.TRUE) {
                        throw new Error(responseMessages.SUCCESS.USER_EXIST.customMessage)
                    }

                }else {
                    let password_policy = yield userDao.getPasswordPolicy();
                    if (password_policy.length == 0) {
                        yield userDao.insertPasswordPolicy()
                        password_policy = yield userDao.getPasswordPolicy();
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
                        data.password = password
                    }
                    console.log(data.password)
                    let userData = yield userDao.insertRegisterUser(data);
                    return {
                        data: {
                            user_id: userData.insertId

                        }
                    }
            }

            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    },

    getUserProfile: (data) => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let userDetails = yield userDao.getUserDetailsById(data);
                if (userDetails.length == 0) {
                    throw new Error(responseMessages.ERROR.USER_NOT_FOUND.customMessage);
                }
                else {
                    return {
                        data: {
                            first_name: userDetails.first_name,
                            last_name: userDetails.last_name,
                            email_id: userDetails.email_id,
                            street_address: userDetails.street_address,
                            apartment: userDetails.apartment,
                            city_id: userDetails.city_id,
                            city: userDetails.city_name,
                            state_id: userDetails.state_id,
                            state: userDetails.state_name,
                            country_id: userDetails.country_id,
                            country: userDetails.country_name,
                            zip_code: userDetails.zip_code,
                            phone_number: userDetails.phone_number,
                            is_wifi_connected: userDetails.is_wifi_connected
                        }
                    }
                }
            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    },
    userLogin: (data) => {
        return new Promise((resolve, reject) => {
            Promise.coroutine(function* () {
                let users = yield userDao.getUserDetailsByEmail(data);
                if (users.length == 0) {
                    throw new Error(responseMessages.ERROR.INAVLID_EMAIL_ID.customMessage);
                }
                users = users[0];
                if (users.is_registered == constant.isRegistered.TRUE) {
                    if (users.is_active == constant.isActive.FALSE) {
                        throw new Error(responseMessages.ERROR.ACCOUNT_DEACTIVATED.customMessage)
                    }
                    let user_password = yield userDao.validateEmailIdAndPassword(data);
                    let accessTokenData = {
                        access_token_creation: new Date(),
                        is_active: constant.isActive.TRUE
                    }
                    
                    let randomString = new Date() + users.id;
                    let accessTokenExpiryDays = constant.accessTokenExpiryDays.days;

                    let token = jwt.sign({
                        user_id: users.id,
                        user_role: users.user_role,
                        phone_number: users.phone_number,
                        email_id: users.email_id,
                        string: randomString
                    }, config.jwt_key, { expiresIn: accessTokenExpiryDays });
                    accessTokenData.access_token = token;
                    accessTokenData.user_role = users.user_role
                    accessTokenData.user_id = users.id,
                    yield userDao.updateUserAccessToken(accessTokenData);
                    yield userDao.insertUserAccessToken(accessTokenData);
                    yield userDao.updateUserLoginDetails(users);
                        
                    return {
                        data: {
                            user_id: users.id,
                            access_token: token,
                            first_name: users.first_name,
                            last_name: users.last_name,
                            email_id: users.email_id,
                            password: user_password.password,
                            phone_number: users.phone_number
                        }
                    }
                    
                } else {
                    throw new Error(responseMessages.ERROR.NOT_REGISTERED.customMessage);
                }

            })().then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        })
    }

}
module.exports = { userServices };
