const mongoose = require('mongoose')

if (process.argv.length < 4) {
  console.log('Use format: node mongo.js <username> <password> [name] [number]')
  process.exit(1)
}

const username = process.argv[2]
const password = process.argv[3]

const name = process.argv[4]
const number = process.argv[5]

const url = `mongodb+srv://${username}:${password}@cluster0.n9d26.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({name, number})
    person
        .save()
        .then(() => {
            console.log(`added ${name} number ${number} to phonebook`)
            //console.log(person)
            mongoose.connection.close()
        })
        .catch((err) => {
            console.error('Error while saving person:', err)
            mongoose.connection.close()
        })
} else {
    Person.find({})
        .then((persons) => {
            console.log('phonebook:')
            persons.forEach((person) => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
        .catch((err) => {
            console.log('Error while fetching people:', err)
        })
}