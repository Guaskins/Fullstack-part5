Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3001/api/login', {
      username, password
    }).then(({ body }) => {
      localStorage.setItem('loggedBloglistAppUser', JSON.stringify(body))
      cy.visit('http://localhost:3000')
    })
  })

Cypress.Commands.add('createUser', ({ name, username, password }) => {
  cy.request({
    url: 'http://localhost:3001/api/users',
    method: 'POST',
    body: { name, username, password },
  })
})

Cypress.Commands.add('createBlog', ({ title, url, likes, author }) => {
  cy.request({
    url: 'http://localhost:3001/api/bloglist',
    method: 'POST',
    body: { title, url, likes, author },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedBloglistAppUser')).token}`
    }
  })

  cy.visit('http://localhost:3000')
})

