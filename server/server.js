var express = require("express");
var app= express();
const upbitCrawler = require("../upbitCrawler");
const bithumb = require("../bithumbCrawling")

app.get("/",function(req,res){
    res.send("Hello Home");
});
app.get('/upbit_crawler', async (req, res) => {
    const crawling = await upbitCrawler();
    res.send(crawling);
});

app.get('/bithumb', (req, res) => {
    bithumb.bithumb();
    res.send('bithumb');
  });

var server = app.listen(8081,function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s",host,port);
});