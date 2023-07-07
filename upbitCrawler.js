const puppeteer = require('puppeteer');
const db = require("./upbitDB");

const upbitInsertQuery = "INSERT IGNORE INTO announcement_crawling (id,exchange_name,announce_title,announce_content,reg_date) VALUES(?,?,?,?,?)";
const upbitSelectRecentId = "Select id from announcement_crawling where exchange_name='Upbit' order by id desc limit 1";

const upbitCrawler = async () => {
    const conn = await db.createConnection();
    const browser = await puppeteer.launch({  
        headless: "true", 
        args: ['--ignore-certificate-errors', '--allow-insecure-localhost']  });
    const page = await browser.newPage();
    let currentPage = 1;
    let totalCount = 0;
    do {
        await page.goto(`https://api-manager.upbit.com/api/v1/notices?page=${currentPage}&per_page=20&thread_name=general`, {waitUntil: 'networkidle2'});
        console.log(`OK, page: ${currentPage}`);

        const contents = await page.$eval('body', data => data.textContent);
        const jsonObj = JSON.parse(contents);

        if (currentPage === 1) {
            totalCount = jsonObj.data.total_count;
            console.log('Total Pages:', jsonObj.data.total_pages);
        }

        const dataList = jsonObj.data.list;
        // order by id 제일 높은거부터 조회해서 거기 까지만 추가
        const recentNotiId = await db.selectUpbitRecentNotiId(conn, upbitSelectRecentId);
        
        var isLatest = false;
        for (const item of dataList){
          if(item.id > recentNotiId.id){
            console.log("item :",item);
            await page.goto(`https://upbit.com/service_center/notice?id=${item.id}`, { waitUntil: 'networkidle2' });
            await page.waitForTimeout(1000);
            const notice_content = await page.$eval('#markdown_notice_body', (data) => data.textContent);
            const id = item.id;
            const title = item.title;
            const exchange = "Upbit";
            const noti_content = notice_content;
            const reg_dttm = item.created_at;
            var dbParam = [id,exchange,title,noti_content,reg_dttm];
            console.log("db : ",dbParam);
            db.insertUpbitData(conn,dbParam,upbitInsertQuery);
          }else{
            console.log("최신화 완료");
            isLatest = true;
            break;
          }
        };
        
        if(isLatest) break;
        currentPage++;
    } while (currentPage <= totalCount);
    conn.end();
    await browser.close();
    console.log("END");
};

module.exports = upbitCrawler;
