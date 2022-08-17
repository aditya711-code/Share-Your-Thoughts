const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.createComment=function(req,res)
{
    Comment.create({
        content:req.body.content,
        user:req.user._id,
        post:req.post._id

    },
    function(err,posts){
          if(err)
        {
            console.log("Error in creating the post");
            return;
        }
        return res.redirect('back');
    })
}