import React from 'react'
import Board from '../../src/app/sprint/page'

describe('<Board />', () => {

  it('should render with correct Board content', () => {
    cy.mount(<Board />)
    cy.get('h2').should('have.text', 'All Sprints')

  })
})