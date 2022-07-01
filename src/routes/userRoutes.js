//USER SUB-ROUTING ROUTES
var router = require('express').Router();
const validator = require('../utils/validator');
const user = require('../controllers/userController');


module.exports = function (app, addon) {

    /*
    REGISTRATION FOR CUSTOMER
    */

    router.post('/api/userRegister', function (req, res, next) {
        validator.userRegister(req, res, next);
    }, function (req, res, next) {
        user.userRegister(req.body, res);
    })

    /*
    LOGIN CUSTOMER
    */

    router.post('/api/userLogin', function (req, res, next) {
        validator.userLogin(req, res, next);
    }, function (req, res, next) {
        user.userLogin(req.body, res);
    })

    
    /*
    API TO CHECK ANAGRAM
    */
    router.post('/api/checkAnagram', function (req, res, next) {
        validator.checkAnagram(req, res, next);
    }, function (req, res, next) {
        user.checkAnagram(req.body, res);
    })

    return router;

}


