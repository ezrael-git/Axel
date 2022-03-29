
# Legend

- expr = expression
- iden = identifier
- ... = some code

# EBNF

Note: expressions and statements are the same in Axel, due to everything in Axel being an expression.
However, there's a difference between expressions/statements and blocks.
These are expressions:
```rb
a == b
b == a
```
This, on the other hand, is a block:
```rb
do 
  a == b
  b == a
end
```


```ebnf
program := {<statements>} ;
statements := {<statement>} ;
statement := <if-expr> | <declaration> ;
block := 'do' <statements> 'end'

declaration := <func-decl> | <var-decl> ;
func-decl := 'fn' <identifier> '(' {<identifier> ','} ')' <block> ;
var-decl := 'def' | 'imm' <identifier> '=' <statement> ;
if-expr := 'if' <expression> <block> {'elif' <expression> <block>} ['else' <block>] ;

```
