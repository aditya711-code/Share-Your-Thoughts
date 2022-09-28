const User=require('../models/user');
const fs=require('fs');
const path=require('path');
module.exports.profile=function(req,res)
{
    User.findById(req.params.id,function(err,user){

        return res.render('user_profile',{
                title:'User Profile',
                profile_user:user
            });
    })
    // if(req.cookies.user_id)
    // {
    //     User.findById(req.cookies.user_id,function(err,user){
    //         if(user)
    //         {
    //              return res.render('user_profile',{
    //             title:'User Profile',
    //                  user:user
    //         })
    //
    //         }
    //          return res.render('user_profile');
    //     })
    //
    // }
    // else{
    //     return res.redirect('/users/sign-in');
    // }


}
module.exports.update=async function(req,res)
{
    if(req.user.id==req.params.id)
    {
        try{
            let user=await  User.findById(req.params.id);
            
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log("ERROR",err);}
                console.log(req.file);
                user.name=req.body.name;
                user.email=req.body.email;

                if(req.file)
                {
                    //this just syncs with the directory of the current present file and just changes with the new one
                     let files = fs.readdirSync(path.join(__dirname));
                    if (files.includes(req.file.originalname)) {
                        console.log("UnlinkSync");
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    //this is saving the path of the uploaded file into the avatar field in the user model
                   user.avatar=User.avatarPath+'/'+req.file.filename
                   

                }

                user.save();
                req.flash('success', 'Updated!');
                return res.redirect('back');


            });

        }catch(err)
        {
            req.flash('error',err);
              console.log("err", err);
                return;
        }

    }else
    {
        req.flash('error','Unauthorized');
          return res.status(401).send('Unauthorized')///200 for success 500 internet server error
    }
    // if(req.user.id==req.params.id)
    // {
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         return res.redirect('back');
    //     })
    //
    // }
    // else
    // {
    //     return res.status(401).send('Unauthorized')///200 for success 500 internet server error
    // }
}
//Render Sign Up page
module.exports.signUp=function(req,res){
     if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('user_signup',{
        title:'Codeial | Sign Up'
    })
}
//Render Sign In page
module.exports.signIn=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('user_signin',{

        title:'Codeial | Sign In'
    })
}
//get the sign up data
module.exports.create=function(req,res)
{


    if(req.body.password!=req.body.confirm_password)
    {
         req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('error in finding the user in signing up ');return }
        if(!user)
        {
            User.create(req.body,function(err,user){
                if(err){console.log('Error up while signing up the user');return}
                return res.redirect('/users/sign-in');
            })
        }
        else{
              req.flash('success', 'You have signed up, login to continue!');
              console.log("SIgned in");
            return res.redirect('back');
        }

    });
}
//check with sign in
module.exports.createSession=function(req,res){

            req.flash('success','Logged In successfully');
          return res.redirect('back');
    //Setps to authenticate

//Manual Authentication----
    //find the user
    // User.findOne({email:req.body.email},function(err,user){
    //       req.flash('success','Logged In successfully');
    //     if(err){console.log("error in finding user in signing  in ");return}
    //     //handle the user
    //     if(user)
    //     {
    //
    //          //handle password which doesn't match
    //         if(user.password!=req.body.password)
    //         {
    //
    //             return res.redirect('back');
    //         }
    //         //handle session creation
    //
    //         res.cookie('user_id',user.id);
    //
    //         return res.redirect('/users/profile');
    //
    //     }else{
    //         //handle user not found
    //         return res.redirect('back');
    //
    //     }
    //
    // })
    //handle the user



    //handle session creation

    //handle user not found

}
//log out
module.exports.destroySession=function(req,res)
{

    // req.logout();
    // req.flash('success','You have Logged Out');
    // return res.redirect('/');
    req.logout(function(err) {
    if (err) { return next(err); }
     req.flash('success','You have Logged Out');
    res.redirect('/');
  });
}
// module.exports.signOut=function(req,res){
//     res.cookie('user_id','',{maxAge:1});
//     //res.clearCookie('user_id');
//     return res.redirect('/');
//
// }
module.exports.createSession=function(req,res){
    req.flash('success','You have Logged In');
    return res.redirect('/');
}
