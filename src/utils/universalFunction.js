const { SUCCESS } = require('./responseMessages');
const Error = require('../utils/responseMessages').ERROR
const logging = require('./logging');
const constant = require('../utils/constant');
const Promise = require('bluebird');
const authJwt = require('../middleware/validateAccessToken').authCheck;
const _ = require('underscore');
const config = require('../../db/config/config_detail');
const responseMessages = require('../utils/responseMessages');

exports.response = (res, status, message, result) => {
	let response;
	response = {
		status,
		message,
		data: result,
	}
	return res.json({ 'res': response });
};

exports.sendError = function (err, res) {
	const errorMessage = err.customMessage || err.message || Error.DEFAULT.customMessage;
	if (typeof err == 'object' && err.hasOwnProperty('rescode') && err.hasOwnProperty('customMessage')) {
		return res.status(err.statusCode).send({ statusCode: err.statusCode, message: errorMessage, type: err.type || Error.DEFAULT.type });
	}
	let statusCode = err.hasOwnProperty('statusCode') ? err.statusCode : 400;
	let responseObj = { statusCode: statusCode, message: errorMessage, type: err.type || Error.DEFAULT.type };
	logging.logResponse(responseObj);
	return res.status(statusCode).send(responseObj);
};

exports.sendSuccess = function (successMsg, data, res, receivedResponseObj) {
	let statusCode = successMsg.statusCode || 200;
	let message = successMsg.customMessage || SUCCESS.DEFAULT.customMessage;
	let responseObj = receivedResponseObj ? receivedResponseObj : { statusCode: statusCode, message: message, data: data || {} };
	logging.logResponse(responseObj);
	return res.status(statusCode).send(responseObj);
};

exports.getUserPasswordStrength = function (passwordPolicy, passwordParams) {
	if (passwordParams.password.length >= passwordPolicy.min_length) {
		if ((passwordParams.password.match(/[a-z]/)) && (passwordParams.password.match(/[A-Z]/)) && (passwordParams.password.match((/[0-9]/)) && passwordParams.password.match((/[^A-Za-z0-9]/)))) {
			return { status: true }
		} else {
			return { status: "Password strength are not statisfied" }
		}
	} else {
		return { status: "Password weak" }
	}
};