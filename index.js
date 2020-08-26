require('dotenv').config()
const config = require('./src/config/global')

const express = require('express')
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

const app = express()
app.use(cors(corsOptionsDelegate))
app.use(bodyparser.urlencoded({extended: true}))

app.get('/', (request, response) => {
    const data = {
        name:  'api',
        version: '1.0.0'
    }
    response.status(200).send(data)
})
 
app.get('*', (request, response) => {
    response.status(404).send('Not Found')
})

// api routes
app.use('/api/v1', routes)



app.listen(PORT, () => {
    console.log('Server running')
})

module.exports = app