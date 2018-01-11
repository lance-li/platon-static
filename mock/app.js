var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')

var app = express()

// 参考文档: https://codeforgeek.com/2014/09/handle-get-post-request-express-4/
// 可以解析 request payload, 即 res.body
app.use(bodyParser.json())

app.get('/test', function (req, res) {
  res.status(200).json({
    'msg': 'ok'
  })
})

app.use('/assets/', express.static(path.join(__dirname, '../assets')))
app.use('/js/', express.static(path.join(__dirname, '../js')))

// API
app.use(require('./common/router'))
app.use(require('./plan/router'))
app.use(require('./problem/router'))
app.use(require('./practice/router'))
app.use(require('./message/router'))
app.use(require('./customer/router'))
app.use(require('./forum/router'))
app.use(require('./operation/router'))
app.use(require('./bible/router'))
app.use(require('./schedule/router'))
app.use(require('./temp/router'))

module.exports = app
