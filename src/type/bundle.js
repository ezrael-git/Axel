// bundle.js
const Text = require("./text.js");
const Digit = require("./digit.js");
const Hash = require("./hash.js");




let exposed = [Text,Digit,Hash];

module.exports = exposed
