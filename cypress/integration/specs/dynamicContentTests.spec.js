describe('User can load page', () => {
    before(() => {
        cy.visit('https://staging.creatorpools.live/')
    });
    it('Should open popup', () => {

        cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4').click()
    });
})
