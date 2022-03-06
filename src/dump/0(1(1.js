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
  }

  next () {
    this.token_iterated += 1;
    let n = this.tokens[this.token_iterated];
    return n;
  }

  previous () {
    this.token_iterated -= 1;
    let n = this.tokens[this.token_iterated];
    return n;
  }

  current () {
    return this.tokens[this.token_iterated];
  }

  peek (tokens=1) {
    return this.tokens.slice(this.token_iterated,this.token_iterated + tokens);
  }

  lookBack (tokens=1) {
    return this.tokens.slice(this.token_iterated,this.token_iterated - tokens);
  }

  handleType (token) {
    if (token.type == "STRING") {
      return new Node.TextNode(token.value,token.line,token.start,token.end);
    }
    else if (token.type == "INTEGER") {
      return new Node.IntegerNode(token.value,token.line,token.start,token.end);
    }
  }


  
  
  parse (tks) {
    /*
    parse line and return node
    */
    this.line += 1;
    this.tokens = tks;
    this.token_iterated = -1;

    let node_tree = [];
    while (this.peek() != undefined) {
      let token = this.next();
      let type = token.type;
      if (type == "PLUS") {
        let lhs = this.lookBack();
        let rhs = this.peek();
        let node = new Node.BinaryOperatorNode(lhs,rhs,"+");
        node_tree.push(node);
      }
      else if (type == "MINUS") {
        let lhs = this.lookBack();
        let rhs = this.peek();
        let node = new Node.BinaryOperatorNode(lhs,rhs,"-");
        node_tree.push(node);
      }
      else if (type == "MULTIPLY") {
        let lhs = this.lookBack();
        let rhs = this.peek();
        let node = new Node.BinaryOperatorNode(lhs,rhs,"*");
        node_tree.push(node);
      }
      else if (type == "DIVIDE") {
        let lhs = this.lookBack();
        let rhs = this.peek();
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
        let body = this.parse() // unfinished
        let node = new Node.FuncAssignNode(identifier_token.tk,token.line,token.start,token.end,args,body);
        node_tree.push(node);
      }
    }

    return node_tree;
  }



}

