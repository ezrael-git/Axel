// text.js



module.exports = class Text {
  constructor (value) {
    this.value = String(value); // raw value
  }
  
  eval () {
    return this.value.replaceAll('"', '').replaceAll("'", "");
  }
}
