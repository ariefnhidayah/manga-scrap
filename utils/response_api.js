function responseAPI(isSuccess = false, data = null, message = 'Something went wrong!') {
  return {
    success: isSuccess,
    data: data,
    message: message
  }
}

module.exports = responseAPI