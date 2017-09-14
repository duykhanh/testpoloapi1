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

var fs = require("fs");

// 3rd party modules.
var Browser = require("zombie");

getGridData("http://senchacon.com/session-schedule.php", function (data) {
    // Wrap the `data` array in an object.
    data = {"sessions": data};
    // Let's make the JSON data pretty.
    var jsonStr = JSON.stringify(data, null, "  ");
	console.log("Herrrrrrre --------------------------------------");
	console.log(jsonStr);
    // Write the JSON data to the file system.
    fs.writeFile("schedule.json", jsonStr);
});


/**
 * Extracts the speaker information from the specified page.
 *
 * @param {String} url The URL of the SenchaCon 2013 speakers page.
 * @param {Function} callback The function to call when the data is loaded and parsed.
 * @param {Object} callback.data The sessions array.
 */
function getGridData(url, callback) {
    Browser.visit(url, function (e, browser) {
        // Extract the text from the specified DOM object and strip out the specified prefix.
        var extractNode = function (obj, label) {
            var re = new RegExp("^" + label, "i");
            return browser.text(obj).replace(re, "").trim();
        };

        // Extracts the session title info from the DOM.
        var getTitle = function (obj) {
            return extractNode(obj, "Session Title:");
        };

        // Extracts the session description info from the DOM.
        var getDescription = function (obj) {
            return extractNode(obj, "Description:");
        };

        // Extracts the session speaker info from the DOM.
        var getSpeaker = function (obj) {
            return extractNode(obj, "Speaker:");
        };

        // Extracts the session room/location info from the DOM.
        var getLocation = function (obj) {
            return extractNode(obj, "Location:");
        };

        // Loop through each of the `fancybox` nodes from the DOM and get the
        // session id, title, description, speaker, and location.
        var nodes = browser.queryAll("a.fancybox").map(function (node) {
            var id = ("#" + node.href.split("#")[1]);
            var title = browser.text(node);
            var sessionDOM = browser.query(id);
            // Find all the "p" tags in the specified session DOM element.
            var pTags = browser.queryAll("p", sessionDOM);
            var description = getDescription(pTags[1]);
            var speaker = "";
            var location = "";

            switch (pTags.length) {
                case 3:
                    speaker = getSpeaker(pTags[2]);
                    break;
                case 4:
                    speaker = getSpeaker(pTags[2]);
                    location = getLocation(pTags[3]);
                    break;
            }

            return {
                "id": id,
                "title": title,
                "description": description,
                "speaker": speaker,
                "location": location
            };
        });

        callback(nodes);
    });
}


 
