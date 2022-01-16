// text.js



class Text {
  initialize (value) {
    this.value = value; // raw value
  }
  
  eval () {
    return String(this.value);
  }
}
