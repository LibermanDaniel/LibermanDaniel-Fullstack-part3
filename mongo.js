const mongoose = require('mongoose')

const password = process.argv[2]

if (!password) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}


const name = process.argv[3]
const number = process.argv[4]

if (name && !number) {
    console.log("Please provide a number: node mongo.js <password> <name> <number>")
    console.log("If your name contains spaces please enclose the name between \"<name>\" ")    
    process.exit(1)
}

if(process.env.length > 5) {
    console.log("Too many arguments")
    process.exit(1)
}
const url = `mongodb+srv://admin123:${password}@fullstackopen.qpqe6.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (!name && !number) {
    Contact.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
        process.exit(1)
    })
}
else {
    const contact = new Contact({
        id: Number(Math.random()*10000000),
        name: name,
        number: number
    })

    contact
        .save()
        .then(result => {
            console.log(`added ${contact.name} number ${contact.number} to phonebook`)
            mongoose.connection.close()
        })
}

