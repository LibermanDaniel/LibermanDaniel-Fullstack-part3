const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan("tiny"))
app.use(morgan(':body'))
app.use(cors())

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 1000000000)
}

const checkUniqueName = (contacts, name) => {
    return contacts.some(contact => contact.name.includes(name))
}

app.get("/api/persons", (req,res) => {
    res.json(contacts)
})

app.get("/info",(req,res) => {
    res.send(`<div>
                <p>Phonebook has info for ${contacts.length}</p>
                <p>${new Date()}</p>
              </div>`)
})

app.get("/api/persons/:id", (req,res) => {
    const id = Number(req.params.id)
    const contact = contacts.find(contact => contact.id === id)

    if(contact) res.json(contact)
    else {
        res.statusMessage = `Error, couldn't find id: ${id}`
        res.status(404).end()
    }
    
})

app.post("/api/persons", (req,res) => {
    const body = req.body
    
    if(!body.name && !body.number) {
        res.status(404).json({error: 'Name and number are missing'})
    }
    else if(!body.name) {
        res.status(404).json({error: 'Name is missing'})
    }
    else if(!body.number) {
        res.status(404).json({error: 'Number is missing'})
    }
    
    else if(checkUniqueName(contacts, body.name)) {
        res.status(404).json({error: `${body.name} already exists - please choose a unique name`})
    }

    else {

        const contact = {
            "id": generateId(),
            "name": body.name, 
            "number": body.number
        }
        contacts = contacts.concat(contact)

        res.json(contact)
    }

})

const PORT = process.env.PORT ||3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

