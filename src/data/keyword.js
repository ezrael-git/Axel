let declarating = ["imm", "def", "fn", "meth", "class"];
let operators = ["+", "-", "/", "*", "="];
let other = ["end", "return", "private"];

let bundle = {
  declarating: declarating,
  operators: operators,
  all: declarating.concat(operators).concat(other)
}


module.exports = bundle;
