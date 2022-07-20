describe('Test metamask functions', () => {
  before(() => {
    cy.visit('https://staging.creatorpools.live/')
  });

  it('Should add MATIC network and switch to it', () => {
    cy.addMetamaskNetwork({networkName: 'Mumbai', rpcUrl: 'https://rpc-mumbai.maticvigil.com/', chainId: '0x13881', symbol: 'MATIC', blockExplorer: 'https://mumbai.polygonscan.com/', isTestnet: true})
    cy.changeMetamaskNetwork('Mumbai')
  });

  it('Should connect wallet', () => {
    cy.get('.connect > .btn').click();
    cy.acceptMetamaskAccess()
  });

  it('Should open stake modal and stake it', () => {
    cy.get('.Stakes_connectWrapper__XanLe > .btn').click()
    cy.get('#social').type('ig')
    cy.get('#poolHandle').type('test')
    cy.get('#amount').type(1000)
    cy.get('.modal-body > form').find('button').click()
    cy.confirmMetamaskTransaction()
    cy.wait(40000).then(()=>{
      cy.get('.close-btn').click()
      cy.get('.Item_item__woJYJ').contains('test').parents('.Item_item__woJYJ').contains('Locked')
    })
  })

  it('Should unstake ', () => {
    cy.wait(5000).then(()=>{
      cy.get('.Item_item__woJYJ').contains('test').parents('.Item_item__woJYJ').contains('Locked')
    })
    cy.wait(60000).then(()=>{
      cy.get('.Item_item__woJYJ').contains('test').click()
      cy.get('.Item_item__woJYJ').contains('test').parents('.Item_item__woJYJ').contains('Unlocked')
      cy.contains('Unstake').click()
      cy.get('.modal-body').contains('Unstake').click()
      cy.confirmMetamaskTransaction()
    })
    cy.wait(40000).then(()=>{
      cy.get('.close-btn').click()
      cy.get('.Item_item__woJYJ').should('not.exist');
    })
  })


})
