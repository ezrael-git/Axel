// parser.js
// generate AST

const Node = require("./nodes.js");
const Scanner = require("./scanner.js");




module.exports = class Parser {
  constructor () {
    this.variables = {};
    this.token_iterated = -1;
    this.tokens = [];
    this.line = 0;
    
    this.lineTokens = {};
    this.ast = {};
  }

  next () {
    /*
    Next token
    */
    this.token_iterated += 1;
    let n = this.tokens[this.token_iterated];
    return n;
  }

  previous () {
    /*
    Previous token
    */
    this.token_iterated -= 1;
    let n = this.tokens[this.token_iterated];
    return n;
  }

  current () {
    /* 
    Current token
    */
    return this.tokens[this.token_iterated];
  }

  peek (tokens=1) { // fix
    /*
    Get next token without incrementing token_iterated
    */
    return this.tokens[this.token_iterated+1];
  }

  lookBack (tokens=1) { // fix
    /*
    Get previous token without de-incrementing token_iterated
    */
    return this.tokens[this.token_iterated - 1];
  }
  
  nextLine () {
    /*
    Get next line in lineTokens
    */
    this.line += 1;
    return this.lineTokens[this.line]
  }
  
  previousLine () {
    /*
    Get previous line in lineTokens
    */
    this.line -= 1;
    return this.lineTokens[this.line]
  }

  peekLine (l=1) {
    /*
    Peek forward in lineTokens without changing this.line
    */
    return this.lineTokens[this.line + l];
  }

  lookBackLine (l=1) {
    /*
    Peek backwards in lineTokens without changing this.line
    */
    return this.lineTokens[this.line - l];
  }
  
  currentLine () {
    /*
    Get current line in lineTokens
    */
    return this.lineTokens[this.line]
  }

  handleType (token) {
    /*
    Make node based on token.type
    */
    if (token.type == "STRING") {
      return new Node.TextNode(token.value,token.line,token.start,token.end);
    }
    else if (token.type == "INTEGER") {
      return new Node.IntegerNode(token.value,token.line,token.start,token.end);
    }
  }

  recursiveParse (tokens) {
    /*
    Parse tokens from a new instance of the Parser
    */
    let parser = new Parser();
    let node_tree = parser.parse(tokens);
    return node_tree;
  }


  
  
  parse (lineTokens) {
    /*
    Parse code and return the AST.Program
    Arguments:
      lineTks must be an Object containing { line : tokens }
    */
    this.lineTokens = lineTokens;
    let ast = [];
    while (this.peekLine() != undefined) {
      let tokens = this.nextLine();
      this.tokens = tokens;
      this.token_iterated = -1;
  
      let node_tree = [];
      while (this.peek() != undefined) {
        let token = this.next();
        console.log("TOKEN " + JSON.stringify(token));
        let type = token.type;
        if (type == "PLUS") {
          let lhs = this.lookBack().tk;
          let rhs = this.peek().tk;
          let node = new Node.BinaryOperatorNode(lhs,rhs,"+");
          node_tree.push(node);
        }
        else if (type == "MINUS") {
          let lhs = this.lookBack().tk;
          let rhs = this.peek().tk;
          let node = new Node.BinaryOperatorNode(lhs,rhs,"-");
          node_tree.push(node);
        }
        else if (type == "MULTIPLY") {
          let lhs = this.lookBack().tk;
          let rhs = this.peek().tk;
          let node = new Node.BinaryOperatorNode(lhs,rhs,"*");
          node_tree.push(node);
        }
        else if (type == "DIVIDE") {
          let lhs = this.lookBack().tk;
          let rhs = this.peek().tk;
          let node = new Node.BinaryOperatorNode(lhs,rhs,"/");
          node_tree.push(node);
        }
        else if (type == "DEFINE") {
          let name_token = this.next();
          if (this.next().type != "EQUALITY") {
            throw new Error(`Expected TokenType to be EQUALITY, got ${this.current().type} instead`);
          }
          let value_token = this.next();
          let value_node = this.handleType(value_token);
          let node = new Node.VarAssignNode(name_token.tk,true,value_token.type,value_node,token.line,token.start,value_token.end);
          node_tree.push(node);
        }
        else if (type == "IMMUTABLE") {
          let name_token = this.next();
          if (this.next().type != "EQUALITY") {
            throw new Error(`Expected TokenType to be EQUALITY, got ${this.current().type} instead`);
          }
          let value_token = this.next();
          let value_node = this.handleType(value_token);
          let node = new Node.VarAssignNode(name_token.tk,false,value_token.type,value_node,token.line,token.start,value_token.end);
          node_tree.push(node);
        }
        else if (type == "FUNCTION") {
          let identifier_token = this.next();
          if (this.next().type != "LPAREN") {
            throw new Error(`Expected TokenType to be LPAREN, got ${this.current().type} instead`);
          }
          let args = [];
          while (this.next().type == "IDENTIFIER") {
            let arg_token = this.current();
            let arg_node = new Node.ArgNode(arg_token.tk,arg_token.line,arg_token.start,arg_token.end);
            args.push(arg_node);
          }
          if (this.next().type != "RPAREN") {
            throw new Error(`Expected TokenType to be RPAREN, got ${this.current().type} instead`);
          }
          let body = [];
          while (this.nextLine(false)[0].type != "END") {
            let tokens_lite = this.nextLine();
            let node_tree_lite = this.recursiveParse(tokens_lite);
            body.push(node_tree_lite);
          }
          let node = new Node.FuncAssignNode(identifier_token.tk,token.line,token.start,token.end,args,body);
          node_tree.push(node);
        }
      }
  
      ast = ast.concat(node_tree);
    }
    return ast;
  }

  wrap (ast) {
    /*
    Wrap the AST from Parser.parse nicely
    */
    let new_ast = {};
    new_ast["Program"] = ast;
    let tokens = 0;
    for (let line_number in this.lineTokens) {
      tokens += this.lineTokens[line_number].length;
    }
    let name = "main.ax";
    new_ast["tokens"] = tokens;
    new_ast["name"] = name;
    return new_ast;
  }
    



}

