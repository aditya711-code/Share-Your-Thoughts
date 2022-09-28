const express=require('express');
const router=express.Router();
const postsController=require('../controllers/post_controller');
const passport=require('passport');
console.log('Posts route is loaded');
router.post('/create',passport.checkAuthentication,postsController.create);
router.get('/destroy/:id',passport.checkAuthentication,postsController.destroy);
module.exports=router;