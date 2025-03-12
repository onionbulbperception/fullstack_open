require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const path = require('path')

const Person = require('./models/person')
const person = require('./models/person')

const app = express()

app.use(express.json())

// https://github.com/expressjs/morgan#creating-new-tokens
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body', {
        skip: (req) => req.method !== 'POST',
    })
)

// https://github.com/expressjs/morgan
app.use(morgan('tiny'))

//app.get('/info', (request, response) => {
//    const date = new Date()
//    response.send(`
//        <p>Phonebook has info for  ${persons.length} people</p>
//        <p>${date}</p>    
//    `)
//})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then((persons) => {
            console.log('Person list:', persons)
            response.json(persons)
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            responce.json(person)
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedPerson => {
            console.log('Added new person:', savedPerson)
            response.json(savedPerson)
        })
})

app.use(express.static(path.join(__dirname, 'dist')))
 
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

//app.delete('/api/persons/:id', (request, response) => {
//    const id = request.params.id
//    persons = persons.filter(person => person.id !== id)
//
//    response.status(204).end()
//})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})