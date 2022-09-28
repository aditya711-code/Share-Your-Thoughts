const express=require('express');
const router=express.Router();
const passport=require('passport');
const usersController=require('../controllers/users_controller');
console.log('Users route is loaded');

router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);

//Get sign up;
router.get('/sign-up',usersController.signUp);
//Get sign in;
router.get('/sign-in',usersController.signIn);

router.post('/create',usersController.create);
// router.post('/create-session',usersController.createSession);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'users/sign-in'},
),usersController.createSession)

router.get('/sign-out',usersController.destroySession);
// router.get('/sign-out',usersController.signOut);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);

module.exports=router