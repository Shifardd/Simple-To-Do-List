require('dotenv').config()
const Task = require('./models/task')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))


app.get('/', (req, res) => {
  res.send('<h1>Welcome!</h1>')
})

app.get('/api/task', (req, res) => {
  Task.find({})
    .then(tasks => {
      res.json(tasks)
    })
})

app.get('/api/task/:id', (req, res, next) => {
  Task.findById(req.params.id)
    .then(specificTask => {
      if(specificTask) {
        res.json(specificTask)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.post('/api/task', (req, res, next) => {
  const taskObject = req.body

  if(!taskObject.task) {
    return res.status(400).send({ error: 'Invalid input' })
  }

  const newTask = new Task({
    task: taskObject.task
  })

  newTask.save()
    .then(task => {
      res.json(task)
    })
    .catch(error => next(error))
})

app.delete('/api/task/:id', (req, res, next) => {
  Task.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'CastError') {
    return res.status(404).json({ error: 'malformed id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})