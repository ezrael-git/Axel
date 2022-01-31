imm Lexer = require("./lexer.js")
imm Parser = require("./parser.js")

fn log (expr)
  console.log(expr)
end

fn include (path)
  return require(path)
end

fn compile (statements)
  statements = statements.trim().split('\n')
  for line in statements
    def lexer = new Lexer(line);
    def lex = lexer.lex();
    this.parser.parse(lex,line);
  end
  this.emitter.add(this.parser.emitted);
  this.emitter.eval();
end
