import { Contract, ethers } from 'ethers'
import stakingAbi from './../../../shared/abis/staging-staking-abi.json'
const url = 'https://polygon-mumbai.g.alchemy.com/v2/6kkkcccOr3uJck57CliIomFbHt9eSYu5';
const rpcProvider = new ethers.providers.JsonRpcProvider(url);
const stakingContract = new Contract('0x440141a6325966a4fDecce951f449D0fC2581B60', stakingAbi, rpcProvider)


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
    let staked = false
    stakingContract.once('Staked', async (poolHandle,address,amount,poolIndex,reciept) => {
      staked = true
    })
    cy.get('.Stakes_connectWrapper__XanLe > .btn').click()
    cy.get('#social').type('ig')
    cy.get('#poolHandle').type('test')
    cy.get('#amount').type(1000)
    cy.get('.modal-body > form').find('button').click()
    cy.confirmMetamaskTransaction()
    cy.wait(40000).then(()=>{
      cy.get('.close-btn').click()
      expect(staked).to.be.true
    })
  })

  it('Should unstake ', () => {
    let unstaked = false
    stakingContract.once('Unstaked', async (poolHandle,recipient,amount,reciept) => {
      unstaked = true
    })
    
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
      expect(unstaked).to.be.true
    })
  })


})
