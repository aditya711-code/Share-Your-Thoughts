const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
//tell passport to use newStrategy to google login
passport.use(new googleStrategy({
        clientID: "731815305724-po6kkenptl3e5j6nsbgsf2j5745of5cc.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://127.0.0.1:8000/users/auth/google/callback",
    },
    function(accessToken,refreshToken,profile,done)
    {
        //find a User
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err) {console.log("****Error in goggle strategy passport**",err);
                return;
            }
            console.log(accessToken,refreshToken);
            console.log(profile);
            if(user){
                //if found set this user as req.user
                return done(null,user);
            }else{
                //if not found create the user and set it as req.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){onsole.log("****Error in creating user**",err);
                return;}
                    return done(null,user);
                })
            }
        })
    }

    ));
module.exports=passport;