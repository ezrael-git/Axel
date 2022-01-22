// executor / collector / emitter

module.exports = class Emitter {
  constructor (in_it="") {
    this.parsed = "";
    this.parsed += in_it;
    this.variables = {};
  }

  add (n) {
    this.parsed += n;
  }

  eval () {
    eval(this.parsed);
    console.log("Axel main.js at 0");
  }
}
