I will document all the language's non-basic features, conventions and behaviors, in this file.

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

# Parentheses

While parentheses aren't usually required, they're highly recommended. I suggest you use them wherever you can. The compiler has to do a lot of guesswork when it sees a function call/anything you can use parentheses on, without parentheses. This can lead to unexpected behavior.

For simple calls and code, however, not using parentheses may be more readable. For example, this:
```rb
if response? do
  ...
end
```
looks better than this:
```rb
if response?() do
  ...
end
```
Just my opinion. After all, what do I know about conventions.

# Indentation

It is conventional to indent *two spaces* for each block of code. *Four* spaces is also permitted, but you must stay consistent with your choice throughout the whole project.

Come on guys, no excuses. If you don't want to press the space key so many times, just set your editor/IDE to enter *two*/*four* spaces on the TAB key.
