// text.js



module.exports = class Text {
  initialize (value) {
    this.value = value; // raw value
  }
  
  eval () {
    return this.value;
  }
}
