"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');


const bindApiIndex= require('../api');

const apiRouter = express.Router();

module.exports = config => {


    // BODY PARSER
    apiRouter.use(bodyParser.urlencoded({extended: true}));
    apiRouter.use(bodyParser.json());
    apiRouter.use(expressValidator());

    // BIND ALL API CONTROLLERS
    bindApiIndex(apiRouter,config);

    // WHATEVER ROUTES DON'T MATCH THROW 404
    apiRouter.use('/*', (req, res, next) => {
        var error = new Error('Resource not found');
        error.status = error.statusCode = 404;
        return next(error);
    });

    return apiRouter;
};
