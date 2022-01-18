// 
const Base = require("./baseclass.js");

module.exports = class ExpectedCharError extends BaseException {

  constructor (pos_start, pos_end, details) {

    super(pos_start, pos_end, 'Expected Character', details)

  }

};



