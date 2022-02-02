# Legend

- expr = expression
- iden = identifier
- ... = some code

# Index
- [Legend](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#Legend)
- [Index](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#Index)
- [Syntax](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#Syntax)
  - [blocks](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#blocks)
  - [data types](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#data-types)
    - [variables](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#variables)
    - [lists](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#lists)
    - [hashes](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#hashes)
  - [if statements](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#if-statements)
  - [loops](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#loops)
  - [functions and classes](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#functions-and-classes)
- [Standard Builtin Library (stdblib)](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#Standard-Builtin-Library)
  - [description](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#description)
  - [common functions](https://github.com/ezrael-git/Axel/blob/development/src/data/grammar.md#common-functions)











# Syntax

### blocks
Blocks of code need a starter and an ender to work properly. Think of these as curly braces in JS.

The starter is `&` and the ender is `end`, or `#`.
Most blocks of code don't need a starter (the opposite of `end`), however some do, such as in class methods.

For example, this code doesn't need a starter,
```rb
fn hello
  log "hey"
end
```
as Axel puts them automatically. However there are some cases where you do need one, like here:
```rb
cls Person
  greet () &
    log "hey"
  #
#
```

### data types
#### variables:
```rb
def mutable = "hello"

imm immutable = "hey"
```
#### lists:
```
["something", "something"]
```
#### hashes:
```
{"name" : "Axel"}
```

### if statements
```rb
if expr
    ...
end
elf expr
    ...
end
els
    ...
end
```


### loops
```rb
while expr
    ...
end

for a in b
    ...
end

for a of b
    ...
end
```


### functions and classes
```rb
fn iden
    ...
end

cls iden
    ...
#
```
It is convention to use the `#` ender when ending a class.

# Standard Builtin Library
## description
The Standard Builtin Library, or stdblib (not to be confused with Standard Library, or stdlib), holds built-in Axel functions and classes.
The stdblib is defined in the `src/standard/stdblib.js` file. It is injected into every program that you run by the main Axel file, `src/axel.js`. It compiles everytime you run your program.

The stdblib is mostly written in Axel and JavaScript.

## common functions

Some common functions in the stdblib are:

`log`: Logs a message to the console.

`compile`: Compiles Axel or JavaScript code, from a string.
