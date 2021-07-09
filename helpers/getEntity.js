import { getRecipe } from "./getRecipe.js";
import { newPage } from "./newPage.js";
import { getType } from "./getItemProps.js";
import * as uuid from 'uuid'
import {download} from './getImages.js';
export const getEntity = async (url,browser,category) => {
  let servers = ["Ombre","Thanatena","Atcham","Rubilax","Crocabulia","Furye","Echo","Brumen","Jahash","Nidas","Pandore","Julith","Mériana","Agride","Merkator","Ush","Ilyzaelle","Oto Mustam"];
  const page = await newPage(browser,url);
  const typeSelector = getType(category);
  const type = await page.evaluate((typeSelector) => Array.from(document.querySelectorAll(typeSelector), element => element.innerText),typeSelector);
  const name = await page.evaluate(() => Array.from(document.querySelectorAll("html.no-touchevents body.fr.ak-widgetcreated div.ak-mobile-menu-scroller div.container.ak-main-container div.ak-main-content div.ak-main-page div.row main.main.col-md-9 div.ak-container.ak-main-center div.ak-container.ak-panel-stack.ak-glue div.ak-title-container.ak-backlink h1.ak-return-link"), element => element.innerText));
  const img = await page.evaluate(() => Array.from(document.querySelectorAll("  body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div:nth-child(3) > div > div > div.col-sm-3 > div > img"), element => element.src));
  const id =  url.substring(
    url.lastIndexOf("/") + 1, 
    url.indexOf("-")
  );
  const price = {}
  for (const server of servers) {
    price[server] = 0;
  }
  const recipe = await getRecipe(page);
  if (img[0]) {
    await download(img[0],`./images/${category}/${id}.png`)
  }

  await page.close();
  return {
    id,
    name:name[0],
    type:type[0],
    imgUrl:img[0],
    img:`${category}/${id}.png`,
    recipe,
    category,
    url,
    price,
    uuid:uuid.v4()
  }
}