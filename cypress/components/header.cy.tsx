import React from 'react'
import Header from '../../src/app/components/header'

describe('<Header />', () => {

  it('should render with header content', () => {
    cy.mount(<Header />)
    // Header should have 5 elements displayed
    cy.get('ul').children().should('have.length', 5)

    // Header should contain a Backlog button
    cy.get('ul li a:first').should('have.attr', 'href', '/backlog')
    // Header should contain a View Sprints button
    cy.get('#sprint-dropdown').should('have.text', 'View Sprints')
    // Header should contain a Create Sprint button
    cy.get('ul li:nth-child(3)').should('have.text', 'Create a Sprint')

    // Header should contain a Home button
    cy.get('ul li a:last').should('have.attr', 'href', '/')

  })
})