const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]  

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`
        <p>Phonebook has info for  ${persons.length} people</p>
        <p>${date}</p>    
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        id: String(Math.floor(Math.random() * 1000)),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})