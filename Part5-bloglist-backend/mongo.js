//Accés a la base de dades per línia de comandos
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://carmeg:${password}@cluster0.lioxe.mongodb.net/person-app?retryWrites=true`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('persons', personSchema)

const person = new Person({
  name: name,
  number: number
})

if (name && number)
{
  person.save().then(result => {
    console.log('added ' + name + ' number ' + number + ' to phonebook !!' )
    mongoose.connection.close()
  })
}

Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })