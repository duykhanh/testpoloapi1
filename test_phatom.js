// app.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bittrex = require('node.bittrex.api');
var autobahn = require('autobahn');
var wsuri = "wss://api.poloniex.com";
var bodyParser = require("body-parser");
var wscoincap='wss://coincap.io/socket.io';
var request = require('request');


var connection = new autobahn.Connection({
    url: wsuri,
    realm: "realm1"
});



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});


/*app.post('/tradeRemi', function (req, res) {
	
 
	
	
	
	phantom.create(function (ph) {
	  ph.createPage(function (page) {
		var url = "https://eth.remitano.com/vn";
		page.open(url, function() {
		  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
			 setTimeout(function() {
				page.evaluate(function() {
					console.log("khanhnguyen");
					console.log($('.main-container'));			  
				}, function(){
				  ph.exit()
				}); 
			 },5000)  
			
		  });
		});
	  });
	});
   	res.json("done");
});*/

var port = 3000;

server.listen(process.env.PORT || port);



