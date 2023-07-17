const puppeteer = require('puppeteer');
const $ = require('cheerio');
const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const pool = mysql.createPool(dbconfig);

async function bithumbCrawling(){
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    let lastId = 0;

    pool.getConnection(function(err,conn) {
        if (err) throw err;
        var sql = "SELECT id FROM announcement_crawling where exchange_name = 'Bithumb' order by id desc limit 1";
        
        conn.query(sql, function (err, result) {
            if (err) throw err;
            try{
                lastId = result[0].id;
            } catch(exception){
                console.log("NO DATA");
                console.log(exception);
            }
        });
        conn.release();
      });
      
    let data = [];
    let index = 0;
    while (true) {
        await page.goto('https://cafe.bithumb.com/view/boards/43?pageNumber=' + index, { waitUntil: 'load' });
        
        let pageData = await getAll(page, lastId);
        
        if(!pageData){
            console.log("break");
            break;
        }

        data = data.concat(pageData);
        index++;
      }
      
    if(data.length != 0){
        pool.getConnection(function(err,conn) {
            if (err) throw err;
            
            let values = [];
            
            for (let i = 0; i < data.length; i++) {
                values.push([data[i].no, data[i].title, data[i].date, data[i].exchange, data[i].content]);
            }
            var sql = "INSERT INTO announcement_crawling (id, announce_title, reg_date,exchange_name, announce_content) VALUES ? ON DUPLICATE KEY UPDATE reg_date=VALUES(reg_date)";
            
            conn.query(sql, [values], function (err, result) {
                if (err) throw err;
            });
            conn.release();
        });
    }
    await browser.close();
}

async function getAll(page, lastId){
    let data = [];
    const number = await page.$$eval("#dataTables > tbody > tr", (data) => data.length);
    const content = await page.content();
    const body = $.load(content);

    for(let index = 11; index < number + 1; index++){
        let one = {};
        
        body("#dataTables > tbody > tr:nth-child(" + index + ")").each(async function(key, val) {
            one.no = body(val).find("td.invisible-mobile.small-size").text();
            one.title = body(val).find("td.one-line > a").text();
            one.date = body(val).find("td:nth-child(3)").text();
            one.content = body(val).find("td.one-line > a").attr("onclick").substring(22,29);
            one.exchange = "Bithumb";
          });
        data.push(one);
    }
    
    if(data.length == 0 || data[0].no <= lastId){
        return;
    }
    await getContent(page, data);
    return Promise.resolve(data);
}

async function getContent(page, data){
    for(let index = 0; index < data.length; index++){
        await page.goto('https://cafe.bithumb.com/view/board-contents/' + data[index].content, { waitUntil: 'load' });
        const content = await page.content();
        const body = $.load(content);
        let text = body("#content > div.board-content-wrapper.row.no-gutters > div.board-content.col-12").text();
        data[index].content = text;
    }
}

module.exports.bithumb = bithumbCrawling;