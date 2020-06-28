import { buildUser } from '../support/generate'

describe('USer with email can password,', () => {
  const user = buildUser()

  it('can sign up', () => {
    cy.visit('/')
    cy.findByTestId('header-reg-btn').click()
    cy.findByLabelText(/Email cím/i)
      .clear()
      .type(user.email)
    cy.findByLabelText(/Felhasználói név/i)
      .clear()
      .type(user.username)
    cy.findByLabelText(/Jelszó/i)
      .clear()
      .type(user.password)
    cy.findByText(/Regisztrálok/i).click()
    cy.findByText(new RegExp(`Szia ${user.email}`, 'i')).should('be.visible')
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)

    // sign out
    cy.findByLabelText(/Felhasználói menü/i).trigger('mouseover')
    cy.findByTestId('header-signout-btn').click()
  })

  it('can sing in', () => {
    cy.visit('/')
    cy.findByTestId('header-login-btn').click()
    cy.findByLabelText(/Email cím/i)
      .clear()
      .type(user.email)
    cy.findByLabelText(/Jelszó/i)
      .clear()
      .type(user.password)
    cy.findByText(/Belépés/i).click()
    cy.findByText(new RegExp(`Szia ${user.username}`, 'i')).should('be.visible')

    // sign out
    cy.findByLabelText(/Felhasználói menü/i).trigger('mouseover')
    cy.findByTestId('header-signout-btn').click()
  })
})
