const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

//settings
app.set('port', 3000);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


//Middlewares
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}));
app.use(multer({dest:path.join(__dirname,'./public/images/uploads/temp')}).single('photo'));

//connecting to DB
mongoose.connect('mongodb://JuanRM:jr071201@ds145584.mlab.com:45584/party-list')
    .then(()=>{console.log('DB connected');})
    .catch((err)=>{console.log(err)});

//importing routes
const mainRouter = require('./routes/index.js');

//Initialazing the server
app.use('/',mainRouter);

app.listen(app.get('port') || process.env.PORT, ()=>{
    console.log('Server on port',app.get('port'));
    
});