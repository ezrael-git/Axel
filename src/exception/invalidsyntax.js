//
const Base = require("./baseclass.js");


module.exports = class InvalidSyntaxError extends Base {

  constructor (pos_start, pos_end, details='') {
    super(pos_start, pos_end, 'Invalid Syntax', details);
  }




}
