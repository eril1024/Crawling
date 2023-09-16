var express = require("express");
var app = express();
const cron = require("node-cron");
const upbitCrawler = require("../upbitCrawler");
const bithumbCrawler = require("../bithumbCrawling");
const hifiCrawler = require("../hifiCrawling");
const zilliqaCrawler = require("../zilliqaCrawling");
const naverBlogCrawler = require("../naverBlogCrawling");

app.get('/crawler/upbit', async (req, res) => {
    const crawling = await upbitCrawler();
    res.send(crawling);
});

app.get('/crawler/bitumb', (req, res) => {
    bithumbCrawler.bithumb();
    res.send('bithumb');
  });

app.get('/crawler/hifi', (req, res) => {
    hifiCrawler.hifi();
    res.send('hifi');
  });

app.get('/crawler/zilliqa', (req, res) =>{
    zilliqaCrawler.zilliqa();
    res.send('zilliqa');
})

app.get('/crawler/naver', (req, res) => {
    naverBlogCrawler.naver();
    res.send("naver");
})

cron.schedule("10 * * * * *",async function(req, res){
    console.log("cron실행");
    const crawling = await upbitCrawler();
    res.send(crawling);
    console.log("cron끝");
});

var server = app.listen(8081,function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s",host,port);
});