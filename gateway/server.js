const express = require('express');
const morgan = require('morgan');
const appRouter = require('./lib/app-router');


const server = express();

// ENVIRONMENT
const environmentTypes = ['production', 'development'];
const envArg = process.argv && process.argv[process.argv.length - 1];
const env = ~environmentTypes.indexOf(envArg) && envArg || 'development';
process.env.NODE_ENV = env;

// INJECTED PORT
const serverPort = process.env.PORT || null;

// RUNTIME CONFIGIRATION
const config = require('./config')(env, serverPort);

// LOGGER
server.use(morgan('combined'));

// DB SETUP
const mongoose = require('./lib/app-db')(config);



// APP ROUTER
server.use(express.static('public'));
server.use(config.siteRoot, appRouter(config));

server.listen(config.serverPort, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> Listening on port %s in %s mode", config.serverPort, env);
    }
});

module.exports = server;
