process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var express = require('express');
var server = require('http').createServer(app);
var app = express();
var port = 3000;

server.listen(process.env.PORT || port);
var phantom = require('phantom');

    phantom.create().then(function(ph) {
      ph.createPage().then(function(page) {
        page.injectJs('./jQuery.min.js', function() {
          page.property('content').then(function(content) {
            console.log(content);
            page.close();
            ph.exit();
          });
        });
      });
    });
