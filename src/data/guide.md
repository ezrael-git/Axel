I will document all the language's non-basic features in this file.

# BEGIN and END

You can specify code to execute once your program begins and ends with the `BEGIN` and `END` keywords, respectively.

For example:
```rb
print 'world'
BEGIN do
  print 'hello'
end

>>> hello
>>> world

END do
  print 'baz'
end
print 'foo'

>>> foo
>>> baz
```

# Anonymous Functions

Anonymous functions are functions without names. They can be useful when you want to pass a function, not a block or expression, for various reasons.

For example:

```rb
fn execute (func) do
  func.call()
end

execute(
  fn anon do
    print 'hello world'
  end
)

>>> hello world
```

# Passing a function

Now, imagine you had to pass an already-declared function, to another function. If you try to pass it normally, for example like this:
```rb
execute(some_function)

>>> PropertyAccessError: Cannot access unknown property 'call'
```
It will pass the *return value* of the function, and not the function itself. To fix this, we use `:`, the name operator.

```rb
execute(:some_function)

-- some_function gets called correctly
```
