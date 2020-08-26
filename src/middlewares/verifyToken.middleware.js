const Jwt = require('jsonwebtoken')
const config = require('../config/global')

module.exports = {
    verifyToken: async (request, response, next) => {
        const bearerHeader = request.header('Authorization')
        if(!bearerHeader || bearerHeader.indexOf(' ') === -1) {
            return response.status(401).send({
                success: false,
                message: 'Missing Authorization Header'
            })
        } 
        const token = bearerHeader.split(' ')[1]
        if(!token) return response.status(401).send({
            success: false,
            message: 'Access denied'
        })
        
        try {
            const verified = await Jwt.verify(token, config.app.secret_key)
            request.payload = verified
            next()
            } catch (error) {
            return response.status(400).send({
                success: false,
                message: 'Invalid Token'
            })
        }
    }
} 