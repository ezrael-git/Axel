// 
const Base = require("./baseclass.js");

module.exports = class UnexpectedToken extends Base {

  constructor (line, token, start, end) {
    this.line = line
    this.message = "Unexpected token " + token
    this.start = start
    this.end = end
  }

};



