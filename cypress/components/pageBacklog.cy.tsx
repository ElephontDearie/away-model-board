import React from 'react'
import Backlog from '../../src/app/backlog/page'

describe('<Backlog />', () => {
  it('should render with the correct content', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Backlog />)
    cy.get('h1').contains('Backlog')

  })
})