// executor / collector / emitter

module.exports = class Emitter {
  constructor (in_it="") {
    this.parsed = "";
  }

  add (n) {
    this.parsed += n + "\n";
  }

  eval () {
    eval(this.parsed);
    console.log("Axel main.js at 0");
  }
}
