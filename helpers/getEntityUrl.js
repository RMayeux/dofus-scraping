import { newPage } from "./newPage.js";

export async function getEntityUrl(index,url,browser) {
  const page = await newPage(browser,`${url}&page=${index}`);

  const title = await page.evaluate(() => Array.from(document.querySelectorAll("span.ak-linker > a"), element => element.href));
  await page.close()
  return [...new Set(title)];
}
