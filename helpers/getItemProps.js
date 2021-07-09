export const getType = (category) => {
  return category === 'idoles' ?
    `body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div:nth-child(3) > div > div > div.col-sm-9 > div.ak-encyclo-block-info > div > div.ak-encyclo-detail-type.col-xs-6 > span` :
    `body > div.ak-mobile-menu-scroller > div.container.ak-main-container > div > div > div > main > div.ak-container.ak-main-center > div > div:nth-child(3) > div > div > div.col-sm-9 > div > div.ak-encyclo-block-info > div > div.ak-encyclo-detail-type.col-xs-6 > span`
}