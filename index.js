const express = require('express')

const app = express()

app.use(express.json())

let toDo = [
  {
    task: 'Clean',
    id: '1'
  },
  {
    task: 'Study',
    id: '2'
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Welcome!</h1>')
})

app.get('/api/task', (req, res) => {
  res.json(toDo)
})

app.get('/api/task/:id', (req, res) => {
  const id = req.params.id
  const task = toDo.find(task => task.id === id)
  if(!task) {
    res.status(404).send({ error: 'malformed id' })
  }
  res.json(task)
})

const generateId = () => {
  return String(Math.round(Math.random() * 100000))
}

app.post('/api/task', (req, res) => {
  const taskObject = req.body

  if(!taskObject.task) {
    return res.status(400).send({ error: 'Invalid input' })
  }

  const newTask = {
    task: taskObject.task,
    id: generateId()
  }

  toDo = toDo.concat(newTask)
  res.json(newTask)
})

app.delete('/api/task/:id', (req, res) => {
  const id = req.params.id
  toDo = toDo.filter(task => task.id !== id)
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})