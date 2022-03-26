// integer.js
const Text = require("./text.js");


module.exports = class Integer {
  constructor (value) {
    for (let char of String(value)) {
      if (![0,1,2,3,4,5,6,7,8,9].includes(char)) {
        throw new Error(`Integer.value must be numbers`)
      }
    }
    this.value = value
  }
  
  toText () {
    return new Text(this.value);
  }

}
