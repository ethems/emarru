const Mongoose= require('mongoose');

module.exports = config => {
  console.log(config.dbUri);
  Mongoose.connect(config.dbUri);

  Mongoose.connection.on('error', error=>{
    console.log("MongoDB Error: ",error);
  });

  return Mongoose;
}
