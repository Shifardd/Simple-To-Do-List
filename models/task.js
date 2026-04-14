const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log(`Connecting to ${url}`)
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('Successfully connected to MongoDB')
  })
  .catch(error => {
    console.log(error.message)
  })

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true
  },
  priority: Boolean
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', taskSchema)