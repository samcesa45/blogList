const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')


beforeAll(async () => {
    await User.deleteMany({})
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('sekret',saltRounds)
    const user = new User({username:'root',name:'root', passwordHash})
    await user.save()
}, 100000)

describe('when there is initially one user in db', () => {
    test('creation succeeds with a fresh username', async () => {
        const newUser ={
            username:'root1',
            name:'root1',
            password:'root1password'
        }

        const usersAtStart = await helper.userInDB()

        await api 
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.userInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.userInDB()
        
        const newUser ={
            username:'root1',
            name:'root1',
            password:'root1password'
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username must be unique')

        const usersAtEnd = await helper.userInDB()
        expect(usersAtStart).toEqual(usersAtEnd)
        
    })

    
})


afterAll( () => {
    mongoose.connection.close()
})