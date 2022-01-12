// text.js



class Text {
  initialize (value) {
    this.value = value; // raw value
  }
  
  execute () {
    return String(this.value);
  }
}
