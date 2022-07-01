
const Joi = require('joi');
const universalFun = require('../utils/universalFunction');
const constant = require('./constant')
const logging = require('../utils/logging');

exports.userRegister = function (req, res, next) {
	logging.startSection('userRegister');
	logging.logRequest(req);
	const schema = Joi.object().keys({
		email_id: Joi.string().trim().email({ minDomainAtoms: constant.MIN_DOTAT }).max(constant.EMAIL_MAX_SIZE).required(),
		first_name: Joi.string().required(),
		last_name: Joi.string().required(),
		phone_number: Joi.string().trim().max(16).required(),
		password: Joi.string().required(),

	});
	let validFields = validateFields(req.body, res, schema);
	if (validFields) {
		req.body.req_ip = req.connection.remoteAddress;
		next();
	}
};

exports.userLogin = function (req, res, next) {
	logging.startSection('userLogin');
	logging.logRequest(req);
	const schema = Joi.object().keys({
		email_id: Joi.string().trim().email({ minDomainAtoms: constant.MIN_DOTAT }).max(constant.EMAIL_MAX_SIZE).required(),
		password: Joi.string().required()
	});

	let validFields = validateFields(req.body, res, schema);
	if (validFields) {
		req.body.req_ip = req.connection.remoteAddress;
		next();
	}
};

exports.getUsersList = function (req, res, next) {
	logging.startSection('getUsersList');
	logging.logRequest(req);
	const schema = Joi.object().keys({
		user_role : Joi.number().required()

	});
	let validFields = validateFields(req.query, res, schema);
	if (validFields) {
		//if (validateAccessTokenFields(req, res, 'GET')) {
			next()
		//}
	}
};

exports.checkAnagram = function (req, res, next) {
	logging.startSection('checkAnagram');
	logging.logRequest(req);
	const schema = Joi.object().keys({
		first_input: Joi.string().required(),
		second_input: Joi.string().required()
	});

	let validFields = validateFields(req.body, res, schema);
	if (validFields) {
		if (validateAccessTokenFields(req, res)) {
			next()
		}
	}
};

const validateFields = function (req, res, schema) {
	const validation = Joi.validate(req, schema);
	if (validation.error) {
		let errorName = validation.error.name;
		let errorReason =
			validation.error.details !== undefined
				? validation.error.details[0].message
				: 'Parameter missing or parameter type is wrong';
		universalFun.sendError(new Error(errorName + ' ' + errorReason), res);
		return false;
	}
	return true;
};

const validateAccessTokenFields = function (req, res, method) {
	logging.consolelog('REQUEST HEADERS : ' + req.headers);

	if (req.headers.authorization == undefined || req.headers.authorization == null || req.headers.authorization == '') {
		let errorReason = 'authorization is required';
		universalFun.sendError(new Error(errorReason), res);
		return false;
	}

	var split = req.headers.authorization.split(" ");
	if (!(split.length == 2 && split[0] === "Bearer")) {
		let errorReason = 'authorization is required';
		universalFun.sendError(new Error(errorReason), res);
		return false;
	}

	if (method == 'GET') {
		req.query.access_token = split[1];
	}
	else {
		req.body.access_token = split[1];
	}

	return true;
}
