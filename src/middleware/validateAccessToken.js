const jwt = require('jsonwebtoken');
const config = require('../../db/config/config_detail')
const Promise = require('bluebird');
const responseMessages = require('../utils/responseMessages')

const authCheck = {
    getAccessToken : function(accessToken) {
        return new Promise((resolve, reject) => {
			Promise.coroutine(function* () {
				let decode= jwt.verify(accessToken,config.jwt_key);
				if(decode) {
					return {data : decode}
				}
				else {
					throw new Error(responseMessages.ERROR.INVALID_ACCESS_TOKEN)
				}
				 
            })().then((data) => {
                resolve(data)
            }, (error) => {
                reject(error)
            });
        })
    },
};


module.exports = {authCheck};

