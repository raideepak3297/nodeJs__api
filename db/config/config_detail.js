/* eslint-disable no-bitwise */
const dotenv = require('dotenv');

dotenv.config();

const vcap_services = process.env.VCAP_SERVICES;
let customize_string = process.env;

if (vcap_services) {
	const dataParse = JSON.parse(vcap_services);
	console.log(dataParse['user-provided']);
	customize_string = dataParse['user-provided'][0].credentials
}

module.exports = {
	db_host: customize_string.DB_HOST,
	db_user_name:customize_string.DB_USERNAME,
	db_password: customize_string.DB_PASSWORD,
	db_name:customize_string.DB_NAME,
	db_dialect: customize_string.DB_DIALECT,
	db_pool: {
		max: customize_string.DB_POOL_MAX,
		min: customize_string.DB_POOL_MIN,
		acquire: customize_string.DB_POOL_ACQUIRE,
		idle: customize_string.DB_POOL_IDLE,
	},
	port:customize_string.PORT,
	jwt_key: customize_string.JWT_KEY
}

