module.exports = class Paren {
  static left = new Paren("(");
  static right = new Paren(")");
  static bundle = [Paren.left,Paren.right];

  constructor (value) {
    this.value = value;
  }

  eval () {
    return this.value;
  }

}
