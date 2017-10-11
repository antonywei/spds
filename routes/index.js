var express = require('express');
var router = express.Router();
var usr = require('db/dbConnect');
var data = require('db/dataConnect');
//var app = express();
/* GET home page. */

router.get('/', function(req, res) {
    if (req.cookies.islogin) {
        req.session.islogin = req.cookies.islogin;
    }
    if (req.session.islogin) {
        res.locals.islogin = req.session.islogin;
    }
    res.render('index', {
        title: 'HOME',
        test: res.locals.islogin
    });
});

router.route('/login')
    .get(function(req, res) {

        if (req.session.islogin) {
            res.locals.islogin = req.session.islogin;
        }

        if (req.cookies.islogin) {
            req.session.islogin = req.cookies.islogin;
        }
        res.render('login', {
            title: '登录',
            test: res.locals.islogin
        });
    })
    .post(function(req, res) {
        var data = req.body;
        console.log(data);
        /*
        var md5 = crypto.createHash('md5');
        password = md5.update(data.password).digest('hex');
        client = usr.connect();
        result = null;
        */
        client = usr.connect();
        console.log("second" + JSON.stringify(data));
        usr.selectFun(client, "" + data.username, function(result) {

            if (result[0] === undefined) {
                res.send({
                    "code": 1
                });
            } else {
                if (result[0].password === data.password) {
                    req.session.islogin = data.username;
                    res.locals.islogin = req.session.islogin;
                    res.cookie('islogin', res.locals.islogin, {
                        maxAge: 60000
                    });
                    res.send({
                        "code": 0
                    });
                } else {
                    res.send({
                        "code": 2
                    });
                }
            }
        });
    });

router.get('/logout', function(req, res) {
    res.clearCookie('islogin');
    req.session.destroy();
    res.redirect('/');
});

router.route('/maphome')
    .get(function(req, res) {
        /*
        if (req.session.islogin) {
            res.locals.islogin = req.session.islogin;
        }
        if (req.cookies.islogin) {
            req.session.islogin = req.cookies.islogin;
        }
        */
        if (!req.session.islogin) { //到达/home路径首先判断是否已经登录
            req.session.error = "请先登录";
            res.redirect("/login"); //未登录则重定向到 /login 路径
        }
        
        res.render('maphome', {
            title: '积水点地图',
        });

    })
    .post(function(req, res) {
        //connect to mysql
        if (req.xhr || req.accepts('json,html') === 'json') {
            var devices = req.body;
            //console.log(devices.devices_id);
            var devices_id = "" + devices.devices_id;
            console.log(typeof(devices_id));
            console.log(devices_id);
            client = data.connectDatadb();
            //select data from mysql
            data.selectdata(client, devices_id, function(result) {

                console.log(result[0]);
                //var depth = JSON.stringify(result[0]);
                console.log(result[0].current_value);
                var current_value = {"value":result[0].current_value};
                console.log(current_value);
                //index1 = depth.indexOf("{");
                //index2 = depth.indexOf("}");
                //depth = depth.substring(index1, index2 + 1);
                //console.log("!!!"+depth);
                res.send(current_value);
            });
        }
    });

router.route('/echart')
    .get(function(req, res) {
        /*
        if (req.session.islogin) {
            res.locals.islogin = req.session.islogin;
        }
        if (req.cookies.islogin) {
            req.session.islogin = req.cookies.islogin;
        }
        */
        if (!req.session.islogin) { //到达/home路径首先判断是否已经登录
            req.session.error = "请先登录";
            res.redirect("/login"); //未登录则重定向到 /login 路径
        }

        res.render('echart', {
            title: 'historyData'
        });
    });


router.route('/register')
    .get(function(req, res) {
        res.render('register', {
            title: '注册'
        });
    })
    .post(function(req, res) {
        if (req.xhr || req.accepts('json,html') === 'json') {
            var data = req.body;
            console.log(data.username);
            console.log(typeof(data.username));
            client = usr.connect();
            usr.selectFun(client, "" + data.username, function(result) {
                console.log('the result is ' + result);
                if (result[0] === undefined) {
                    usr.insertFun(client, "" + data.username, "" + data.password, "" + data.contact, function(err) {
                        if (err) {
                            res.send({
                                "code": 1
                            });
                            console.log('[INSERT ERROR] - ', err.message);
                            //return;
                        } else {
                            console.log(data);
                            res.send({
                                "code": 0
                            });
                        }
                        //res.redirect('/login');
                    });
                } else {
                    res.send({
                        "code": 2
                    });
                    //} else {
                    //    res.send("unsuccessful");
                }
            });
        }
    });
module.exports = router;