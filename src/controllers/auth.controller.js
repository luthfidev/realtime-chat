const Jwt =  require('jsonwebtoken')
const Joi = require('joi')
const Bcrypt = require('bcrypt')
const saltRounds = 10
const {authModel} = require('../models')
const config = require('../config/global')
const { res } = require('../helpers')


module.exports = {
    register: async (request, response) => {
       try {
           const {email, password} = request.body
           const passwordHash = await Bcrypt.hashSync(password, saltRounds)
           const isExistEmail = await authModel.login(email)
           if (isExistEmail.length < 1) {
               const registerData = {
                   email,
                   password: passwordHash
               }
               if (isExistEmail) {
                const results = await authModel.register(registerData)  
                response.status(201).send({
                    'success': true,
                    'message': 'Register success'})
               } else {
                   response.status(400).send({
                       'success': false,
                       'message': 'Register failed'})
               }
           } else {
               response.status(400).send({
                   'success': false,
                   'message': 'Email is exist'})
           }
       } catch (error) {
           response.status(400).send({
               'success': false,
               'message': 'Something wrong'})
       }
    },

    login: async (request, response) => {
        try {
            const {email, password} = request.body
            const user = await authModel.login(email)
            if (user.length > 0) {
                const userPassword = user[0].password
                await Bcrypt.compare(password, userPassword, (error, isMatch) => {
                    if (error) {
                        response.status(400).send({
                            success: false,
                            message: 'Failed match password'
                        })
                    } else if (!isMatch) {
                        response.status(400).send({
                            success: false,
                            message: 'Password not match'
                        })
                    } else {
                        const payload = {
                            id: user[0].id,
                            email: user[0].email,
                            role: user[0].nameRole,
                            nameUser: user[0].nameUser
                        }
                        const token = Jwt.sign(payload, config.app.secret_key, 
                            {
                                expiresIn: '1d',
                                algorithm: config.app.algorithm
                            })
                            response.status(200).header('Authorization', token).send({
                                success: true,
                                message: 'Password match',
                                data: {
                                    id: user[0].id,
                                    email: user[0].email,
                                    role: user[0].nameRole
                                },
                                token: token
                            })
                    }
                })
            } else {
                response.status(400).send({
                    success: false,
                    message: 'Email not found'
                })
            }
        } catch (error) {   
            response.status(400).send({
                'success': false,
                'message': 'Something wrong'
            })
        } 
    }
}