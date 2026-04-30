var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var orgRouter = require('./routes/org');
var adminRouter = require('./routes/admin');
var managerRouter = require('./routes/manager');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const jwtKAY = "mingming";
app.use(expressJWT({ secret: jwtKAY, algorithms: ['HS256'] }).unless({
    path: [
      /^\/users\//,
      /^\/public\//, // 添加需要开放的路径正则表达式
      /^\/utils\//,
      /^\/specials\//,
      /^\/javascripts\//,
      /^\/stylesheets\//,
      /^\/assets\//,
      /^\/app\//,

      /^\/\// //
    ]
  }));

app.use((req, res, next) => {
    req.jwt = jwt;
    req.jwtKAY = jwtKAY;
    req.expiresIn = '10h';
    next();
});

app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        return res.send({
            status,
            err: err.message instanceof Error ? err.message : err
        });
    };
    next();
});

//Error level intermediate key
app.use((err, req, res, next) => {
    if (err.message === 'No authorization token was found') {
        return res.send({
            status: 0,
            code: '500',
            message: 'Authentication failed! Please carry a token in the request header'

        });
    }
    if (err.message === 'jwt expired') {
        res.send({
            status: 0,
            code: '500',
            message: 'Token has expired, please log in again'

        });
    }
    res.send({
        status: 0,
        code: '500',
        message: err.message

    });
});

//Define upload
const multer = require("multer");
const storage = multer.diskStorage({
   //Save Path
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads');
       //Please note that the file path here is not the 'opposite path', just 'fill in' and start writing the root path
    },
    //File name saved in destination
    filename: function (req, file, cb) {
        let obj = ['.png', '.PNG', '.jpg', '.JPG', '.gif', '.GIF', '.jpeg', '.JPEG', '.webp', '.WEBP'];
        let hou = path.extname(file.originalname);

        cb(null, file.fieldname + '-' + Date.now() + '' + hou);
    }
});

const upload = multer({ storage: storage });
app.post('/upload', upload.single('file'), function (req, res, next) {
    //Req.file is the information of the 'file' file
    // Req. body will have text 'field data', 'if stored' in
    if (!req.file) return res.cc("Upload failed");
    res.send({
        status: '1',
        file: {
            name: req.file.originalname,
            url: '/assets/images/upload/' + req.file.filename,
            size: req.file.size,
            // userinfo: req.user
        },
        code:200
    });
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/org', orgRouter);
app.use('/admin', adminRouter);
app.use('/manager', managerRouter);
module.exports = app;
