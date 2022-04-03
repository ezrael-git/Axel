module.exports = class ErrorHandler {

  static throw (title, line, details) {
    if (title == undefined) { title = "ParseError" };
    if (line == undefined) { line = 0 };
    if (details == undefined) { details = "-" };
    throw new Error(`${title}: At line ${line}:\n${details}`);
  }

  static warn (title, line, details) {
    if (title == undefined) { title = "ParseError" };
    if (line == undefined) { line = 0 };
    if (details == undefined) { details = "-" };
    console.log(`(Warning); ${title}: At line ${line}:\n${details}`);
  }
}
