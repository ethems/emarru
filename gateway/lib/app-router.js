const express = require('express');
const path = require('path');
const cors = require('cors');

const appRouter = express.Router();
const apiRouter = require('./api-router');
const passportService= require('./passport');

module.exports = config => {

    // CORS ENABLING
    appRouter.use(cors());
    //PASSPORT
    passportService(config);
    // API
    appRouter.use('/api',apiRouter(config));

    // RETURN SPA
    appRouter.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, '../../public/index.html'));
    });


    return appRouter;
}
