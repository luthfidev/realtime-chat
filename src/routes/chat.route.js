const router = require('express').Router()
const {verifyToken, middleware} = require('../middlewares')
const {chatController} = require('../controllers')

router.get('/allmessage/:sendto', middleware.verifyToken, chatController.getAllMessage)
router.post('/addchat', middleware.verifyToken, chatController.addChat)


module.exports = router