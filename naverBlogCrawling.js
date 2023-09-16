const puppeteer = require('puppeteer');
const $ = require('cheerio');
const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const pool = mysql.createPool(dbconfig);

async function naverBlogCrawling(){
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    
    await page.goto('https://section.blog.naver.com/ThemePost.naver?directoryNo=8&activeDirectorySeq=0&currentPage=1', { waitUntil: 'load' });
    
    let data = await getAll(page);

    await browser.close();
}

async function getAll(page){
    let data = [];
    
    let scrollCount = 0;
    
    const content = await page.content();
    const body = $.load(content);

    let count = 0;
    body("#content > section > div:nth-child(2) > div").each(async function(key, val) {
      let one = {};
      one.title = body(val).find("div > div.info_post > div.desc > a.desc_inner > strong").text();
      //one.writer = body(val).find("div > footer > div > span.post-card-byline-author > a").text();
      data.push(one);
      count++;
    });
    console.log(data);
    console.log(count);
    // for(idx in data){
    //   await page.goto(data[idx].content);
    //   await page.waitForSelector("section div div:nth-of-type(2) div div");
    //   data[idx].content = await page.$eval("section div div:nth-of-type(2) div div", (data) => data.textContent);
    //   await page.goBack();
    // }
    
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

module.exports.naver = naverBlogCrawling;