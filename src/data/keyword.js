let declarating = ["imm", "def", "fn"];
let operators = ["+", "-", "/", "*", "="];

function merge (one,two) {
  let three = [];
  for (let a of one) {
    three.push(a)
  }
  for (let b of two) {
    three.push(b)
  }
  return three;
}
let bundle = {
  declarating: declarating,
  operators: operators,
  all: merge(merge(declarating,operators), ["return", "end"])

}


module.exports = bundle;
