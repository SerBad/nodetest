/**
 * Created by user on 2016/10/25.
 */
//引用express
var express = require('express');

//引用express-handlebars模板引擎
var hbs = require('express-handlebars').create({
    //  defaultLayout: 'main', //默认布局模板为main.hbs
    // layoutsDir: 'views',   //默认路径是'views/layouts/'
    extname: '.hbs'         //设置文件后缀名为.hbs

});
var app = express();

app.set('port', process.env.PORT || 3000);   //设置端口

//设置模板引擎为express-handlebars
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//设置MySQL连接，
var db = require('./db')

// app.use('/comments', require('./controllers/comments'))
// app.use('/users', require('./controllers/users'))

//使用static中间件 制定public目录为静态资源目录,其中资源不会经过任何处理
app.use(express.static(__dirname + '/public'));

//index页路由
app.get('/', function (req, res) {
    res.render('index', {});
});

var multer = require('multer');
var date = require('./utils/date.js');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './downloads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().Format('yyyy-MM-dd-HH-mm-ss') + '-' + file.originalname)
    }
})

var upload = multer({storage: storage})
app.use(multer({storage: storage}).single('fields'));

app.get('/upload', function (req, res, next) {
    res.render('upload', {});
});

app.post('/upload', function (req, res) {
    // res.send('showAlert');
    var response = {};
    response.status = 200;
    response.validationFailed = true;
    response.message = 'success'
    res.end(JSON.stringify(response));
// res.redirect('/upload');
});

app.get('/map', function (req, res, next) {
    res.render('map', {});
});


db.connect(function (err) {
    if (err) {
        console.log('Unable to connect to MySQL.')
        // process.exit(1)
    } else {
        console.log('You are now connected...')
        app.listen(app.get('port'),function () {
            console.log('Listening on port ' + app.get('port') + '......')
        });
    }
})