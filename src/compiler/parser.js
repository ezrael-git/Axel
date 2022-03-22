// parser.js
// generate AST

const Node = require("./nodes.js");
const Literal = require("./literals.js");
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

  next (safety=false) {
    /*
    Next token
    */
    this.token_iterated += 1;
    let n = this.tokens[this.token_iterated];
    if (n == undefined && safety == true) {
      return {0:0}
    }
    return n;
  }

  allAfter () {
    this.token_iterated += 1;
    let n = this.tokens.slice(this.token_iterated,this.tokens.length);
    this.token_iterated = this.tokens.length;
    return n;
  }

  allAfterSort (types) {
    let sorted = [];
    for (let token of this.tokens.slice(this.token_iterated,this.tokens.length)) {
      if (types.includes(token.type)) {
        sorted.push(token);
      }
    }
    return sorted;
  }

  allBeforeSort (types) {
    let sorted = [];
    for (let token of this.tokens.slice(0,this.token_iterated)) {
      if (types.includes(token.type)) {
        sorted.push(token);
      }
    }
    return sorted;
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

  peek (safety=false) { // fix
    /*
    Get next token without incrementing token_iterated
    */
    if (safety == false) {
      return this.tokens[this.token_iterated+1];
    } else {
      if (this.tokens[this.token_iterated+1] == undefined) {
        return {type:"undefined",line:0,start:0,end:0}
      }
      else {
        return this.tokens[this.token_iterated+1];
      }
    }
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
    let o = this.lineTokens[this.line]
    return o;
  }


  recursiveParse (tokens, oneline=true) {
    /*
    Parse tokens from a new instance of the Parser
    */
    let parser = new Parser();
    let node_tree = "";
    if (oneline == true) {
      node_tree = parser.parse({1:tokens});
    } else {
      node_tree = parser.parse(tokens);
    }
    return node_tree;
  }

  operatorCheck () {
    if (!["PLUS","MINUS","DIVIDE","MULTIPLY","COMPARE", "COMPAREOPP"].includes(this.peek(true).type)) {
      return true; // good to go!
    }
    else {
      return false;
    }
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
        // handle...
        // addition operator
        if (type == "PLUS") {
          let lhs = this.recursiveParse([this.lookBack()]);
          let rhs = this.recursiveParse([this.peek()]);
          let node = new Node.BinaryOperatorNode(lhs,rhs,"+");
          node_tree.push(node);
        }
        // subtraction operator
        else if (type == "MINUS") {
          let lhs = this.lookBack().tk;
          let rhs = this.peek().tk;
          let node = new Node.BinaryOperatorNode(lhs,rhs,"-");
          node_tree.push(node);
        }
        // multiplication operator
        else if (type == "MULTIPLY") {
          let lhs = this.lookBack().tk;
          let rhs = this.peek().tk;
          let node = new Node.BinaryOperatorNode(lhs,rhs,"*");
          node_tree.push(node);
        }
        // division operator
        else if (type == "DIVIDE") {
          let lhs = this.lookBack().tk;
          let rhs = this.peek().tk;
          let node = new Node.BinaryOperatorNode(lhs,rhs,"/");
          node_tree.push(node);
        }
        // comparison operator
        else if (type == "COMPARE") {
          let lhs = this.recursiveParse([this.lookBack()])
          let rhs = this.recursiveParse([this.next()])
          let node = new Node.BinaryOperatorNode(lhs[0],rhs[0],"==");
          node_tree.push(node);
        }
        else if (type == "COMPAREOPP") {
          console.log("ENTERED COMPAREOPP");
          let lhs = this.recursiveParse([this.lookBack()])
          let rhs = this.recursiveParse([this.next()])
          let node = new Node.BinaryOperatorNode(lhs[0],rhs[0],"!=");
          node_tree.push(node);
        }
        // def keyword
        else if (type == "DEFINE") {
          let name_token = this.next();
          if (this.next().type != "EQUALITY") {
            throw new Error(`Expected TokenType to be EQUALITY, got ${this.current().type} instead`);
          }
          let value_tokens = this.allAfter();
          // Since recursiveParse returns a full-blown AST generated from a bunch of statements,
          // we need to get the first element of the AST and assume it's the value. 

          let value_node = this.recursiveParse(value_tokens)[0];
          let node = new Node.VarAssignNode(name_token.tk,true,value_node.constructor.name,value_node,token.line,token.start,value_tokens[value_tokens.length-1].end);
          node_tree.push(node);
        }
        // imm keyword
        else if (type == "IMMUTABLE") {
          let name_token = this.next();
          if (this.next().type != "EQUALITY") {
            throw new Error(`Expected TokenType to be EQUALITY, got ${this.current().type} instead`);
          }
          let value_token = this.next();
          // Refer to the comments above to figure out why we're assuming the first element of the AST of recursiveParse as the value,
          // instead of the whole AST.
          let value_node = this.recursiveParse([value_token])[0];
          let node = new Node.VarAssignNode(name_token.tk,false,value_token.type,value_node,token.line,token.start,value_token.end);
          node_tree.push(node);
        }
        // fn keyword
        else if (type == "FUNCTION") {
          let identifier_token = this.next();
          if (this.next().type != "LPAREN") {
            throw new Error(`Expected TokenType to be LPAREN, got ${this.current().type} instead`);
          }
          let args = [];
          while (this.peek().type == "IDENTIFIER") {
            let arg_token = this.next();
            let arg_node = new Node.ArgNode(arg_token.tk,arg_token.line,arg_token.start,arg_token.end);
            args.push(arg_node);
          }
          if (this.next().type != "RPAREN") {
            throw new Error(`Expected TokenType to be RPAREN, got ${this.current().type} instead`);
          }
          let body = [];
          while (this.currentLine()[0].type != "END") {
            let tokens_lite = this.nextLine();
            console.log("TOKENS LITE " + JSON.stringify(tokens_lite));
            console.log(typeof tokens_lite);
            let node_tree_lite = this.recursiveParse(tokens_lite);
            body = body.concat(node_tree_lite);
          }
          let node = new Node.FuncAssignNode(identifier_token.tk,token.line,token.start,token.end,args,body);
          node_tree.push(node);
        }
        // print keyword
        else if (type == "PRINT") {
          let value_tokens = this.allAfter();
          let value_node = this.recursiveParse(value_tokens)[0];
          let node = new Node.PrintNode(value_node,value_tokens[0].line,value_tokens[0].start,value_tokens[value_tokens.length-1].end);
          node_tree.push(node);
        }
        // if keyword
        else if (type == "IF") {
          const copy_token = token;
          let condition_tokens = this.allAfter();
          let condition_node = this.recursiveParse(condition_tokens)[0];
          let statements = [];
          while (this.currentLine()[0].type != "END") {
            let tokens_lite = this.nextLine();
            let node_tree_lite = this.recursiveParse(tokens_lite);
            statements = statements.concat(node_tree_lite);
            if (this.peekLine() == undefined) { break };
          }
          let if_node = new Node.IfNode(condition_node,statements,copy_token.line,copy_token.start,token.end);
          // go through the next few lines checking if there are any elif statements
          // this is so we can build a proper if-elif-else chain if possible
          let elif_tokens = {};
          let elif_it = 0;

          console.log("PEEKLINE " + JSON.stringify(this.peekLine()));
          if (this.peekLine()[0].type == "ELIF") {
            console.log("ELIF STATEMENT CAUGHT");
            this.nextLine();
            while (this.currentLine()[0].type != "END") {
              if (elif_it == 0) {
                this.previousLine();
              }
              let tks_lite = this.nextLine();
              elif_it += 1;
              console.log("ADDING " + JSON.stringify(tks_lite));
              elif_tokens[elif_it] = tks_lite
            }
          }
          console.log("ELIF TOKENS " + JSON.stringify(elif_tokens));
          let elif_nodes = this.recursiveParse(elif_tokens,false);
          console.log("ELIF NODES " + JSON.stringify(elif_nodes));
      
          // now that we have elif nodes, we should look for an else statement
          let else_tokens = {};
          let else_it = 0;
          if (this.peekLine()[0].type == "ELSE") {
            this.nextLine();
            while (this.currentLine()[0].type != "END") {
              if (else_it == 0) {
                this.previousLine();
              }
              let tks_lite = this.nextLine();
              else_it += 1;
              console.log("ADDING " + JSON.stringify(tks_lite));
              else_tokens[else_it] = tks_lite
            }
          }
          console.log("ELSE TOKENS " + JSON.stringify(else_tokens));
          let else_node = this.recursiveParse(else_tokens,false);
          console.log("ELSE NODE " + JSON.stringify(else_node));

          // finally we can construct the chain
          let chain = [if_node].concat(elif_nodes).concat(else_node);
          let node = new Node.IfChainNode(chain,chain[0].line,chain[0].start,chain[chain.length-1].end);
          node_tree.push(node);
        }
        // elif keyword, to be catched by the if line
        else if (type == "ELIF") {
          const copy_token = token;
          let condition_tokens = this.allAfter();
          let condition_node = this.recursiveParse(condition_tokens)[0];
          let statements = [];
          while (this.currentLine()[0].type != "END") {
            let tokens_lite = this.nextLine();
            let node_tree_lite = this.recursiveParse(tokens_lite);
            statements = statements.concat(node_tree_lite);
            if (this.peekLine() == undefined) { break };
          }
          let node = new Node.ElifNode(condition_node,statements,copy_token.line,copy_token.start,token.end);
          node_tree.push(node);
        }
        // else keyword, to be catched by the if line
        else if (type == "ELSE") {
          console.log("ENTERED ELSE SPACE WITH TOKEN " + JSON.stringify(token));
          let statements = [];
          const copy_token = token;
          while (this.currentLine()[0].type != "END") {
            let tokens_lite = this.nextLine();
            console.log("ELSE TKS LITE " + JSON.stringify(tokens_lite));
            let node_tree_lite = this.recursiveParse(tokens_lite);
            statements = statements.concat(node_tree_lite);
            if (this.peekLine() == undefined) { break };
          }
          let node = new Node.ElseNode(statements,copy_token.line,copy_token.start,token.end);
          node_tree.push(node);
        }
        // booleans
        else if (["TRUE","FALSE","NIL"].includes(type) && this.operatorCheck() == true) {
          let node;
          if (type == "TRUE") {
            node = new Node.TrueNode(token.line,token.start,token.end);
          } else if (type == "FALSE") {
            node = new Node.FalseNode(token.line,token.start,token.end);
          } else {
            node = new Node.NilNode(token.line,token.start,token.end);
          }
          node_tree.push(node);
        }
        // function calls
        else if (type == "IDENTIFIER" && this.peek(true).type == "LPAREN") {
          let identifier_token = token;
          this.next(); // skip lparen
          let args = [];
          while (this.peek().type != "RPAREN") {
            let arg_token = this.next();
            let node_tree_lite = this.recursiveParse([arg_token]);
            args = args.concat(node_tree_lite);
          }
          let rparen_token = this.current();
          let node = new Node.CallNode(identifier_token.tk, args, this.line, identifier_token.start, rparen_token.end);
          node_tree.push(node);
        }
        // variable accesses
        else if (type == "IDENTIFIER" && this.operatorCheck() == true) {
          let node = new Node.VarAccessNode(token.tk,token.line,token.start,token.end);
          node_tree.push(node);
        }
        // strings
        else if (type == "STRING") {
          let node = new Node.TextNode(token.tk,token.line,token.start,token.end);
          node_tree.push(node);
        }
        // integers
        else if (type == "INTEGER" && this.operatorCheck() == true) {
          let node = new Node.IntegerNode(token.tk,token.line,token.start,token.end);
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

