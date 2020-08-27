const Jwt =  require('jsonwebtoken')
const Joi = require('joi')
const Bcrypt = require('bcrypt')
const saltRounds = 10
const {authModel} = require('../models')
const config = require('../config/global')

module.exports = {
    register: async (request, response) => {
       try {
           const {name, email, password} = request.body
           const passwordHash = await Bcrypt.hashSync(password, saltRounds)
           const isExistEmail = await authModel.login(email)
           if (isExistEmail.length < 1) {
               const registerData = {
                   name,
                   email,
                   password: passwordHash
               }
               if (isExistEmail) {
                await authModel.register(registerData)  
                response.status(201).send({
                    success: true,
                    message: 'Register success'})
               } else {
                   response.status(400).send({
                       success: false,
                       message: 'Register failed'})
               }
           } else {
               response.status(400).send({
                   success: false,
                   message: 'Email is exist'})
           }
       } catch (error) {
           response.status(400).send({
               success: false,
               message: 'Something wrong'})
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
                            name: user[0].name,
                        }
                        const token = Jwt.sign(payload, config.app.secret_key, 
                            {
                                expiresIn: '1d',
                                algorithm: config.app.algorithm
                            })
                        const refreshToken = Jwt.sign(payload, config.app.refresh_key,{expiresIn : '7d'})
                            response.status(200).header({'Authorization': token, 'refreshtoken': refreshToken}).send({
                                success: true,
                                message: 'Password match',
                                data: {
                                    id: user[0].id,
                                    email: user[0].email,
                                    name: user[0].name
                                },
                                token: token,
                                refreshToken: refreshToken
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
                success: false,
                message: 'Something wrong'
            })
        } 
    },

    refreshToken: async (request, response) => {
        try {
            if (request.headers.refreshtoken) {
                const getUserToken = await Jwt.verify(request.headers.refreshtoken, config.app.refresh_key)
                delete getUserToken.exp
                delete getUserToken.iat

                const token = await Jwt.sign(getUserToken, config.app.secret_key, {expiresIn: '1d'})
                const refreshToken = await Jwt.sign(getUserToken, config.app.refresh_key, {expiresIn: '7d'})

                response.status(201).send({
                    success: true,
                    message: 'Refresh token success',
                    data: {
                        token: token,
                        refreshToken: refreshToken
                    }
                })

            } else {
                response.status(400).send({
                    status: false,
                    message: 'Failed refresh token'
                })
            }

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                response.status(400).send({
                    success: false,
                    message: 'Token expired'
                })
            } else {
                response.status(400).send({
                    success: false,
                    message: 'Token Invalid refresh'
                })
            }
        }
    }
}