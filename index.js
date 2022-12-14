const express=require('express');
const app=express();
const port=8000;
const cookieParser=require('cookie-parser');
const expressLayout=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2');
const MongoStore=require('connect-mongo');
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');
const chatServer=require('http').Server(app);
const chatScokets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("ChatServer is listening on port 5000");
app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle: 'extended',
     prefix:  '/css'

}));
app.use(express.urlencoded());
app.use(cookieParser());





//static file
app.use(express.static('./assets'));
//use express routers

//make the uploads path available to the broweser
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(expressLayout);
//extract styles and scripts to the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//set up the engine
app.set('view engine','ejs');
app.set('views','./views');
//mongo store is used to store the session cookie in the db
app.use(session({
    name:'codeial',
    //to do change the secret before deployment in production mode
    secret:'blah something',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:MongoStore.create(
        {
            mongoUrl:'mongodb://localhost:27017/codedial_development',
            mongooseConnection:db,
            autoRemove:'disabled'

        },
        function(err)
        {
            console.log(err||'connect-mongoDb set up ok');
        }
    )
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use('/',require('./routes'));
app.listen(port,function(err){
    if(err)
    {
    
        console.log(`Error: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});