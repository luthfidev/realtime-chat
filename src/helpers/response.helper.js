module.exports = (response) => {
    return {
        status : response.status || false,
        messsage: response.msg || null,
        data: response.data || {}
    }
}