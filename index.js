require('dotenv').config()
const config = require('./src/config/global')

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyparser = require('body-parser')
const cors = require('cors')
const PORT = config.app.app_port // set port
const routes = require('./src/routes')


// cors
var allowlist = ['http://example1.com', 'http://example2.com']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))
app.use(bodyparser.urlencoded({extended: true}))

app.get('/', (request, response) => {
    const data = {
        name:  'api',
        version: '1.0.0'
    }
    response.status(200).send(data)
})

io.on('connection', (socket) => {
    console.log('New user connect')
    socket.on('disconnect', () => {
      console.log('user disconnect')
    })
})

app.use((request, response, next) => {
  request.io = io
  next()
})


// api routes
app.use('/api/v1', routes)

app.get('*', (request, response) => {
    response.status(404).send('Not Found')
})


app.listen(PORT, () => {
    console.log('Server running')
})

module.exports = app