const config = {
    mysql : {
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        port     : process.env.DB_PORT
    },
    app : {
        app_port    : process.env.APP_PORT,
        secret_key  : process.env.TOKEN_SECRET,
        algorithm   : process.env.TOKEN_ALGORITHM,
        refresh_key : process.env.TOKEN_SECRET_REFRESH
    }
}

module.exports = config