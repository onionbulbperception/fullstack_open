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

app.get('/info', (request, response, next) => {
    // https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/
    Person.countDocuments({})
        .then((count) => {
            response.send(`
                <p>Phonebook has info for  ${count} people</p>
                <p>${new Date()}</p>
            `)  
        })
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then((person) => {
            response.json(person)
        })
        .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).json({ error: 'person not found' })
            }
        })
        .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
        .catch((error) => next(error))
})

app.use(express.static(path.join(__dirname, 'dist')))
 
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
    const updatePerson = { name, number }

    // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
    // options: Return the modified document, validate against the model's schema, 
    Person.findByIdAndUpdate(
        request.params.id,
        updatePerson,
        { new: true, runValidators: true, context: 'query' }
    )
        .then((result) => {
            if (result) {
                response.json(result)
            } else {
                response.status(404).json({ error: 'Person not found' })
            }
        })
        .catch((error) => next(error))
})

// Error handling
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})