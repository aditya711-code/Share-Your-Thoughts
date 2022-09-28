const nodeMailer=require('../config/nodemailer');

//this is another way of exporting a method
exports.newComment=(comment)=>{
    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
        console.log("inside newComment mailer",comment);
        nodeMailer.transporter.sendMail({
                form:"adityamane711@gmail.com",
                to:comment.user.email,
                subject:"New Comment published",
                html:htmlString
        },(err,info)=>{
            if(err)
            {
                console.log("error in sending the mail",err);
                return;
            }
            //console.log("Message sent or mail delivered",info);
            return;

    });
}