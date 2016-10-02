const moment = require('moment');
const User = require('../models/user');

const AuthenticationController = apiRouter => {

    apiRouter.post('/signup', function(req, res) {
        req.checkBody('email', 'Invalid email').len(1, 100).isEmail();
        req.checkBody('password', 'Invalid password').len(5, 50);

        var errors=req.validationErrors();
        if(errors){
          res.status(400).json({error:"Validation error !"})
        }
        var newUser={
          email:req.body.email
        }
        User.hashPassword(req.body.password, function(err,passwordHash){
          if(err){
            res.status(500).json({error:"Opppssss !!! There is a problem when hashing password!"});
          }
          newUser.passwordHash=passwordHash;
          User.create(newUser,function(err,user){
            if(err){
              res.status(500).json({error:"Opppssss !!! There is a problem when creating a new user!"})
            }
            res.json(user);
          })
        })

    });

}

module.exports = {
    default: AuthenticationController
}
