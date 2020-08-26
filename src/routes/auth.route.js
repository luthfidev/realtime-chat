const router = require('express').Router()
const {verifyToken, middleware} = require('../middlewares')
const {authController} = require('../controllers')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/token', authController.refreshToken)

module.exports = router