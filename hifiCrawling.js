const puppeteer = require('puppeteer');
const $ = require('cheerio');
const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const pool = mysql.createPool(dbconfig);

async function hifiCrawling(){
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    
    await page.goto('https://blog.hifi.finance/', { waitUntil: 'load' });
    
    let data = await getAll(page);

    await browser.close();
}

async function getAll(page){
    let data = [];
    
    let scrollCount = 0;
    
    const content = await page.content();
    const body = $.load(content);

    let count = 0;
    body("#container > div:nth-child(2) > div > div.u-marginBottom40.js-collectionStream > div").each(async function(key, val) {
      if(key == 0){
        body(val).find("section > div").each(async function(key, val){
            body(val).children("div").each(async function(key, val){
              let one = {};
              one.title = body(val).find("div.col.u-xs-marginBottom10.u-paddingLeft0.u-paddingRight0.u-paddingTop15.u-marginBottom30 > a > h3 > div").text();
              one.writer = body(val).find("div.col.u-xs-marginBottom10.u-paddingLeft0.u-paddingRight0.u-paddingTop15.u-marginBottom30 > div > div > div.postMetaInline.postMetaInline-authorLockup.ui-captionStrong.u-flex1.u-noWrapWithEllipsis > a").text();
              one.content = body(val).find("div.col.u-xs-marginBottom10.u-paddingLeft0.u-paddingRight0.u-paddingTop15.u-marginBottom30 > a").attr("href");
              data.push(one);
            })
        })
      }else{
        body(val).find("div > div > div.u-size8of12.u-xs-size12of12 > div").each(async function(key, val){
          let one = {};
          one.title = body(val).find("a:nth-child(2) > h3 > div").text();
          one.writer = body(val).find("div > div > div.postMetaInline.postMetaInline-authorLockup.ui-captionStrong.u-flex1.u-noWrapWithEllipsis > a").text();
          one.content = body(val).find("a:nth-child(2)").attr("href");
          data.push(one);
        })
      }
    });

    for(idx in data){
      await page.goto(data[idx].content);
      await page.waitForSelector("section div div:nth-of-type(2) div div");
      data[idx].content = await page.$eval("section div div:nth-of-type(2) div div", (data) => data.textContent);
      await page.goBack();
    }
    
    return Promise.resolve(data);
}

async function scrolling(page){
    let lastHeight = await page.evaluate("document.body.scrollHeight");

    while (true) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForTimeout(2000); // sleep a bit
      let newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight === lastHeight) {
        break;
      }
      lastHeight = newHeight;
    }
}

module.exports.hifi = hifiCrawling;