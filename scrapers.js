import fs from 'fs';
import puppeteerExtra from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import { getEntities } from './helpers/getEntities.js';
import { getEntity } from './helpers/getEntity.js';

// This file scraps data from dofus website, but some data are sometimes missing.
// The scripts creates two files, one that takes all data scrapped, and the other one is for the entity that did not got scrapped correctly

async function scrapProduct(){
    try {
        const allData = [];
        const start = Date.now();
        puppeteerExtra.use(pluginStealth());

        const browser = await puppeteerExtra.launch({
          args: [
            '--proxy-server="direct://"',
            '--proxy-bypass-list=*',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list'
          ],
          executablePath: 'C:/Program Files/chrome-win/chrome.exe'
          , 
          headless: true 
        });

        const categories = ["idoles","equipements","consommables","armes","ressources"];
        const resObjects = [];

        for (const category of categories) {
          resObjects.push(...await getEntities(browser,category));

          let tries = 0;
          let clearObject = false;
          let notScrapedData = []
          while (!clearObject && tries < 20) {
            tries += 1;
            clearObject = true;
            for (const i in resObjects) {
              console.log({itemScrapped: resObjects[i]});
              if (!resObjects[i].name || !resObjects[i].type) {
                if (tries === 20) {
                  notScrapedData.push(resObjects[i]);
                } else {
                  console.log('Not clear');
                  clearObject = false;
                  resObjects[i] = await getEntity(resObjects[i].url,browser,resObjects[i].category)
                  await new Promise(resolve => setTimeout(resolve, 5000));
                }
              }
            }
          }
          const response = JSON.stringify(resObjects);
          const responseNotScrapped = JSON.stringify(notScrapedData);
          allData.push(...response);
          fs.writeFileSync(`data/${category}_NOT_SCRAPPED.json`, responseNotScrapped);
          fs.writeFileSync(`data/${category}.json`, response);
          console.log('Took', Date.now() - start, 'ms');
        }

        fs.writeFileSync(`data/allData.json`, allData);
        browser.close()
    } catch(error) {
        console.log(error);
    }

}

scrapProduct();
