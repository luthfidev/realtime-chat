const {mysql} = require('../utils')

module.exports = {

    login: (data) => {
        const sql = `SELECT users.id, 
                            users.email, 
                            users.password, 
                            roles.name as nameRole, 
                            user_details.name as nameUser FROM users 
                     JOIN roles ON roles.id = users.role_id 
                LEFT JOIN user_details ON user_details.user_id = users.id WHERE users.email = ?`
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