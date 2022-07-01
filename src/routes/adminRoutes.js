//ADMIN SUB-ROUTING ROUTES
var router = require('express').Router();
const validator = require('../utils/validator');
const admin = require('../controllers/admin/adminController');

module.exports = function (app, addon) {
   
/*
    GET USER BASED ON ADMIN ROLE
    */
    router.get('/api/getUserList', function (req, res, next) {
        validator.getUsersList(req, res, next);
    }, function (req, res, next) {
        admin.getUsersList(req.query, res);
    })
    return router;

}


