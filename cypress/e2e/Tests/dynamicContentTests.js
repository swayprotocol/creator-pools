/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('Check if ', () => {
  beforeEach(() => {
    cy.visit('https://creatorpools.live/')
  })


  it('Should display Header content and stakes correctly', () => {

  });

  it('Should display Overview correctly', () => {
    cy.get('#__next > div > div > div > p').should('include.text', "TVL - total SWAY locked in creator pools")
  });

  it('Should display Stakes correctly', () => {
    cy.get('#__next > div > div > div > p').should('include.text', "TVL - total SWAY locked in creator pools")
  });

  it('Should display FAQ correctly', () => {
    cy.get('#__next > div > div > div > p').should('include.text', "TVL - total SWAY locked in creator pools")
  });

  it('Should display Footer correctly', () => {
    cy.get('#__next > div > div > div > p').should('include.text', "TVL - total SWAY locked in creator pools")
  });

})
