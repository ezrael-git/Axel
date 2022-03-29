
# Legend

- expr = expression
- iden = identifier
- ... = some code

# EBNF

Note: expressions and statements are similar. Statements in Axel are sort of a grouping around multiple expressions.
This are expressions
```
a == b
b == a
```
This, on the other hand, are statements:
```
do
  a == b
  b == a
end
```

```ebnf
program := {<statements>} ;
statements := 'do' {<statement>} 'end' ;
statement := <if-expr> | <declaration> ;
declaration := <func-decl> | <var-decl> ;
func-decl := 'fn' <identifier> '(' {<identifier> ','} ')' <statements> ;
var-decl := 'def' | 'imm' <identifier> '=' {
if-expr := 'if' <expression> <statements> {'elif' <expression> <statements>} ['else' <statements>] ;
```
