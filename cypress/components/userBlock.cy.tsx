import React, { useState } from 'react'
import UserBlock from '@/app/components/userBlock';


describe('<UserBlock />', () => {
    it('should render with user content', () => {
        cy.mount(<UserBlock/>)
        cy.get('.text-end').children().should('have.length', 2)
        cy.get('button').first().should('have.text', 'Login')
        cy.get('button').last().should('have.text', 'Sign-up')

    })
})