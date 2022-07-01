const dbHandler = require('../../db/index').dbHandler;
const responseMessages = require('../utils/responseMessages');
const constant = require('../utils/constant');
const bcrypt = require('bcryptjs')
const salt = 10;

const userDetails = {
    getUserDetailsByEmail: payload => {
        return new Promise((resolve, reject) => {
            let query = `SELECT users.id, users.first_name, users.last_name, users.phone_number,
            users.user_role,users.is_registered, users.is_active,
            users.is_deleted,users.password,users.email_id
            FROM users 
            WHERE users.email_id = ?`; 
            let queryObj = {
                query: query,
                args: [payload.email_id],
                event: "getUserDetailsByEmail"
            };
            dbHandler.executeQuery(queryObj).then((result) => {
                if (result.length > 0) {
                    resolve(result);
                } else {
                    resolve([]);
                }
            }, (error) => {
                logging.logDatabaseQueryError('Error in getUserDetailsByEmail', error);
                reject(responseMessages.ERROR.DEFAULT);
            });
        });
    },
    insertRegisterUser: payload => {
        return new Promise((resolve, reject) => {
            let query = `INSERT INTO users(email_id,first_name,last_name,phone_number,
                is_registered,is_active,user_role,registration_datetime,password)
                VALUES(?,?,?,?,?,?,?,?,?)`;

            let bindParams = [payload.email_id, payload.first_name, payload.last_name,
            payload.phone_number,constant.isRegistered.TRUE,
            payload.is_active, payload.user_role, new Date(),payload.password];

            let queryObj = {
                query: query,
                args: bindParams,
                event: "insertRegisterUser"
            };
            dbHandler.executeQuery(queryObj).then((result) => {
                resolve(result);
            }, (error) => {
                logging.logDatabaseQueryError('Error in insertRegisterUser', error);
                reject(responseMessages.ERROR.DEFAULT);
            });
        });
    },
    
    insertUserAccessToken: payload => {
        return new Promise((resolve, reject) => {
            let query = `INSERT into access_token(user_id,user_role,access_token,access_token_creation,is_active,created_by)
                VALUES(?,?,?,?,?,?)`;

            let bindParams = [payload.user_id, payload.user_role, payload.access_token, payload.access_token_creation,
             payload.is_active, payload.user_id];

            let queryObj = {
                query: query,
                args: bindParams,
                event: "insertUserAccessToken"
            };
            dbHandler.executeQuery(queryObj).then((result) => {
                resolve(result);
            }, (error) => {
                logging.logDatabaseQueryError('Error in insertUserAccessToken', error);
                reject(responseMessages.ERROR.DEFAULT);
            });
        });
    },
    updateUserAccessToken: payload => {
        return new Promise((resolve, reject) => {
            let query = `update access_token SET is_active=? AND is_deleted=? WHERE user_id=?`;

            let bindParams = [constant.isActive.FALSE, constant.isDeleted.TRUE, payload.user_id];

            let queryObj = {
                query: query,
                args: bindParams,
                event: "updateUserAccessToken"
            };
            dbHandler.executeQuery(queryObj).then((result) => {
                resolve(result);
            }, (error) => {
                logging.logDatabaseQueryError('Error in updateUserAccessToken', error);
                reject(responseMessages.ERROR.DEFAULT);
            });
        });
    },
    
    getPasswordPolicy: payload => {
        return new Promise((resolve, reject) => {
            let query = `SELECT password_policy.min_length, password_policy.min_numeric_char, password_policy.min_lower_char,
            password_policy.min_upper_char,password_policy.min_special_char
            FROM password_policy`
            let queryObj = {
                query: query,
                args: [],
                event: "getPasswordPolicy"
            };
            dbHandler.executeQuery(queryObj).then((result) => {
                if (result.length > 0) {
                    resolve(result[0]);
                } else {
                    resolve([])
                }
            }, (error) => {
                logging.logDatabaseQueryError('Error in getPasswordPolicy', error);
                reject(responseMessages.ERROR.DEFAULT);
            });
        });
    },
    insertPasswordPolicy: payload => {
        return new Promise((resolve, reject) => {
            let query = `insert into password_policy(min_length,min_numeric_char,min_lower_char,
                min_upper_char,min_special_char)
                VALUES(?,?,?,?,?)`;
            let bindParams = [constant.defaultPasswordPolicy.min_length, constant.defaultPasswordPolicy.min_numeric_char, constant.defaultPasswordPolicy.min_lower_char,
            constant.defaultPasswordPolicy.min_upper_char, constant.defaultPasswordPolicy.min_special_char];
            let queryObj = {
                query: query,
                args: bindParams,
                event: "insertPasswordPolicy"
            };
            dbHandler.executeQuery(queryObj).then((result) => {
                resolve(result);
            }, (error) => {
                logging.logDatabaseQueryError('Error in insertPasswordPolicy', error);
                reject(responseMessages.ERROR.DEFAULT);
            });
        });
    },
    updateUserLoginDetails: payload => {
        return new Promise((resolve, reject) => {
            let query = `UPDATE users SET last_login_datetime = ? WHERE email_id = ?`;

            let queryObj = {
                query: query,
                args: [new Date(), payload.email_id],
                event: "updateUserLoginDetails"
            };
            dbHandler.executeQuery(queryObj).then((result) => {
                resolve(result);
            }, (error) => {
                logging.logDatabaseQueryError('Error in updateUserLoginDetails', error);
                reject(responseMessages.ERROR.DEFAULT);
            });
        });
    },
    getUsersList: () => {
        return new Promise((resolve, reject) => {
            let query = `SELECT U.id, U.first_name, U.last_name, U.email_id, 
            U.phone_number,U.password,U.is_registered, U.is_active, U.is_deleted
            FROM users U
            WHERE U.is_active = ? AND U.is_deleted = ?`;
            let queryObj = {
                query: query,
                args: [constant.isActive.TRUE, constant.isDeleted.FALSE],
                event: "getUsersList"
            };
            dbHandler.executeQuery(queryObj).then((result) => {
                if (result.length > 0) {
                    resolve(result);
                } else {
                    resolve([]);
                }
            }, (error) => {
                logging.logDatabaseQueryError('Error in getUsersList', error);
                reject(responseMessages.ERROR.DEFAULT);
            });
        });
    },
    validateEmailIdAndPassword: (payload) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT email_id, password FROM users WHERE email_id = ?`;
            let queryObj = {
                query: query,
                args: [payload.email_id],
                event: "validateEmailId"
            };
            dbHandler.executeQuery(queryObj).then((result) => {
                if (result.length > 0) {
                    if (bcrypt.compareSync(payload.password, result[0].password)) {
                        resolve(result[0]);
                    } else {
                        reject(responseMessages.ERROR.INVALID_PASSWORD);
                    }
                } else {
                    reject(responseMessages.ERROR.INAVLID_EMAIL_ID);
                }
            }, (error) => {
                logging.logDatabaseQueryError('Error in validateEmailIdAndPassword ', error);
                reject(responseMessages.ERROR.DEFAULT);
            });
        });
    },
     
   
}

module.exports = { userDetails }
