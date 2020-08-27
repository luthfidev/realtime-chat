const {mysql} = require('../utils')

module.exports = {

    login: (data) => {
        const sql = `SELECT * FROM users WHERE email = ?`
        return new Promise((resolve, reject) => {
            mysql.query(sql, data, (error, results) => {
                if(error) {
                    reject(Error(error))
                } else {
                    resolve(results)
                }
            })
        })
    },

    register: (data) => {
        const sql = 'INSERT INTO users SET ?'
        return new Promise((resolve, reject) => {
            mysql.query(sql, data, (error, results) => {
                if(error) {
                    reject(Error(error))
                } else {
                    resolve(results)
                }
            })
        })
    }
}