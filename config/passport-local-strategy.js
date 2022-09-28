const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');
//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    },
    function(email,password,done)
    {
        console.log("EMAIL: ", email);
        //find a user and establish the identity
        User.findOne({email:email},function(err,user){
                    if(err) {
                        console.log("Error in finding the user--> passport");
                        return done(err);
                    }
                    console.log("USER: ",user);
                    if(!user|| user.password != password)
                    {
                        console.log("Invalid username Password");
                        return done(null,false);

                    }
                    return done(null,user);
            });
    }
));
//serialize the user to decide which key is  to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});
//deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err)
        {
            console.log('Error in finding user->Passport');
            return done(err);
        }
        return done(null,user);
    })

});
//check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    //if the user is signed in then pass on the request to the next function controllers action
    if(req.isAuthenticated())
    {
        return next();
    }
    //if the user is not sign-in
    return res.redirect('/users/sign-in');
}
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current sign-in user from the session cookie and we are just sending this to the locals for the views

        res.locals.user=req.user;

    }
     next();
}
//this was tryed by me just add this in routes.users/sign-In as a middleware

// passport.signedInUser=function(req,res,next)
// {
//     if(req.isAuthenticated())
//     {
//         return res.redirect('/users/profile');
//     }else {
//     res.render('/users/sign-in');
//   }
//   return next()
//
// }
module.exports=passport;