module.exports = class Identifier {
  constructor (name,value=undefined) {
    this.name = name;
    this.value = value;
  }

  eval () {
    return this.value;
  }
}
