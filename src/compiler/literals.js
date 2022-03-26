// literals.js

class BaseLiteral {
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

class IntegerLiteral {
  constructor (value) {
    this.value = value;
  }

  run () {
    return this.value;
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

class TrueLiteral {
  constructor () {
    this.value = "true";
  }

  run () {
    return this.value;
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
class FalseLiteral {
  constructor () {
    this.value = "false";
  }

  run () {
    return this.value;
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

class NilLiteral {
  constructor () {
    this.value = "nil";
  }

  run () {
    return this.value;
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


module.exports = {
  TextLiteral:TextLiteral,
  IntegerLiteral:IntegerLiteral,
  TrueLiteral:TrueLiteral,
  FalseLiteral:FalseLiteral,
  NilLiteral:NilLiteral
}
