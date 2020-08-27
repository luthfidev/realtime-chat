const {mysql} = require('../utils')

module.exports = {
        addMessage: (data) => {
            const sql = `INSERT INTO messages set ?`
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
        getAllMessage: (data) => {
            console.log(data)
            const sql = `SELECT * 
                         FROM messages 
                         WHERE id_users = ? 
                         AND id_sendTo = ? 
                         OR id_users = ? 
                         AND id_sendTo = ?`
            return new Promise((resolve, reject) => {
                mysql.query(sql, [data.id_users,data.id_sendTo,data.id_sendTo,data.id_users], (error, results) => {
                    if(error) {
                        reject(Error(error))
                    } else {
                        resolve(results)
                    }
                })
            })
        },

        
    
}