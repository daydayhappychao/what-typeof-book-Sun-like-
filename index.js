var path = require('path')
var fs = require('fs')
var http = require('http')
var request = require('request')
var iconv = require('iconv-lite')
var rd = require('rd')
var mongoose = require('mongoose'),
    DB_URL = 'mongodb://localhost:27017/sentence';


// mongoose.connect(DB_URL);

// mongoose.connection.on('connected', function () {
//     console.log('Mongoose connection open to ' + DB_URL);
// });
// /**
//  * 连接异常
//  */
// mongoose.connection.on('error', function (err) {
//     console.log('Mongoose connection error: ' + err);
// });

// /**
//  * 连接断开
//  */
// mongoose.connection.on('disconnected', function () {
//     console.log('Mongoose connection disconnected');
// });


var appKey = `z1R3l4E8U20nol9i4YdeapPFlXVGfzkWjRrBCS0f`
var url = `http://api.ltp-cloud.com/analysis/`


// request.post(url, {
//     api_key: appKey,
//     text: `外面下着雨，立秋后的第一场雨。风吹来有丝凉意，秋天真的来了。 `,
//     pattern: `pos`,
//     format:`json`

// },function(err,res,body){
//     console.log('==============start==================')
//     console.log(err)
//     console.log(res)
//     console.log(body)
// })



var bookRoot = path.join(__dirname, 'booksSun')


var limit = 2 //同时发起请求数量
var currentReq = 0 //请求计数器
function setRequest(text) {
    if (currentReq < limit) {
        console.log(text)
        console.log(encodeURI(text))
        console.log(currentReq)
        currentReq++
        request(`http://api.ltp-cloud.com/analysis/?api_key=z1R3l4E8U20nol9i4YdeapPFlXVGfzkWjRrBCS0f&text=作者:顾吉珏&pattern=pos&format=json`, function (err, res, body) {
            currentReq--
            console.log(12222)
            console.log(JSON.parse(body))
        })
    } else {
        setTimeout(setRequest.bind(null, text), 200)
    }
}
// 异步列出目录下的所有文件
rd.read(bookRoot, function (err, files) {
    if (err) throw err;

    files.map(v => {
        if (v[0] !== '.') {
            var content = fs.readFile(v, function (err, data) {
                if (typeof data !== 'undefined') {
                    // console.log(typeof data)
                    var _data = iconv.decode(data, 'GBK')
                    var sentence = _data.split('\n')
                    sentence.map(v => {
                        if (v.trim() && (!v.trim().includes('www')))
                            setRequest(v)
                    })
                }
            })
        }
    })
    // files是一个数组，里面是目录/tmp目录下的所有文件（包括子目录）
});

// console.log(files)


// var text = `外面下着雨，立秋后的第一场雨。风吹来有丝凉意，秋天真的来了。 `

// request(`http://api.ltp-cloud.com/analysis/?api_key=z1R3l4E8U20nol9i4YdeapPFlXVGfzkWjRrBCS0f&text=${encodeURI(text)}&pattern=pos&format=json`,function(err,res,body){

//     console.log(JSON.parse(body))
// })