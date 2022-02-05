const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require("../models/user")

let token = null
let userid = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const testUser = await new User({
    username: "lsalander",
    name: "Liztbeth Salander",
    passwordHash: await bcrypt.hash("salander", 10),
  }).save()

  userid = testUser.id

  const userForToken = { username: testUser.username, id: testUser.id }
  token = jwt.sign(userForToken, process.env.SECRET)

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    blogObject.user = testUser.id
    const savedBlog = await blogObject.save()

    testUser.blogs = testUser.blogs.concat(savedBlog.id)
    await User.findByIdAndUpdate(testUser.id, testUser, { new: false })

  }
})

describe('Pruebas de lista de blogs', () => {
  test('paso 1 - all blogs', async () => {
    const response = await api.get('/api/bloglist')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test("Paso 2 - ver un blog concreto (id)", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/bloglist/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

      //const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

      expect(resultBlog.body.id).toEqual(blogToView.id)
  })

  test('paso 3 - valid blog added', async () => {
    const user = await User.findById(userid)

    const newBlog = { 
        title: "Probando el backend", 
        author: "Universidad de Helsinki", 
        url: "https://fullstackopen.com/es/part4/porbando_el_backend", 
        likes: 115,
        user: userid
    }

    const savedBlog = await api
        .post('/api/bloglist')
        .set("Authorization", `bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /json/)

    user.blogs = user.blogs.concat(savedBlog._id)
    await User.findByIdAndUpdate(user._id, user, { new: false })

    const blogsAtEnd = await helper.blogsInDb()

    const contents = blogsAtEnd.map((blog) => blog.title);
    expect(contents).toContain("Probando el backend");

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('paso 4 - likes 0', async () => {
    const newBlog = { 
        title: "Apps2Digital: Achieve Digital Employee Experience Greatness", 
        author: "Flexxible IT's", 
        url: "https://www.flexxible.com/blog/apps2digital-achieve-digital-employee-experience-greatness",
        user: userid
    }

    await api
        .post('/api/bloglist')
        .set("Authorization", `bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /json/)

    const blogsAtEnd = await helper.blogsInDb()
    const contents = blogsAtEnd.map(n => n.likes)
    expect(contents).toContain(0)
  })

  test('paso 5 - blog without author/url is not added', async () => {
    const newBlog = {
      title: "blog without author/url is not added",
      user: userid
    }

    await api
      .post('/api/bloglist')
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
  
  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/bloglist/${invalidId}`)
      .expect(400)
  })
  
  test('paso 13 - delete a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/bloglist/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('paso 14 - succeeds edit "likes" from a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const idBlog = blogsAtStart[0].id

    const blogModified = {
      title: blogsAtStart[0].title, 
      author: blogsAtStart[0].author, 
      url: blogsAtStart[0].url, 
      likes: 100,
      user: userid
    }

    await api
      .put(`/api/bloglist/${idBlog}`)
      .set("Authorization", `bearer ${token}`)
      .send(blogModified)
      .expect(200)
      .expect('Content-Type', /json/)

    const blogsAtEnd = await helper.blogsInDb()

    const changedBlog = blogsAtEnd.find(n => n.id === idBlog)

    expect(blogModified.likes).toBe(changedBlog.likes)
    
  })
})

afterAll(() => {
  mongoose.connection.close()
})