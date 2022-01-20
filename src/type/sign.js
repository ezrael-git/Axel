module.exports = class Sign {
  static signs = {}

  static Div = class Div {
    static value = "/"
    static eval () {
      return value
    }
  }

  static Mul = class Mul {
    static value = "*"
    static eval () {
      return value
    }
  }

  static Add = class Add {
    static value = "+"
    static eval () {
      return value
    }
  }

  static Sub = class Sub {
    static value = "-"
    static eval () {
      return value
    }
  }

  constructor (value) {

    this.value = value;


  }

  static signs () {
    return Sign.signs;
  }

  eval () {
    return this.value;
  }
}
