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
var jsdom = require("node-jsdom");
var request = require('request');

var connection = new autobahn.Connection({
    url: wsuri,
    realm: "realm1"
});

var connection1 = new autobahn.Connection({
    url: wscoincap,
    realm: "realm1"
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});
app.post('/tradeOB',function(req,res,next) {
    var currencyPair = req.body.currencyPair;
    var url = "https://poloniex.com/public?command=returnOrderBook&currencyPair="+currencyPair+"&depth=15"
    var body = '';
    https.get(url, function(response){
        response.on('data', function(chunk){
            body += chunk;
        });

        response.on('end', function(){
            console.log("Got a response: ", body);
            res.json(body);
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
          res.json(e);
    });
});

app.post('/tradeRemi', function (req, res) {
    //Tell the request that we want to fetch youtube.com, send the results to a callback function
    request({
        uri: 'https://eth.remitano.com/vn'
    }, function (err, response, body) {
        var self = this;
        self.items = new Array(); //I feel like I want to save my results in an array
        
		  //Just a basic error check
        if (err && response.statusCode !== 200) {
            console.log('Request error.');
        }
        
		  //Send the body param as the HTML code we will parse in jsdom
        //also tell jsdom to attach jQuery in the scripts
        jsdom.env({
            html: body,
            scripts: ['http://code.jquery.com/jquery-1.6.min.js']
        }, function (err, window) {
            //Use jQuery just as in any regular HTML page
            var $ = window.jQuery,
                $body = $('body'),
                $videos = $body.find('.sell-offer');
            console.log($body);
				//I know .video-entry elements contain the regular sized thumbnails
            //for each one of the .video-entry elements found
            $videos.each(function (i, item) {
               
					 //I will use regular jQuery selectors
                var $a = $(item).children('a'),
                   
						  //first anchor element which is children of our .video-entry item
                    $title = $(item).find('span').text();
                    
					
               
					 //and add all that data to my items array
                self.items[i] = {                    
                    title: $title.trim(),                   
                    
                };
            });
            
				//let's see what we've got
            console.log(self.items);
            res.end('Done');
        });
    });
});

var port = 3000;

server.listen(process.env.PORT || port);

io.on('connection', function (client) {
    console.log('Client connected...');

    client.on('join', function (data) {
        console.log(data);

    });
    
    client.on('sendMessages', function (data) {
        io.emit('broadcastMessages', data);
    });
    client.on('tradeCoin',function(data){
        io.emit('BTC_XMR',data);
    });
});


 connection.onopen = function (session) {
        console.log("Websocket connection open");
         function marketEvent(args, kwargs) {
             //client.emit('messages', args);
             io.emit('tradeCoin', args);
        }
        function tickerEvent(args, kwargs) {
            // client.emit('messages', args);
            io.emit('messages', args);
         }
//         function trollboxEvent(args, kwargs) {
//             // client.emit('messages', args);
//             io.emit('messages', args);
//         }
        session.subscribe('BTC_XMR', marketEvent);
        session.subscribe('ticker', tickerEvent);
        //session.subscribe('trollbox', trollboxEvent);
    }

    connection.onclose = function (a,b) {
        console.log(b);
        console.log("Websocket connection closed");
    }


    connection.open();
	
connection1.onopen = function (session) {
	console.log("Websocket connection1 open");
	function globalEvent(args, kwargs){
		 console.log(args);
	}
	session.subscribe('global', globalEvent);
};

 connection1.open();
 connection1.onclose = function (a,b) {
        console.log(b);
        console.log("Websocket1 connection closed");
    }
//bittrex
bittrex.websockets.listen( function( data ) {
  if (data.M === 'updateSummaryState') {
    data.A.forEach(function(data_for) {
      data_for.Deltas.forEach(function(marketsDelta) {
        io.emit('bittrexMessages', marketsDelta);
        // console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
      });
    });
  }
});

bittrex.websockets.subscribe(['BTC-ETH','BTC-SC','BTC-ZEN'], function(data) {
  if (data.M === 'updateExchangeState') {
    data.A.forEach(function(data_for) {
      // console.log('Market Update for '+ data_for.MarketName, data_for);
    });
  }
});
