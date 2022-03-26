// text.js



module.exports = class Text {
  constructor (value) {
    this.value = value; // raw value
  }
  
  each (body) {
    for (let char of value) {
      eval(body)
    }
  }
}
