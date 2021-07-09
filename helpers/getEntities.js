import { getEntityUrl} from './getEntityUrl.js'
import { getEntity} from './getEntity.js'
import { newPage } from './newPage.js';

export const getEntities = async (browser,category) => {
  const resObjects = [];
  const url = `https://www.dofus.com/fr/mmorpg/encyclopedie/${category}?size=96&display=table`
  const page = await newPage(browser,url);

  /* -------------------------------------------------------------------------- */
  /*                        GET LAST INDEX FROM CATEGORY                        */
  /* -------------------------------------------------------------------------- */

  let pageNumber ;
  if (category !== "idoles") {
    const lastIndex = await page.evaluate(() => Array.from(document.querySelectorAll("body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div.ak-container.ak-panel.main-object-list.ak-nocontentpadding > div.ak-panel-footer > div.text-center.ak-pagination.hidden-xs > nav > ul > li:nth-child(8) > a"), element => element.innerHTML));
    pageNumber = parseInt(lastIndex[0]);
    console.log(pageNumber);
  } else {
    pageNumber = 1;
  }


  /* -------------------------------------------------------------------------- */
  /*                                GET ITEMS URLS                              */
  /* -------------------------------------------------------------------------- */

  let itemsLinks = [];

  const res = [];
  for (let i = 1; i<pageNumber + 1;i++) {
    let pageEntities = [];

    pageEntities = await getEntityUrl(i ,url,browser);

    console.log({linksLength:pageEntities.length})
    if (pageEntities.length === 0) {
      console.log('EMPTY');
      while (pageEntities.length === 0) {
        pageEntities = await getEntityUrl(i ,url,browser);
        await new Promise(resolve => setTimeout(resolve, 12500));
      }
      console.log(pageEntities, 'SHOULD BE NOT EMPTY')
    }
    res.push(... pageEntities);
    await new Promise(resolve => setTimeout(resolve, 12500));
  }

  itemsLinks = res;
  itemsLinks = [...new Set(itemsLinks)];
  console.log({quantity:itemsLinks.length});


  
  let maxPromiseNumber = 0;
  while (maxPromiseNumber - 10 <= itemsLinks.length) {
    console.log(maxPromiseNumber);
    const promisesObjects = [];
    for (let i = 0; i < 10 && i + maxPromiseNumber  < itemsLinks.length; i++) {
      console.log({ITERATION:i + maxPromiseNumber})
      promisesObjects.push(getEntity(itemsLinks[i + maxPromiseNumber],browser,category));
    }
    maxPromiseNumber += 10;
    resObjects.push(...await Promise.all(promisesObjects));
    await new Promise(resolve => setTimeout(resolve, 12500));
  }
  return resObjects;
}