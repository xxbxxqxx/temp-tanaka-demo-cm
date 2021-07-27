describe('Index', () => {
  it('message ja', () => {
    cy.visit('http://localhost:9000/ja/who/')
    cy.percySnapshot();
  })
  it('message en', () => {
    cy.visit('http://localhost:9000/en/who/')
    cy.percySnapshot();
  })
});
