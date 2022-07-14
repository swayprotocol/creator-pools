describe('Dynamic tests', () => {
    before(() => {

        cy.visit('https://staging.creatorpools.live/')
        //Used for the page to finish loading all the elements correctly
        cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4')
    });

    it('Should switch theme color', () => {
        cy.get('#__next').should('have.css', 'color', 'rgb(35, 35, 35)');
        cy.get(' #__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-3 > div.d-flex > div.Header_themeButtonWrapper__YNNTR > button ').click()
        cy.get('#__next').should('have.css', 'color', 'rgb(255, 255, 255)');
        cy.get(' #__next > section.mb-5 > div > div > div.Header_topSection__loo_5.my-3 > div.d-flex > div.Header_themeButtonWrapper__YNNTR > button ').click()
        cy.get('#__next').should('have.css', 'color', 'rgb(35, 35, 35)');
    });

    it('Should open FAQ', () => {
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(2) > h4').click();
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(2) > div > p:nth-child(1)').should('have.text', 'Creator pools introduce a new metaverse-ready social capital concept by staking with your creators and sharing in their success.')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(2) > div > p:nth-child(2)').should('have.text', 'Just like with the more familiar liquidity pools, they require value to be locked in a form of a stake that will later yield rewards.')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(2) > div > p:nth-child(3)').should('have.text', 'But instead of deriving value from pool’s performance, they use the performance of the creator’s NFTs as the generator of value.')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(3) > h4').click();
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(3) > div > p:nth-child(1)').should('have.text', 'Staking with a creator\'s pool means you support the creator and his work. You also become part of his subDAO (more to follow).')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(3) > div > p:nth-child(2)').should('have.text', 'With every NFT sale, the creator sends a small portion of his revenue back to his pool as rewards.')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(3) > div > p:nth-child(3)').should('have.text', 'All pools and creators are also subject to additionally mined tokens through creator adoption mining mechanism. (more to follow)')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(4) > h4').click();
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(4) > div > p:nth-child(1)').should('have.text', 'Easy. First, make sure you own some $SWAY in your Metamask wallet. Get $SWAY here > NOTE: Currently we only support creator pools on Polygon network.')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(4) > div > p:nth-child(2)').should('have.text', 'Click on Stake and a pop-up will appear. Select the channel and provide the creator\'s identificator. Ie. on channel \'Instagram\' you can stake with a creator with the handle @metaverse. We don\'t validate entries, so make sure there\'s no typos.')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(4) > div > p:nth-child(3)').should('have.text', 'And yes, that means you get to stake with any account you wish -- even if the creator hasn\'t claimed his pool yet.')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(5) > h4').click();
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(5) > div > p:nth-child(1)').should('have.text', 'Every pool needs to be claimed by the original creator in order to start paying out rewards. However, here\'s two reasons why you should start staking today.')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(5) > div > p:nth-child(2)').should('have.text', '1) PROMOTIONAL PERIOD. The first generation staking pool offers a promotional APR of up to 444% instead of direct returns from NFT sales. Read more.')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(5) > div > p:nth-child(3)').should('have.text', '2) BEING FIRST PAYS OFF. The first position in the pool gets the most favorable terms and yields better rewards. You can sit at the top position forever. Might be a smart idea to be the first to stake with @garyvee or beeple.eth...?')
        cy.get('#__next > section.mt-5.mb-4 > div > div > div > div:nth-child(5) > div > p:nth-child(4)').should('have.text', 'If a creator doesn\'t claim his pool, you can simply withdraw your stake after the promotional period. Click on Unstake to begin the withdrawal process.')
    });

    it('Should open popup on Top creator pools', () => {
        cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1)').children().each(($el,index) => {
            if(index > 1) {
                cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(1) > div:nth-child(' + (index+1) + ') > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4 ').click()
                cy.get('#__next > div.modal.undefined > div > div > div.modal-header.pb-0 > h3').should('have.text', 'Stake');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(1) > label').should('have.text', 'Channel');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(2) > label').should('have.text', 'Identificator');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(5) > label').should('have.text', 'Amount');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(6) > label').should('have.text', 'Promotional APR');

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div.row.mb-3 > div > div > div.Modal_socialName__zuvC3').should('not.be.empty');

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(2) > div.col-sm-9.offset-sm-3.mt-3 > p').should('have.text',
                    'NOTE: We don\'t validate entries, so make sure there are no typos.');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(2) > div.Modal_midText__eg_0j.Modal_lightText__54BhX.col-sm-5').should('have.text',
                    'ie. leomessi, banksy.eth ...');

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(5) > div.Modal_tokenAvailable__7uPFe.col-sm-5 > img').should('be.visible')

                cy.get('#__next > div.modal.undefined > div > div > div.modal-header.pb-0 > button').click()
            }
        })
    });

    it('Should open popup on Latest stakes', () => {
        cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(2)').children().each(($el,index) => {
            if(index > 1) {
                cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(2) > div:nth-child(' + (index+1) + ') > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4').click()
                cy.get('#__next > div.modal.undefined > div > div > div.modal-header.pb-0 > h3').should('have.text', 'Stake');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(1) > label').should('have.text', 'Channel');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(2) > label').should('have.text', 'Identificator');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(5) > label').should('have.text', 'Amount');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(6) > label').should('have.text', 'Promotional APR');

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div.row.mb-3 > div > div > div.Modal_socialName__zuvC3').should('not.be.empty');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(2) > div.col-sm-9.offset-sm-3.mt-3 > p').should('have.text',
                    'NOTE: We don\'t validate entries, so make sure there are no typos.');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(2) > div.Modal_midText__eg_0j.Modal_lightText__54BhX.col-sm-5').should('have.text',
                    'ie. leomessi, banksy.eth ...');

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(5) > div.Modal_tokenAvailable__7uPFe.col-sm-5 > img').should('be.visible')

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(6) > div.Modal_midText__eg_0j.col-sm-6')
                    .invoke('text')
                    .should('match', /Position will be locked for [0-9]+ months./);

                cy.get('#planId').invoke('text').should('match', /[0-9]+%/)
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(5) > div.Modal_tokenAvailable__7uPFe.col-sm-5 > span').invoke('text').should('match', /[0-9]+.[0-9]+ available/)

                cy.get('#__next > div.modal.undefined > div > div > div.modal-header.pb-0 > button').click()
            }
        })
    });

    it('Should open popup on Highest position', () => {
        cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(3)').children().each(($el,index) => {
            if(index > 1) {
                cy.get('#__next > section:nth-child(4) > div > div > div:nth-child(3) > div:nth-child(' + (index+1) + ') > div:nth-child(1) > div.Item_titleWrap__jEPrA > div.Item_innerTitleWrap__PNF36.Item_clickable___l0o4').click()
                cy.get('#__next > div.modal.undefined > div > div > div.modal-header.pb-0 > h3').should('have.text', 'Stake');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(1) > label').should('have.text', 'Channel');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(2) > label').should('have.text', 'Identificator');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(5) > label').should('have.text', 'Amount');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(6) > label').should('have.text', 'Promotional APR');

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div.row.mb-3 > div > div > div.Modal_socialName__zuvC3').should('not.be.empty');

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(2) > div.col-sm-9.offset-sm-3.mt-3 > p').should('have.text',
                    'NOTE: We don\'t validate entries, so make sure there are no typos.');
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(2) > div.Modal_midText__eg_0j.Modal_lightText__54BhX.col-sm-5').should('have.text',
                    'ie. leomessi, banksy.eth ...');

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(7) > div.col-sm-8.offset-sm-3 > p').should('have.text', 'After clicking on Stake, Metamask will pop-up to complete the transaction.')
                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div.row.mb-3 > div > div > div.Modal_socialIcon__5ikfr > svg').should('be.visible')

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(5) > div.Modal_tokenAvailable__7uPFe.col-sm-5 > img').should('be.visible')

                cy.get('#__next > div.modal.undefined > div > div > div.modal-body > form > div:nth-child(7) > div.col-sm-4.offset-sm-3.mb-3.mt-2 > button').click()
                cy.get('#__next > div.modal.undefined > div > div > div.modal-header.pb-0 > button').click()
            }
        })
    });

    it('Footer links should work', () => {
        cy.get('#__next > footer > div > div:nth-child(1) > ul > li:nth-child(2) > a').should('have.attr', 'href', 'https://swaysocial.org')
        cy.get('#__next > footer > div > div:nth-child(1) > ul > li:nth-child(3) > a').should('have.attr', 'href', 'https://github.com/swayprotocol')
        cy.get('#__next > footer > div > div:nth-child(1) > ul > li:nth-child(4) > a').should('have.attr', 'href', 'https://t.me/swayprotocol')
        cy.get('#__next > footer > div > div:nth-child(1) > ul > li:nth-child(5) > a').should('have.attr', 'href', 'https://twitter.com/swayprotocol')
    });
})
