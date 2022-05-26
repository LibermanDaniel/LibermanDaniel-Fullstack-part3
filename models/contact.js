const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to the db')

mongoose.connect(url, { useNewUrlParser: true})
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log('Error while trying to connect to MongoDB', err.message)
    })

    const contactSchema = new mongoose.Schema({
        id: String,
        name: String,
        number: {
            type:String,
            min: [8],
            validate: {
                validator: (v) => {
                    return /\d(2|3)-/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
            required: [true, `User phone number required`]
        }
    })

    contactSchema.set('toJSON', { 
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
      })

      
module.exports = mongoose.model('Contact', contactSchema)
