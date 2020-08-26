const express = require('express')
const authRoute = require('./auth.route')

const router = express.Router()

router.use('/', authRoute)

module.exports = router