// unknowninitializer.js
const BaseException = require("./baseclass.js");

module.exports = class UnknownInitializer extends BaseException {
  constructor (line,init) {
    const errorMessage = `Line ${line} at ${init} : unknown Initializer`;
    console.log(errorMessage);
  }
};



