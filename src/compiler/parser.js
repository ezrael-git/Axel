// parser.js
// generate AST

const Node = require("./nodes.js");
const Literal = require("./literals.js");
const Scanner = require("./scanner.js");
const ErrorHandler = require("./error_handler.js");



class Expression {
  constructor (value) {
    this.value = value;
  }

  run () {
    return this.value
  }
}



module.exports = class Parser {
  constructor () {
    this.token_iterated = -1;
    this.tokens = [];
    this.token = {}; // current token
    this.bin_ops = ["PLUS","MINUS","DIVIDE","MULTIPLY","COMPARE","COMPAREOPP"];
    this.booleans = ["TRUE", "FALSE", "NIL"];
    
    this.ast = [];
    this.scanner = new Scanner();
  }

  // iterating methods

  next (safety=false) {
    /*
    Next token
    */
    this.token_iterated += 1;
    let n = this.tokens[this.token_iterated];
    if (n == undefined && safety == true) {
      return {0:0}
    }
    this.token = n;
    return n;
  }


  previous () {
    /*
    Previous token
    */
    this.token_iterated -= 1;
    let n = this.tokens[this.token_iterated];
    this.token = n;
    return n;
  }

  current () {
    /* 
    Current token
    */
    return this.tokens[this.token_iterated];
  }

  peek (safety=false) {
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

  lookBack (tokens=1) {
    /*
    Get previous token without de-incrementing token_iterated
    */
    return this.tokens[this.token_iterated - tokens];
  }
  


  operatorCheck () {
    /*
    Check if the next operator is a bin op
    */
    if (!["PLUS","MINUS","DIVIDE","MULTIPLY","COMPARE", "COMPAREOPP", "EQUALITY"].includes(this.peek(true).type)) {
      return true; // good to go!
    }
    else {
      return false;
    }
  }

  protect () {
    return this.peek() != undefined ? this.next() : null;
  }

  guard (kind) {
    /*
    Returns the next token if the next token matches the guard, else null.
    */
    return this.peek().type === kind ? this.next() : null;
  }

  unlessGuard (kind) {
    /*
    Opposite of this.guard.
    Returns the next token if the next token does NOT match the kind, else returns null.
    */
    return this.peek().type !== kind ? this.next() : null;
  }

  expect (kind, where=undefined) {
    if (where == undefined) {
      where = this.token_iterated;
    }
    let token = this.guard(kind);
    if (!token) { throw new Error(`Error in ${where}: expected ${kind}, got ${this.peek().kind}`) };
    return token;
  }

  skip () {
    this.token_iterated += 1;
  }

  // parse methods


  parseSuccess (node) {
    this.ast = this.ast.concat(node);
    return true;
  }

  parseFailure (tokens,reason) {
    throw new Error(`Failed to parse ${tokens.length} token(s): ${JSON.stringify(tokens)}\nReason given: ${reason}`);
  }

  parseBinOp (token) {
    let type = token.type;
    let node;
    if (type == "PLUS") {
      let lhs = this.parseStatement(this.lookBack());
      let rhs = this.parseStatement(this.next());
      node = new Node.BinaryOperatorNode(lhs,rhs,"+");
    }
    // subtraction operator
    else if (type == "MINUS") {
      let lhs = this.parseStatement(this.lookBack());
      let rhs = this.parseStatement(this.next());
      node = new Node.BinaryOperatorNode(lhs,rhs,"-");
    }
    // multiplication operator
    else if (type == "MULTIPLY") {
      let lhs = this.parseStatement(this.lookBack());
      let rhs = this.parseStatement(this.next());
      node = new Node.BinaryOperatorNode(lhs,rhs,"*");
    }
    // division operator
    else if (type == "DIVIDE") {
      let lhs = this.parseStatement(this.lookBack());
      let rhs = this.parseStatement(this.next());
      node = new Node.BinaryOperatorNode(lhs,rhs,"/");
    }
    // comparison operator
    else if (type == "COMPARE") {
      let lhs = this.parseStatement(this.lookBack());
      let rhs = this.parseStatement(this.next());
      node = new Node.BinaryOperatorNode(lhs,rhs,"==");
    }
    else if (type == "COMPAREOPP") {
      let lhs = this.parseStatement(this.lookBack());
      let rhs = this.parseStatement(this.next());
      node = new Node.BinaryOperatorNode(lhs,rhs,"!=");
    }
    return node;
  }

  parseVarDecl (token) {
    let type = token.type;
    if (type != "IDENTIFIER" || this.peek(true).type != "EQUALITY") {
      throw new Error("Unknown value given to parseVarDecl: " + type);
    }
    let mutable = true;
    if (this.scanner.uppercase.includes(mutable[0])) {
      mutable = false;
    }

    let name_token = token;
    // enforce variable name policy
    // no numbers allowed and name mustn't be of an existing keyword
    // the former is to preserve readability, the latter is to prevent avoidable errors
    this.scanner.enforceVarPol(name_token);
    this.expect("EQUALITY");
    let value_token = this.next();

    let value_node = this.parseStatement(value_token);
    let node = new Node.VarAssignNode(name_token.tk,mutable,value_node.constructor.name,value_node,token.line,token.start,value_token.end);
    return node;
  }

  parseFuncDecl (token) {
    let type = token.type;
    let identifier_token = this.expect('IDENTIFIER');
    this.expect('LPAREN');

    let args = [];
    let arg_token;
    while ((arg_token = this.guard('IDENTIFIER'))) {
      let arg_node = new Node.ArgNode(arg_token.tk,arg_token.line,arg_token.start,arg_token.end);
      args.push(arg_node);
      if (!this.guard("COMMA")) { break };
    }
    this.expect('RPAREN');
    let do_tk = this.expect('DO');

    console.log("THIS.TOKEN ATM " + this.current().type);
    let body = this.parseStatement(this.current());


    console.log("BODY " + JSON.stringify(body));
    let node = new Node.FuncAssignNode(identifier_token.tk,token.line,token.start,token.end,args,body);
    return node;
  }

  parseDecl (token) {
    let type = token.type;
    let node;
    if (type == "IDENTIFIER" && this.peek(true).type == "EQUALITY") {
      node = this.parseVarDecl(token);
    } else if (type == "FUNCTION") {
      node = this.parseFuncDecl(token);
    } else {
      throw new Error("Unknown value given to parseDecl: " + token.type);
    }
    return node;
  }


  parseIf (token) {
    const copy_token = token;
    token = this.next();
    let condition_node = this.parseStatements(["DO"])[0];
    console.log("CURT " + this.current());
    let statements = this.parseBlock(this.current());

    let if_node = new Node.IfNode(condition_node,statements,copy_token.line,copy_token.start,token.end);

    // go through the next few lines checking if there are any elif statements
    // this is so we can build a proper if-elif-else chain if possible
    let elif_tokens = {};
    let elif_it = 0;
    let helper = 0;
    let elif_nodes = [];

    let tkn;
    while ( (tkn = this.guard("ELIF")) ) {
      let elif_node = this.parseElif(tkn);
      elif_nodes = elif_nodes.concat(elif_node);
    }

    // now that we have elif nodes, we should look for an else statement
    let else_node = [];
    if (this.peek(true).type == "ELSE") {
      let res = this.parseElse(this.next());
      else_node = else_node.concat(res);
    }

    // finally we can construct the chain
    let chain = [if_node].concat(elif_nodes).concat(else_node);
    let node = new Node.IfChainNode(chain,chain[0].line,chain[0].start,chain[chain.length-1].end);
    return node;
  }

  parseElif (token) {
    const copy_token = token;
    token = this.next();
    let condition_node = this.parseStatements(["DO"])[0];
    let statements = this.parseBlock(this.current());

    let node = new Node.ElifNode(condition_node,statements,copy_token.line,copy_token.start,token.end);
    return node;
  }

  parseElse (token) {
    const copy_token = token;
    this.expect('DO');
    let statements = this.parseBlock(this.current());

    let node = new Node.ElseNode(statements,copy_token.line,copy_token.start,token.end);
    return node;
  }

  parsePrint (token) {
    token = this.next();
    let value_node = this.parseStatement(token);
    let node = new Node.PrintNode(value_node, token.line, token.start, token.end);
    return node;
  }

  parseBool (token) {
    let node;
    let type = token.type;
    if (type == "TRUE") {
      node = new Node.TrueNode(token.line,token.start,token.end);
    } else if (type == "FALSE") {
      node = new Node.FalseNode(token.line,token.start,token.end);
    } else {
      node = new Node.NilNode(token.line,token.start,token.end);
    }
    return node;
  }

  parseFuncCall (token) {
    let identifier_token = token;
    this.expect('LPAREN');
    let args = [];
    let arg_token;
    while ((arg_token = this.unlessGuard("RPAREN"))) {
      let node_tree_lite = this.parseStatement(arg_token);
      args = args.concat(node_tree_lite);
    }
    this.expect('RPAREN');
    let node = new Node.CallNode(identifier_token.tk, args, this.line, identifier_token.start, this.current().end);
    return node;
  }

  parseVarAccess (token) {
    let node = new Node.VarAccessNode(token.tk,token.line,token.start,token.end);
    return node;
  }

  parseString (token) {
    let node = new Node.TextNode(token.tk,token.line,token.start,token.end);
    return node;
  }

  parseInteger (token) {
    let node = new Node.IntegerNode(token.tk,token.line,token.start,token.end);
    return node;
  }

  parseBlock (token) {
    if (token.type != "DO") {
      throw new Error(`Error in parseBlock(): expected token.type "DO", got ${token.type} instead`);
    }
    let block = this.parseStatements();
    return block; // array of block statements
  }


  parseStatement (token, invalid=[]) {
    /*
      Parse a single token.
      Warning: the method might ask for more tokens.
    */
    let type = token.type;
    console.log("PS type " + type + " and line " + token.line);
    // handle...
    // block ends
    if (type == "END") {
      return null;
    }
    if (invalid.includes(type)) {
      return null;
    }


    // binary operations
    if (this.bin_ops.includes(type)) {
      let res = this.parseBinOp(token);
      return res;
    }

    // catch early binary operations
    else if (this.bin_ops.includes(this.peek(true).type)) {
      let token_li = this.next();
      let res = this.parseBinOp(token_li);
      return res;
    }

    // function declarations
    else if (["FUNCTION"].includes(type)) {
      let res = this.parseDecl(token);
      return res;
    }

    // variable declare/change handling
    else if (type == "IDENTIFIER" && this.peek(true).type == "EQUALITY") {
      let res = this.parseVarDecl(token);
      return res;
    }

    // print keyword
    else if (type == "PRINT") {
      let res = this.parsePrint(token);
      return res;
    }

    // if keyword
    // elif-else aren't mentioned here because they're handled by the if statement parser
    else if (type == "IF") {
      let res = this.parseIf(token);
      return res;
    }

    // booleans
    else if (this.booleans.includes(type) && this.operatorCheck() == true) {
      let res = this.parseBool(token);
      return res;
    }

    // function calls
    else if (type == "IDENTIFIER" && this.peek(true).type == "LPAREN") {
      let res = this.parseFuncCall(token);
      return res;
    }

    // variable accesses
    else if (type == "IDENTIFIER" && this.operatorCheck() == true) {
      let res = this.parseVarAccess(token);
      return res;
    }

    // blocks
    else if (type == "DO") {
      let res = this.parseBlock(token);
      return res;
    }

    // strings
    else if (type == "STRING") {
      let res = this.parseString(token);
      return res;
    }

    // integers
    else if (type == "INTEGER" && this.operatorCheck() == true) {
      let res = this.parseInteger(token);
      return res;
    }

    // parse failure
    else {
      //this.parseFailure([token],"unknown token");
      // skip
      return "SKIP"
    }
  }

  parseStatements (invalid=[]) {
    /*
    Parse the next statements from tokens
    */
    let generated = [];
    
    let token;
    while ((token = this.protect())) {
      console.log("TOKEN " + JSON.stringify(token));
      let node = this.parseStatement(token,invalid);
      console.log("RESULT NODE " + JSON.stringify(node));
      // block safety
      if (node === null) {
        break;
      } else if (node === "SKIP") {
        continue;
      } else {
        generated.push(node);
      }
    }
    return generated;
  }

  parseProgram (tokens) {
    /* 
    Wrapper around parseStatements. This is made for the whole program instead of just a few statements.
    Interface function.
    */
    this.tokens = tokens;
    this.token_iterated = -1;
    this.ast = [];

    let ast = this.parseStatements();
    this.ast = ast;
    return this.ast;
  }



    



}

