const express = require('express')
const authRoute = require('./auth.route')
const chatRoute = require('./chat.route')

const router = express.Router()

router.use('/auth', authRoute)
router.use('/chat', chatRoute)

module.exports = router