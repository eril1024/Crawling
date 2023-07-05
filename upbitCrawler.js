const puppeteer = require('puppeteer');

const upbit_crawler = async ()  =>{
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.goto('https://upbit.com/service_center/notice');
  console.log("OK");
  const data = await page.evaluate(() => {
      const allTrElements = Array.from(document.querySelectorAll('.ty02 article tbody tr'));
      const extractedData = allTrElements.map(tr => {
        return {
          content: Array.from(tr.querySelectorAll('td')).map(td => td.textContent)
        };
      });
      return extractedData;
        // body: document.querySelector('.ty02 article tbody .top').innerText
      
  });
   await browser.close();
   return data;
 
}

module.exports = upbit_crawler;