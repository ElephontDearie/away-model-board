import React from 'react'
import Home from '../../src/app/page'

describe('<Home />', () => {

  it('should render with correct Home content', () => {
    cy.mount(<Home />)
    cy.get('h1').should('have.text', 'Please log in or sign up to access sprints')

  })
})