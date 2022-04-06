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

class StringLiteral {
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

class FunctionLiteral {
  constructor (name, args, body) {
    this.name = name;
    this.value = name;
    this.args = args;
    this.body = body; // statements
  }

  run (v,w) {
    return this.name;
  }

  to_s () {
    return this.name;
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class CallLiteral {
  constructor (value, args) {
    this.value = value;
    this.args = args;
  }

  to_s () {
    return this.value;
  }

  to_i () {
    return parseInt(this.value);
  }

  to_b () {
    return !!this.value;
  }
}

class VariableLiteral {
  constructor (value) {
    this.value = value;
  }

  to_s () {
    return this.value;
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
  NilLiteral:NilLiteral,
  FunctionLiteral:FunctionLiteral,
  CallLiteral:CallLiteral,
  VariableLiteral:VariableLiteral
}
