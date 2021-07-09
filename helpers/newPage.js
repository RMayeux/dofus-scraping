import randomUseragent from 'random-useragent';

export const newPage = async (browser,url) => {
  
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
        request.abort();
    } else {
        request.continue();
    }
  });
  const userAgent = randomUseragent.getRandom();

  await page.setUserAgent(userAgent);

  await page.goto(`${url}`,{
    waitUntil:'domcontentloaded',
    timeout: 0
  });

  return page;
}