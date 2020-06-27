import { buildUser } from '../support/generate'

describe('sing up', () => {
  it('should work with username and password', () => {
    const user = buildUser()
    cy.visit('/')
    cy.findByTestId('header-reg-btn').click()
    cy.findByLabelText('Email cím').type(user.email)
    cy.findByLabelText('Felhasználói név').type(user.username)
    cy.findByLabelText('Jelszó').type(user.password)
    cy.findByText('Regisztrálok').click()
  })
})
