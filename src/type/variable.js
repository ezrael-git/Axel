module.exports = class Variable {

  constructor (name,value) {
    this.name = name;
    this.value = value;
  }

  eval () {
    return this.value;
  }

}
