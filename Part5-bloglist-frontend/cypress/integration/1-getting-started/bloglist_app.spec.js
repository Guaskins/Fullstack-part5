describe('Bloglist app', function() {
  
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/testing/reset')
    })

    it('E2E Paso 1: Login form is shown', function() {
      cy.visit('http://localhost:3000')
      cy.contains('blogs')
      cy.contains('log in to application')
      cy.contains('username')
      cy.contains('password')
    })

    
    describe('E2E Paso 2: Login',function() {
      beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
          name: 'Matti Luukkainen',
          username: 'mluukkai',
          password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
      })

      it('test command Login'), function() {
        cy.login({ username: 'mluukkai', password: 'salainen' })
      }
      
      it('test logout'), function() {
        cy.get('#logout').click()
      }

      it('succeeds with correct credentials', function() {
        //cy.login({ username: 'mluukkai', password: 'salainen' })
        cy.get('#username').clear()
        cy.get('#username').type('mluukkai')
        cy.get('#password').clear()
        cy.get('#password').type('salainen')
        cy.get('#login-button').then(buttons => {
            console.log('number of buttons click login', buttons.length)
            cy.wrap(buttons[0]).click()
        })
        cy.contains('Matti Luukkainen logged-in')
      })

      it('fails with wrong credentials', function() {
        cy.get('#logout').click()
        cy.get('#username').clear()
        cy.get('#username').type('mluukkai')
        cy.get('#password').clear()
        cy.get('#password').type('wrong')
        cy.get('#login-button').then(buttons => {
            console.log('number of buttons click login-wrong', buttons.length)
            cy.wrap(buttons[0]).click()
        })
        cy.contains('log in to application')
        cy.get('.error')
            .should('contain', 'Wrong') 
            .and('have.css', 'color', 'rgb(255, 0, 0)')
      })
      
    })
    
    
    describe('E2E Paso 3: add a Blog by logged user', function() {

      describe.only('When logged in', function() {
        
        beforeEach(function() {
          cy.request('POST', 'http://localhost:3001/api/testing/reset')
          cy.createUser({name: 'user test', username: 'test', password: 'test'})
          cy.login({ username: 'test', password: 'test' })
        })

        it('A blog can be created', function() {
          cy.createBlog({
            title: 'Las mejores fotografías de naturaleza de 2021',
            url: 'https://www.nationalgeographic.com.es/naturaleza/mejores-fotografias-naturaleza-2021-segun-revista-nature_17700',
            likes: 922, 
            author: 'Héctor Rodríguez',
          })
          cy.contains('Las mejores fotografías de naturaleza de 2021')
        })

        it('E2E Paso 4: A blog can like a user', function() {
          cy.createBlog({
            title: 'Las mejores fotografías de naturaleza de 2021',
            url: 'https://www.nationalgeographic.com.es/naturaleza/mejores-fotografias-naturaleza-2021-segun-revista-nature_17700',
            likes: 922, 
            author: 'Héctor Rodríguez',
          })

          cy.get('#view-blog').click()
          cy.get('#likes').click()
          cy.visit('http://localhost:3000')
          cy.get('#view-blog').click()
          cy.contains('923')
        })

        it('E2E Paso 5: the user who created the blog, can delete it', function() {
          cy.createBlog({
            title: 'Las mejores fotografías de naturaleza de 2021',
            url: 'https://www.nationalgeographic.com.es/naturaleza/mejores-fotografias-naturaleza-2021-segun-revista-nature_17700',
            likes: 922, 
            author: 'Héctor Rodríguez',
          })

          cy.get('#view-blog').click()
          cy.get('#remove-blog').click()
          cy.visit('http://localhost:3000')
          cy.expect('#content-title').to.not.equal('Las mejores fotografías de naturaleza de 2021')
        })

        it('E2E Paso 5-extra: Another user who didn,t create the blog, cannot delete it', function() {
          cy.createBlog({
            title: 'Las mejores fotografías de naturaleza de 2021',
            url: 'https://www.nationalgeographic.com.es/naturaleza/mejores-fotografias-naturaleza-2021-segun-revista-nature_17700',
            likes: 922, 
            author: 'Héctor Rodríguez',
          })

          cy.get('#logout').click()
          cy.createUser({name: 'user test 2', username: 'test2', password: 'test2'})
          cy.login({ username: 'test2', password: 'test2' })
          cy.visit('http://localhost:3000')

          cy.get('#view-blog').click()
          cy.expect('#remove-blog').to.not.equal('remove')
        })

        it('E2E Paso 6: the blog list is sorted by number of likes', function() {
          cy.createBlog({ title: 'first blog', url: 'http://google.com', likes: 10, author: 'James Smith' })
          cy.createBlog({ title: 'second blog', url: 'http://google.com', likes: 45, author: 'James Smith' })
          cy.createBlog({ title: 'third blog', url: 'http://google.com', likes: 33, author: 'James Smith' })

          cy.get('#view-blog').click()
          cy.get('#view-blog').click()
          cy.get('#view-blog').click()

          cy.get(".content-blog>.content-likes").should((items) => {
            expect(items[0]).to.contain("45");
            expect(items[1]).to.contain("33");
            expect(items[2]).to.contain("10");
          })

        })
      })

    })
    
  })