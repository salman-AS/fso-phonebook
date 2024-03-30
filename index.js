require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

// const morgan = require('morgan')
// app.use(morgan('tiny'))
// morgan.token('body', function (req, res) { return `${JSON.stringify(req.body)}` })
// app.use(morgan(':method :url :status :res[content-length] - :response-time :body'))

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

// const generateId = () => {
//     const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
//     return maxId + 1
// }

// let persons = [
// ]

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1><p>Fix your frontend</p>')
})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})

app.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            response.send(
                `<h1>
                    <p>Phonebook has info for ${persons.length} people<p>
                    <p>${Date()}</p>
                </h1>`
            )
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => error(next))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
    // Temp fix for the reloading error after deletion
    // Person.find({}).then(persons => {
    //     response.json(persons)
    // })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name or number is missing' })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}
app.use(errorHandler)