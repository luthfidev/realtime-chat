const mysql = require('mysql')
const config = require('../config/global')
const connection = mysql.createConnection(config.mysql)

module.exports = connection