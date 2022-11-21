const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYzNzQ2NzU3YmU2NzIxZTllOWY4OWFjNCIsImlhdCI6MTY2ODk0OTMwMiwiZXhwIjoxNjY4OTUyOTAyfQ.9ofBZ1xUQooNp6_acSn2CaAicUH6o1_iS-H0Jj-8OcA'

const Blog = require('../models/blog')


beforeEach(async() => {
    await Blog.deleteMany({})


    for(let blog of helper.initialBlogs){
        const blogObject = new Blog(blog)
        await blogObject.save() 
    }
},100000)

test('unique identifier is id', async () => {
    const blogAtStart = await helper.blogInDB()
    const blogAtEnd = blogAtStart[0]
    expect(blogAtEnd.id).toBeDefined()
})

describe('addition of a new blog', () => {
    test('a blog can be added', async () => {
        const newBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
        }

    
        await api
        .post('/api/blogs')
        .set({'Authorization':`bearer ${token}`})
        .send(newBlog)
        .expect(201)
        .expect('Content-Type',/application\/json/)
    
        const blogAtEnd = await helper.blogInDB()
        expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogAtEnd.map(b => b.title)
        expect(titles).toContain(
            "Type wars"
        )
    })
    
    test('like defaults to zero if it is missing',  async () => {
        const blog = {
            title: "First class tests",
            author: "Mark Robinson",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        }
    
        await api
        .post('/api/blogs')
        .set({'Authorization':`bearer ${token}`})
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const blogAtEnd = await helper.blogInDB()
       
        const content = blogAtEnd.find(helper.equalTo(blog))
    
    
        console.log(content.likes)
        expect(content.likes).toBe(0)
    })
    
    test('returns 400 if title or url is missing', async () => {
        const blog = {
            author: "sam cesa",
        }
    
        await api 
        .post('/api/blogs')
        .set({'Authorization':`bearer ${token}`})
        .send(blog)
        .expect(400)
    
        const blogAtEnd = await helper.blogInDB()
        expect(blogAtEnd).toHaveLength(helper.initialBlogs.length)
    
    })
})

describe('a blog can be updated', () => {
    test('contents of a blog can be changed', async () => {
        const blogAtStart = await helper.blogInDB()
        const blogToChange = blogAtStart[0]
    
        const updatedBlog = {...blogToChange, likes:blogToChange.likes + 1}
    
        await api 
        .put(`/api/blogs/${blogToChange.id}`)
        .send(updatedBlog)
        .expect(200)
    
        const blogAtEnd = await helper.blogInDB()
        const changedLikes = blogAtEnd.find(helper.equalTo(blogToChange))
        expect(changedLikes.likes).toBe(blogToChange.likes + 1)
    })
})


describe('deletion of a blog', () => {
    test('successful deletion of a blog', async () => {
        const blogAtStart = await helper.blogInDB()
        const blogToDelete = blogAtStart[0]

        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({'Authorization':`bearer ${token}`})
        .expect(204)

        const blogAtEnd = await helper.blogInDB()
        expect(blogAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const contents = blogAtEnd.map(b => b.title)
        expect(contents).not.toContain(blogToDelete.title)
    })
})


afterAll(() => {
    mongoose.connection.close()
})