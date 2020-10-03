describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.createUser({
      name: 'Juan Dantur',
      username: 'jpdantur',
      password: 'jpdantur'
    })
  })

  it('Login form is shown', function() {
    cy.contains('login')
    cy.get('#username').type('jpdantur')
    cy.get('#password').type('jpdantur')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login')
      cy.get('#username').type('jpdantur')
      cy.get('#password').type('jpdantur')
      cy.get('#login-button').click()

      cy.contains('Juan Dantur logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login')
      cy.get('#username').type('jpdantur')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').contains('wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'jpdantur', password: 'jpdantur' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('How to be badass')
      cy.get('#author').type('Mr Poronga')
      cy.get('#url').type('www.com')
      cy.get('#create-blog').click()

      cy.contains('How to be badass Mr Poronga')
    })

    describe('And a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title:'How to be badass', author: 'Mr Poronga', url: 'www.com' })
      })
      it('A user can like a blog', function() {
        cy.contains('How to be badass').contains('view').click()
        cy.contains('like').click()
      })
      it('A user can delete his blog', function() {
        cy.contains('How to be badass').contains('view').click()
        cy.contains('remove').click()
      })
      it('A user cannot delete blogs from another user', function() {
        cy.contains('logout').click()
        cy.createUser({
          name: 'Juan Dantur 2',
          username: 'jpdantur2',
          password: 'jpdantur2'
        })
        cy.login({ username: 'jpdantur2', password: 'jpdantur2' })
        cy.contains('How to be badass').contains('view').click()
        cy.contains('remove').should('have.css','display','none')
      })
      it('Blogs are sorted by likes', function() {
        cy.createBlog({ title:'A second blog', author: 'Mr Poronga', url: 'www.com', likes: 2 })
        cy.createBlog({ title:'The third one', author: 'Mr Poronga', url: 'www.com', likes: 3 })
        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).contains('The third one')
          cy.wrap(blogs[1]).contains('A second blog')
          cy.wrap(blogs[2]).contains('How to be badass')
        })
      })
    })
  })
})