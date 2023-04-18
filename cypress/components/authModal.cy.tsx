import React, { useState } from 'react'
import { AuthModal } from '@/app/components/auth'

const wrappedAuthModal = () => {
    const AuthModalWrapper = (givenInput: {givenInput: boolean}) => {
        const [showModal, setShowModal] = useState(true);
        return <AuthModal showModal={showModal} setShowModal={setShowModal} isRegister={givenInput.givenInput}
            />
    }
    return AuthModalWrapper
}


describe('<AuthModal />', () => {

  it('should mount with wrapper to render with AuthModal content when registering', () => {
    const AuthModalWrapper = wrappedAuthModal();
    cy.mount(<AuthModalWrapper givenInput={true}/>)

    cy.get('.modal-title').should('have.text', 'Sign Up')
    cy.get('.modal-body form').children().should('have.length', 4)

    // Should render four fields
    cy.get('.modal-body form div:first').should('have.text', 'Username')
    cy.get('.modal-body form div:nth-child(2)').should('have.text', 'Email address@@')
    cy.get('.modal-body form div:nth-child(3)').should('have.text', 'Password')
    cy.get('.modal-body form div:last').should('have.text', 'Confirm Password')
  })

  it('should mount with wrapper to render with AuthModal content when logging in', () => {
    const AuthModalWrapper = wrappedAuthModal();
    cy.mount(<AuthModalWrapper givenInput={false}/>)

    cy.get('.modal-title').should('have.text', 'Login')
    cy.get('.modal-body form').children().should('have.length', 2)

    // Should render two fields
    cy.get('.modal-body form div:first').should('have.text', 'Email address@')
    cy.get('.modal-body form div:last').should('have.text', 'Password')
  })
})