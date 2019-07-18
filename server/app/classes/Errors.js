module.exports = class Errors {

  notFound() {
    return {
      status: 404,
      statusText: 'Not found'
    }
  }

}