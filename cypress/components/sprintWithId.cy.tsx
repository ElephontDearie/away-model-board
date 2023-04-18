import React from 'react'
import Board from '../../src/app/sprint/[id]/page'

describe('<Board />', () => {

  it('should render with correct Board content', () => {
    const params = { id: "0" };
    cy.mount(<Board params={params}/>)

    // Assert column names are correct
    cy.get('div > div').contains('To Do')
    cy.get('div > div').contains('Blocked')
    cy.get('div > div').contains('In Progress')
    cy.get('div > div').contains('In Code Review')
    cy.get('div > div').contains('In Peer Review')
    cy.get('div > div').contains('Deployed')
    cy.get('div > div').contains('Done')

  })
})