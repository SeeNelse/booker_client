module.exports = class Errors {

  nomFound() {
    return {
      status: 404,
      statusText: 'Not found'
    }
  }

}