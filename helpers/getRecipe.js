export const getRecipe = async (page) => {
  const regex = /\d+/;
  const recipe = [];
  const resources = await page.evaluate(() => Array.from(document.querySelectorAll(`body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div.ak-container.ak-panel.ak-crafts > div.ak-panel-content > div.ak-container.ak-content-list.ak-displaymode-image-col > div > div`), element => element));
  for (let i = 1; i<resources.length + 1; i=i+2) {
    const path = `body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div.ak-container.ak-panel.ak-crafts > div.ak-panel-content > div.ak-container.ak-content-list.ak-displaymode-image-col > div > div:nth-child(${i}) > div >`
    const url = await page.evaluate((path) => Array.from(document.querySelectorAll(`${path} div.ak-main > div > div.ak-image > a`), url => url.href),path);
    const quantity = await page.evaluate((path) => Array.from(document.querySelectorAll(`${path} div.ak-front`), quantity => quantity.innerHTML),path)
    const id =  url[0].substring(
      url[0].lastIndexOf("/") + 1, 
      url[0].indexOf("-")
    );
    recipe.push({
      id,
      url:url[0],
      quantity:quantity[0].match(regex)[0],
    });
  }
  return recipe;
}