---
title: Python Metaprogramming
tags:
  - python
  - metaprogramming
  - classes
---


## How classes work

All python types (inbuilt) or classes inherit from `class type`, type is also a type that is used to construct new classes.

**classes are instances of types**

```python
type(int) == <class 'type'>
type(float) == <class 'type'>
type(str) == <class 'type'>
type(MyClass) == <class 'type'>

obj = MyClass()
type(obj) == <class '__main__.MyClass'>

type(type) == <class 'type'>
```

When you define a class such as this:

```python
class MyClass(Base):
 def __init__(self, name):
  self.name = name
```

Step 1: `type.__prepare__` is called. This is a builtin method to construct a dictionary that contains a local namespace for all the statements inside the MyClass body.

```python
clsdict = type.__prepare__('MyClass', (Base,))
```

Step 2: The body of the class is executed as followed:

```python
body = """
 def __init__(self, name):
  self.name = name
 """

exec(body, globals(), clsdict)
```

Step 3: Now clsdict is populated with the function definitions inside the class.

```python
>>> clsdict
>>> {'__init__': <function __init__ at 0x7d81ad646320>, 'foo': <function foo at 0x7d81adac45e0>, 'var': <property object at 0x7d81ad6bae80>}
```

<Hint: `globals()` is the global namespace in the context of the current python file>

Step 4: This clsdict is passed to a type constructor to create a new class with the blueprint. Think of it like passing the blueprint or layout of what functions and members the class should have is in `clsdict`, and is passed to the `type()` constructor to create a new class.

```python
MyClass = type('MyClass', (Base,), clsdict)

>>> MyClass
>>> <class '__main__.MyClass'>
>>> vars(MyClass)
>>> {'__init__': <function __init__ at 0x7d81ad646320>, 'foo': <function foo at 0x7d81adac45e0>, 'var': <property object at 0x7d81ad6bae80>}
```

### Metaprogramming

Metaclasses are used to override the default behaviour of *constructting classes* and roll with your own custom `type` implementation with custom behaviour that creates new classes.
Any class that has this custom type as a metaclass will have this behaviour.
And its syntax is on par with the syntax above for `type()` constructor.
<Note: `type()` is not calling the **init** method, as inits are not valid at this stage. So we need to overwrite the `__new__` method.

```python
class customtype(type):
 def __new__(cls, clsname: str, bases: tuple[type, ...], clsdict: dict):
  return super().__new__(cls, clsname, bases, clsdict)


class Myclass(metaclass=customtype):
 pass
```

Think of this as a decorator for changing the class hierarchy, making a custom logic that is shared by all the classes in the hierarchy.
