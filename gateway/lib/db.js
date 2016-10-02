const Mongoose= require('mongoose');
var logger = require("./logger");


module.exports = config => {
  Mongoose.Promise=require('bluebird');
  Mongoose.connect(config.dbUri);

  Mongoose.connection.on('error', error=>{
    console.log("MongoDB Error: ",error);
  });

  process.on('SIGINT',function(){
    Mongoose.connection.close(function(){
      logger.info('Mongoose disconnected through app terminal');
      process.exit(0)
    });
  });

  return Mongoose;
}
