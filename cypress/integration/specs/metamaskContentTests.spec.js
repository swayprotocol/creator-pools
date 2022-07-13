import { Contract } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers';
import stakingAbi from '../../../shared/abis/staging-staking-abi.json'
const url = 'https://polygon-mumbai.g.alchemy.com/v2/6kkkcccOr3uJck57CliIomFbHt9eSYu5';
const rpcProvider = new JsonRpcProvider(url);
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
    let hashBla = 'TX_HASH'
    stakingContract.once('Staked', async (poolHandle,address,amount,poolIndex,reciept) => {
      console.log(poolHandle,address,amount,poolIndex,reciept)
      hashBla=reciept.transactionHash
    })
    cy.get('.Stakes_connectWrapper__XanLe > .btn').click()
    cy.get('#social').type('ig')
    cy.get('#poolHandle').type('test')
    cy.get('#amount').type(1000)
    cy.get('.modal-body > form').find('button').click()
    cy.confirmMetamaskTransaction()
    cy.wait(30000).then(()=>{
      const status = cy.etherscanWaitForTxSuccess(hashBla)
      console.log(status)
    })
  })
})
