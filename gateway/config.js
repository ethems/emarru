const path = require('path');
const fs = require('fs');

module.exports = (env, serverPort) => {
    const filePath = path.join(__dirname, '../configuration.json');

    try {
        fs.accessSync(filePath, fs.F_OK);
    } catch (e) {
        console.error("Error: 'configuration.json' file doesn't exist in root!");
        process.exit(0);
    }

    const configJson = JSON.parse(fs.readFileSync(filePath));
    const runtimeConfig = {};

    runtimeConfig.serverPort = serverPort || configJson['Application.ServerPort'] || 3000;
    runtimeConfig.siteRoot = `/${configJson['Application.SiteRoot']}`;
    runtimeConfig.dbUri= configJson['Application.DBUri'];

    return runtimeConfig;

}
