const express = require('express')
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const Contact = require('./models/contact')
const app = express()


morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})


app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':body'))
app.use(cors())


const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if(err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  else if(err.name === 'ValidationError') {
    return res.status(400).json({ error:err.message })
  }
  next(err)
}

app.get('/api/persons', (req,res) => {
  Contact.find({})
    .then(contacts => {
      res.json(contacts)
    })
})

app.get('/info',(req,res) => {
  Contact.find({}).
    then(contacts =>
      res.send(`<div>
                <p>Phonebook has info for ${contacts.length}</p>
                <p>${new Date()} people</p>
              </div>`))
})


app.get('/api/persons/:id', (req,res, next) => {
  const id = req.params.id
  console.log(typeof id)
  Contact.findById(id)
    .then(person => {
      if(person) {
        res.json(person)
      }
      else {
        res.status(404).json({ error: `Error, couldn't find id: ${id}` })
      }
    })
    .catch(err => {
      next(err)
    })
})



app.post('/api/persons', (req,res, next) => {
  const body = req.body
  const contacts = []
  Contact.find({})
    .then(respond => {
      contacts.push(respond)
    })

  if(body.name === undefined || body.number === undefined)
    return res.status(404).json({ error: 'missing content' })

  const person = new Contact({
    name: body.name,
    number: body.number,
  })

  console.log(contacts)

  person
    .save()
    .then(result => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      console.log(result)
      res.json(result)
    })
    .catch(err => {
      next(err)
    })

})

app.delete('/api/persons/:id', (req,res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(( ) => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const person = {
    name: name,
    number: number
  }

  Contact.findByIdAndUpdate(req.params.id, person,
    {
      new: true,
      runValidators: true,
      context: 'query'
    })
    .then(updatedContact => {
      console.log(this)
      res.json(updatedContact)
    })
    .catch(err => {
      console.log('moi')
      next(err)})
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))