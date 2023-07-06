const puppeteer = require('puppeteer');

const upbit_crawler = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://upbit.com/service_center/notice');
  console.log("OK");

  const data = await page.evaluate(() => {
    const allTrElements = Array.from(document.querySelectorAll('.ty02 article tbody tr'));

    return allTrElements.map(tr => {
      return {
        content: Array.from(tr.querySelectorAll('td')).map(td => td.textContent),
        link: tr.querySelector('a')?.getAttribute('href') || ''
      };
    });
  });

  const detailedData = [];

  for (const item of data) {
    if (item.link) {
      await page.goto('https://upbit.com' + item.link);

      await page.waitForTimeout(1000);
      const notice_id = item.link.split("=")[1];
      const markdown_notice_body = await page.evaluate(() => {
        const contentElement = document.getElementById("markdown_notice_body");
        if (contentElement) {
          return contentElement.innerHTML;
        } else {
          return "";
        }
      });

      detailedData.push({
        ...item,  // ... 은 이전거 유지
        markdown_notice_body,
        notice_id
      });

      await page.goto('https://upbit.com/service_center/notice');
      await page.waitForSelector('.ty02 article tbody tr');
    }
  }

  console.log(detailedData);

  await browser.close();
  return detailedData;
};

upbit_crawler().then(result => console.log(result));

module.exports = upbit_crawler;

//  insert ignore 사용하기