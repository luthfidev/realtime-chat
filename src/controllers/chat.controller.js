const Moment = require('moment')
const Jwt = require('jsonwebtoken')
const config = require('../config/global')
const {chatModel} = require('../models')

module.exports = {
    addChat: async(request, response) => {
        try {
            const {message, sendto} = request.body
            if (message === '' || sendto === '') {
                response.status(400).send({
                    success: false,
                    message: 'Must be fill'
                })
            } else {
                const payloadToken = request.payload
                const data = {
                    id_users: payloadToken.id,
                    messages: message,
                    id_sendTo: sendto,
                }
    
                const result = await chatModel.addMessage(data)
                
                request.io.emit('chat', result)
                response.status(201).send({
                    success: true,
                    message: 'chat has been send'
                })

            }

        } catch (error) {
            response.status(400).send({
                success: false,
                message: 'Something wrong'
            })
        }
    },

    getAllMessage: async(request, response) => {
        try {
            const {sendto} = request.params
            if (sendto === '') {
                response.status(400).send({
                    success: false,
                    message: 'id sendto not found'
                })
            } else {
                const payloadToken = request.payload
                console.log(payloadToken)
                const data = {
                    id_users: payloadToken.id,
                    id_sendTo: parseInt(sendto)
                }
                const result = await chatModel.getAllMessage(data)
                response.status(200).send({
                    success: true,
                    message: 'success get all message',
                    data: result
                })
            }
        } catch (error) {
            response.status(400).send({
                success: false,
                message: 'Something wrong'
            })            
        }
    },
}