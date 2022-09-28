const mongoose=require('mongoose');
const friendshipSchema=new mongoose.Schema({
    //the user who sents this request
    from_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

},{
    timestamps:true

});
const Friendship=mongoose.model('friendship',friendshipSchema);
module.exports=Friendship;