const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]

const url =
    `mongodb+srv://salmans581:${password}@fso.poa3s.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fso`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

const person = new Person({
    name: name,
    number: phoneNumber,
})

if (!name || !phoneNumber) {
    Person.find({}).then(result => {
        console.log('phonebook:\n')
        result.forEach(person => {
            console.log(person.name,' ',person.number)
        })
        mongoose.connection.close()
    })
}
else {
    person.save().then(result => {
        console.log('added', name,' number ', phoneNumber, 'to phonebook')
        mongoose.connection.close()
    })
}