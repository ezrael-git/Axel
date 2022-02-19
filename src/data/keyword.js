let declarating = ["imm", "def", "fn"];
let operators = ["+", "-", "/", "*", "="];

let bundle = {
  declarating: declarating,
  operators: operators,
  all: declarating + operators + ["return"]

}


module.exports = bundle;
