process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var express = require('express');
var server = require('http').createServer(app);
var bodyParser = require("body-parser");
var app = express();
var port = 3000;

server.listen(process.env.PORT || port);
var phantom = require('phantom');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname));


var Crawler = require("crawler");

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        //done();
    }
});
c.queue('https://eth.remitano.com/vn');
app.get('/', function (req, res, next) {
    
    res.sendFile(__dirname + '/index.html');
});
    
