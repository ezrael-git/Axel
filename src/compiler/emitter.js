// executor / collector / emitter

module.exports = class Emitter {
  constructor (in_it="") {
    this.variables = {};
    this.parsed = "let v = " + this.variables + "\n"; // JS code to be executed
    this.parsed += in_it;
  }

  refresh_vars () {
    this.parsed += "v = this.variables\n";
  }

  add (n) {
    this.parsed += n + "\n";
  }

  eval () {
    eval(this.parsed);
    console.log("Axel main.js at 0");
  }
}
