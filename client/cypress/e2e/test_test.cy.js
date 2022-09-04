describe('tests that testing works', () => {
  it('visits the page', function() {
    cy.request('POST', 'http://localhost:3000/api/initialize-e2e')
    cy.visit('http://localhost:3000')
    cy.contains('Hello world!')
  })

  it('button pressing works', function() {
    cy.request('POST', 'http://localhost:3000/api/initialize-e2e')
    cy.visit('http://localhost:3000')
    cy.contains('Press me').click()
    cy.contains('1 - eka')
  })
})