var app = require('express')(),
  setting = require('./setting'),
  bodyParser = require("body-parser"),
  RongSDK = require('rongcloud-sdk')({
    appkey: setting.appkey,
    secret: setting.secret
  }),
  port = setting.port;

var User = RongSDK.User;

var allowCors = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

app.use(allowCors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/getToken', function (req, res) {
  let { body: { userId } } = req;
  console.info(userId)
  var user = {
    id: userId,
    name: userId,
    portrait: '  '
  };
  var token;
  User.register(user).then(function (result) {
    console.log('register result', result);
    token = result.token;
    return res.send(result);;
  })
});

app.listen(port, function () {
  console.log(`Demo Server 启动成功
AppKey: ${setting.appkey} (Web 需一致)
Server 地址: http://localhost:${port}
请将此 Server 地址填入 CallLib Demo Web 的 config.js 文件`);
});