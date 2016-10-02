const express = require('express');
const morgan = require('morgan');
const appRouter = require('./lib/app-router');

var logger = require("./lib/logger");


const server = express();

// ENVIRONMENT
const environmentTypes = ['production', 'development', 'test'];
const envArg = process.argv && process.argv[process.argv.length - 1];
const env = ~environmentTypes.indexOf(envArg) && envArg || 'development';
process.env.NODE_ENV = process.env.NODE_ENV || env;

// INJECTED PORT
const serverPort = process.env.PORT || null;

// RUNTIME CONFIGIRATION
const config = require('./config')(env, serverPort);

// LOGGER
server.use(morgan('combined',{ "stream": logger.stream }));

// DB SETUP
const mongoose = require('./lib/db')(config);



// APP ROUTER
server.use(express.static('public'));
server.use(config.siteRoot, appRouter(config));

server.listen(config.serverPort, function(error) {
    if (error) {
        logger.error(error);
    } else {
        logger.info("==> Listening on port %s in %s mode", config.serverPort, env);
    }
});

module.exports = server;
