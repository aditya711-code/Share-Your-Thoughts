const Comment = require('../models/comments');
const Post = require('../models/post');
const Like=require('../models/like');
const commentsMailer=require('../mailers/comments_mailer');
const commentEmailWorker=require('../worker/comment_email_worker');
const queue=require('../config/kue');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post

            });

            post.comments.push(comment);
            post.save();
            comment=await comment.populate('user','name email');
            // commentsMailer.newComment(comment);
            let job=queue.create('emails',comment).save(function(err)
            {
                if(err)
                {
                    console.log("Error in creating a queue",err);
                    return;
                }
                console.log("job enqued",job.id);
            });
            if(req.xhr)
            {
                // comment=await comment.populate('user','name email').exec();
                return res.status(200).json({
                    data:{
                        comment: comment
                    },
                    message:"Comment deleted successfully"
                })
            }
            req.flash('success', 'Comment published!');
            return res.redirect('/');


        }
    } catch (err) {
        console.log("Error", err);
        return;
    }


}
module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            let post_id = comment.post;

            comment.remove();
            let post =  Post.findByIdAndUpdate(post_id, {$pull: {comments: req.params.id}});
            await Like.deleteMany({likeable:comment._id,onModel:'Comment'});
           if(req.xhr)
           {
               return res.status(200).json({
                   data:{
                       comment_id:req.params.id
                   },
                   message:"Post deleted"
               });
           }
           req.flash('success','Comment deleted!');
           return res.redirect('back');
        } else
            return res.redirect('back');
    }catch(err)
    {
        req.flash('error',err);
        return;
    }
}