let declarating = ["imm", "def", "fn"];
let operators = ["+", "-", "/", "*", "="];
let other = ["end", "return"];

let bundle = {
  declarating: declarating,
  operators: operators,
  all: declarating.concat(operators).concat(other)
}


module.exports = bundle;
