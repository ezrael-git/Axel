let bundle = {
  declarating: ["imm", "def", "fn"],
  operators: ["+", "-", "/", "*", "="],
  all: bundle.declarating + bundle.operators + ["return"]

}


module.exports = bundle;
