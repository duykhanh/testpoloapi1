var webdriver = require('selenium-webdriver');
var express = require('express');
var afterLoad = require("after-load");

var http = require('http');
var https = require('https');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname));

var port = process.env.PORT || 14000;
var By = webdriver.By;

app.post('/tradeRemi', function (req, res) {
    afterLoad('https://remitano.com/vn',function(html){
        var posLast = html.lastIndexOf("VND");        
        var subString = html.substring( posLast-200,posLast+5);
        var posFirst=subString.indexOf("vn");
        var priceRemi="{"+subString.substring(posFirst-1,subString.lengh)+"}";
        console.log(priceRemi);
        subString="{"+priceRemi+"}";
        
         res.json(priceRemi);
    });
   
    /*var driver = new webdriver.Builder()
        .forBrowser('phantomjs')
        .build();
    driver.get('http://www.google.com/ncr');
    driver.findElement(By.name('q')).sendKeys('webdriver');
    driver.findElement(By.name('btnG')).click();
    driver.wait(function() {
        return driver.getTitle().then(function(title) {
            console.log(title);
            return title === 'webdriver - Google Search';
        });
    }, 5000).then(function() {
        res.status(200).send('Done');
    }, function(error) {
        res.status(200).send(error);
    });
    driver.quit();*/
});

app.listen(port, function () {
    console.log('Example app listening on port: ',port)
})

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

//interval timer 
function getPriceRemi() {
  afterLoad('https://remitano.com/vn',function(html){
        var posLast = html.lastIndexOf("VND");        
        var subString = html.substring( posLast-200,posLast+5);
        var posFirst=subString.indexOf("vn");
        var priceRemi="{"+subString.substring(posFirst-1,subString.lengh)+"}";
        console.log(priceRemi);
        subString="{"+priceRemi+"}";
        io.emit('remiMessages', priceRemi);
         
    });
}

setInterval(intervalFunc, 5000);




