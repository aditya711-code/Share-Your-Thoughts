const express=require('express');
const router=express.Router();
const postsController=require('../controllers/post_controller');
console.log('Posts route is loaded');
router.get('/feed',postsController.post);
module.exports=router;