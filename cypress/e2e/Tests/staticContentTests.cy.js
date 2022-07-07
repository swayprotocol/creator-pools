

describe('Check if ', () => {
  beforeEach(() => {

    cy.visit('https://creatorpools.live/')

  })

  it('Should display infoBar correctly', () => {

    cy.get('#__next > div > div > div > p').should('include.text', "TVL - total SWAY locked in creator pools")

  });

  it('Should display Header static content correctly', () => {

    cy.get('#__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-3 > div.header-title > h1').should('have.text', "Creator Pools")
    cy.get('#__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-3 > div.header-title > span').should('have.text', "v0.2 Beta")
    cy.get('#__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-1 > div.d-flex.align-items-center > h5').should('have.text', 'Powered by')
    cy.get('#__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-1 > div.d-flex.align-items-center > a > img').should('be.visible')

    cy.get('#__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-3 > div.d-flex > div:nth-child(1) > div:nth-child(2)').should('have.text', 'Polygon')
    cy.get('#__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-3 > div.d-flex > div:nth-child(2) > div:nth-child(2)').should('have.text', 'BSC')
    cy.get('#__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-3 > div.d-flex > div:nth-child(3) > div:nth-child(2)').should('have.text', 'Polkadot')

    cy.get('#__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-3 > div.d-flex > div.Header_themeButtonWrapper__YNNTR > button > svg').should('be.visible')

  });

  it('Should display Overview correctly', () => {
    cy.get('#__next > section:nth-child(3) > div > div > h2').should('include.text', "Overview")

    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-8 > div:nth-child(1) > div:nth-child(1)').should('have.text', 'TVL')
    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-8 > div:nth-child(2) > div.overview-item-name').should('have.text', 'APY MAX')
    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-8 > div:nth-child(3) > div.overview-item-name').should('have.text', 'TOTAL REWARDS EARNED')

    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-8 > div:nth-child(1) > div.overview-item-value').should('not.be.empty')
    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-8 > div:nth-child(2) > div.overview-item-value').should('not.be.empty')
    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-8 > div:nth-child(3) > div.overview-item-value').should('not.be.empty')

    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-8 > div:nth-child(1) > div:nth-child(3)').should('include.text', '% of circulating supply')

    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-4 > div > div.overview-item-title.col-7').should('include.text', "CHANNEL DISTRIBUTION")
    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-4 > div > div.overview-item-channels.col-5 > div:nth-child(1)').should('include.text', "Instagram")
    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-4 > div > div.overview-item-channels.col-5 > div:nth-child(2)').should('include.text', "Wallet")
    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-4 > div > div.overview-item-channels.col-5 > div:nth-child(3)').should('include.text', "TikTok")
    cy.get('#__next > section:nth-child(3) > div > div > div.col-12.col-sm-4 > div > div.overview-item-channels.col-5 > div:nth-child(4)').should('include.text', "Ethereum Name Service")
    cy.get('#__next > div > div > div > p').should('include.text', "TVL - total SWAY locked in creator pools")

    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1) > h4').should('have.text', 'Top creator pools')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(2) > h4').should('have.text', 'Latest stakes')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(3) > h4').should('have.text', 'Highest positions')

  });

  it('Should display Stakes correctly', () => {

    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1) > h4').should('have.text', 'Top creator pools')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1) > div > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4 > div.Item_socialIcon__DjOW9').should('be.visible')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1) > div > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4 > div.Item_mainText__qWngH').should('not.be.empty')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div').should('not.be.empty')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div').should('not.be.empty')

    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(2) > h4').should('have.text', 'Latest stakes')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(2) > div > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4 > div.Item_socialIcon__DjOW9').should('be.visible')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(2) > div > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4 > div.Item_mainText__qWngH').should('not.be.empty')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div').should('not.be.empty')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div').should('not.be.empty')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div').should('not.be.empty')

    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(3) > h4').should('have.text', 'Highest positions')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(3) > div > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4 > div.Item_socialIcon__DjOW9').should('be.visible')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(3) > div > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4 > div.Item_mainText__qWngH').should('not.be.empty')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(2) > div').should('not.be.empty')
    cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(1) > div').should('not.be.empty')

  });

  it('Should display FAQ correctly', () => {

    cy.get('#__next > section.mt-5.mb-4 > div > div > div > h2').should('have.text', "FAQ")
    cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(2)').should('have.text', "▶What are creator pools?")
    cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(3)').should('have.text', "▶How is value generated through NFTs?")
    cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(4)').should('have.text', "▶How can I stake with a creator?")
    cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(5)').should('have.text', "▶Why should I stake?")

  });

  it('Should display Footer correctly', () => {

    cy.get('#__next > footer > div > div:nth-child(1) > ul > li:nth-child(1)').should('include.text', "(c) 2022 Sway Social")
    cy.get('#__next > footer > div > div:nth-child(1) > ul > li:nth-child(2)').should('include.text', "https://swaysocial.org")
    cy.get('#__next > footer > div > div:nth-child(1) > ul > li:nth-child(3)').should('include.text', "Github")
    cy.get('#__next > footer > div > div:nth-child(1) > ul > li:nth-child(4)').should('include.text', "Telegram")
    cy.get('#__next > footer > div > div:nth-child(1) > ul > li:nth-child(5)').should('include.text', "Twitter")

    cy.get('#__next > footer > div > div.row.mt-3 > div').should('include.text', "The website is maintained by 721Labs Technology Group Limited. The website is maintained solely to enable analytical insight and allow interaction with the Sway Social protocol. An indication of any creator on this website does not implicate that a particular creator is anyhow affiliated with 721Labs or that 721Labs has anyhow endorsed such creator. Neither does an indication of any creator on the website suggest that a particular creator has endorsed 721Labs, any project of 721Labs or Sway Social.")

  });
})
