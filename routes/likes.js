const express=require('express');
const router=express.Router();
const likesController=require('../controllers/like_controller')
const passport=require('passport');
router.get('/toggle',likesController.toggleLike);

module.exports=router;