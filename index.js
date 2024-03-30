require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

app.use(express.json())

const morgan = require('morgan')
// app.use(morgan('tiny'))
morgan.token('body', function (req, res) { return `${JSON.stringify(req.body)}` })
app.use(morgan(':method :url :status :res[content-length] - :response-time :body'))

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
// }
// app.use(requestLogger)

// const generateId = () => {
//     const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
//     return maxId + 1
// }

// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     },
//     {
//         "id": 5,
//         "name": "Abramov",
//         "number": "12-43-234345"
//     }
// ]

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people<p><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
        if(person===null)
            console.log('Doesnt exist')
        else
            console.log('fetched => ',person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    }
    else
        response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(body.name === undefined || body.number === undefined){
        return response.status(400).json({error:'name or number is missing'})
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' })
// }
// app.use(unknownEndpoint)

