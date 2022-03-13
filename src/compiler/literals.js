// literals.js

class Literal {
  /* base class */
  constructor (value) {
    this.value = value;
  }

  to_s () {
    return String(this.value);
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class TextLiteral {
  constructor (value) {
    this.value = value;
  }

  run () {
    return this.value;
  }
}

class IntegerLiteral {
  constructor (value) {
    this.value = value;
  }

  run () {
    return this.value;
  }
}

module.exports = {
  TextLiteral:TextLiteral,
  IntegerLiteral:IntegerLiteral
}
