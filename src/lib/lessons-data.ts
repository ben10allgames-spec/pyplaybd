export interface Example {
  title: string;
  description?: string;
  code: string;
}

export interface Exercise {
  question: string;
  code: string;
  options: string[];
  answer: number; // index
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  theory: string;
  examples: Example[];
  exercises: Exercise[];
}

export interface LessonCategory {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
}

export const lessonCategories: LessonCategory[] = [
  {
    id: 'basics',
    title: 'Python Basics',
    icon: '🟢',
    lessons: [
      {
        id: 'hello-world',
        title: 'Python Output',
        description: 'Using the print() function',
        theory: `The print() function is used to output text, numbers, and other data to the screen.\n\nSyntax:\n  print("text")\n  print(variable)\n  print(expression)\n\nYou can print multiple items separated by commas. Python adds a space between each item.`,
        examples: [
          {
            title: 'Print a string',
            code: 'print("Hello, World!")',
          },
          {
            title: 'Print multiple values',
            code: 'print("Hello", "World", "from", "Python!")',
          },
          {
            title: 'Print numbers and expressions',
            description: 'You can print numbers and math expressions directly:',
            code: 'print(42)\nprint(10 + 5)\nprint("The answer is:", 7 * 6)',
          },
        ],
        exercises: [
          {
            question: 'What is the correct syntax to output "Hello World" in Python?',
            code: '',
            options: ['echo("Hello World")', 'print("Hello World")', 'printf("Hello World")', 'cout << "Hello World"'],
            answer: 1,
          },
          {
            question: 'What will be the output of: print(3 + 4)?',
            code: 'print(3 + 4)',
            options: ['3 + 4', '7', '34', 'Error'],
            answer: 1,
          },
        ],
      },
      {
        id: 'comments',
        title: 'Python Comments',
        description: 'Adding notes to your code',
        theory: `Comments are used to explain Python code and make it more readable. They are ignored by the interpreter.\n\n• Single-line comments start with #\n• Multi-line comments use triple quotes (""" or ''')`,
        examples: [
          {
            title: 'Single-line comment',
            code: '# This is a comment\nprint("Hello!")  # This is also a comment',
          },
          {
            title: 'Multi-line comment',
            code: '"""\nThis is a\nmulti-line comment\n(docstring)\n"""\nprint("Comments are ignored by Python")',
          },
        ],
        exercises: [
          {
            question: 'Which character is used for single-line comments in Python?',
            code: '',
            options: ['//', '#', '/*', '--'],
            answer: 1,
          },
        ],
      },
      {
        id: 'variables',
        title: 'Python Variables',
        description: 'Creating and using variables',
        theory: `Variables are containers for storing data values. Python has no command for declaring a variable — a variable is created the moment you assign a value to it.\n\nRules:\n• Must start with a letter or underscore\n• Cannot start with a number\n• Can only contain alpha-numeric characters and underscores\n• Are case-sensitive (name and Name are different)`,
        examples: [
          {
            title: 'Creating variables',
            code: 'x = 5\ny = "Hello"\nprint(x)\nprint(y)',
          },
          {
            title: 'Variables do not need type declaration',
            description: 'A variable can even change type after it has been set:',
            code: 'x = 4       # x is of type int\nx = "Sally" # x is now of type str\nprint(x)',
          },
          {
            title: 'Get the Type',
            description: 'Use the type() function to get the data type:',
            code: 'x = 5\ny = "John"\nprint(type(x))\nprint(type(y))',
          },
          {
            title: 'Case-Sensitive',
            description: 'Variable names are case-sensitive:',
            code: 'a = 4\nA = "Sally"\n# A will not overwrite a\nprint(a)\nprint(A)',
          },
        ],
        exercises: [
          {
            question: 'What is the correct way to create a variable in Python?',
            code: '',
            options: ['var x = 5', 'x = 5', 'int x = 5', 'x := 5'],
            answer: 1,
          },
          {
            question: 'What will be the result of: print(type(10))?',
            code: 'print(type(10))',
            options: ["<class 'int'>", "<class 'str'>", "int", "10"],
            answer: 0,
          },
        ],
      },
      {
        id: 'casting',
        title: 'Python Casting',
        description: 'Specify a variable type',
        theory: `Casting in Python is done using constructor functions:\n\n• int() — constructs an integer\n• float() — constructs a float\n• str() — constructs a string`,
        examples: [
          {
            title: 'Integers',
            code: 'x = int(1)    # x will be 1\ny = int(2.8)  # y will be 2\nz = int("3")  # z will be 3\nprint(x, y, z)',
          },
          {
            title: 'Floats',
            code: 'x = float(1)     # x will be 1.0\ny = float(2.8)   # y will be 2.8\nz = float("3")   # z will be 3.0\nw = float("4.2") # w will be 4.2\nprint(x, y, z, w)',
          },
          {
            title: 'Strings',
            code: 'x = str("s1") # x will be \'s1\'\ny = str(2)    # y will be \'2\'\nz = str(3.0)  # z will be \'3.0\'\nprint(x, y, z)',
          },
        ],
        exercises: [
          {
            question: 'What will be the result of: print(int(35.88))?',
            code: 'print(int(35.88))',
            options: ['35', '35.88', '36', 'Error'],
            answer: 0,
          },
        ],
      },
      {
        id: 'strings',
        title: 'Python Strings',
        description: 'Working with text',
        theory: `Strings in Python are surrounded by either single or double quotation marks.\n\nUseful methods:\n• .upper() / .lower() — change case\n• .strip() — remove whitespace\n• .replace(old, new) — replace text\n• .split(sep) — split into list\n• len() — get length\n• f-strings for formatting: f"Hello {name}"`,
        examples: [
          {
            title: 'Creating strings',
            code: 'a = "Hello"\nb = \'World\'\nprint(a, b)',
          },
          {
            title: 'String length',
            code: 'a = "Hello, World!"\nprint(len(a))',
          },
          {
            title: 'String methods',
            code: 'a = "Hello, World!"\nprint(a.upper())\nprint(a.lower())\nprint(a.replace("H", "J"))\nprint(a.split(","))',
          },
          {
            title: 'String slicing',
            code: 'b = "Hello, World!"\nprint(b[2:5])   # llo\nprint(b[:5])    # Hello\nprint(b[-5:])   # orld!',
          },
          {
            title: 'F-Strings (String Formatting)',
            description: 'F-strings let you embed variables inside strings:',
            code: 'name = "Nishan"\nage = 22\nprint(f"My name is {name} and I am {age} years old.")',
          },
        ],
        exercises: [
          {
            question: 'What will len("Hello") return?',
            code: 'print(len("Hello"))',
            options: ['4', '5', '6', 'Error'],
            answer: 1,
          },
          {
            question: 'What does "Hello".upper() return?',
            code: '',
            options: ['hello', 'HELLO', 'Hello', 'hELLO'],
            answer: 1,
          },
        ],
      },
      {
        id: 'operators',
        title: 'Python Operators',
        description: 'Arithmetic and comparison operators',
        theory: `Python operators are used to perform operations on variables and values.\n\nArithmetic: + - * / // % **\nComparison: == != > < >= <=\nLogical: and, or, not\nAssignment: = += -= *= /=`,
        examples: [
          {
            title: 'Arithmetic operators',
            code: 'print(10 + 5)   # Addition\nprint(10 - 5)   # Subtraction\nprint(10 * 5)   # Multiplication\nprint(10 / 3)   # Division\nprint(10 // 3)  # Floor division\nprint(10 % 3)   # Modulus\nprint(10 ** 2)  # Exponentiation',
          },
          {
            title: 'Comparison operators',
            code: 'x = 5\nprint(x == 5)   # True\nprint(x != 3)   # True\nprint(x > 3)    # True\nprint(x < 3)    # False',
          },
          {
            title: 'Logical operators',
            code: 'x = 5\nprint(x > 3 and x < 10)  # True\nprint(x > 3 or x < 4)   # True\nprint(not(x > 3))        # False',
          },
        ],
        exercises: [
          {
            question: 'What is the result of 10 // 3?',
            code: 'print(10 // 3)',
            options: ['3.33', '3', '4', '1'],
            answer: 1,
          },
          {
            question: 'What is 2 ** 3?',
            code: 'print(2 ** 3)',
            options: ['6', '8', '5', '23'],
            answer: 1,
          },
        ],
      },
      {
        id: 'user-input',
        title: 'Python User Input',
        description: 'Getting input from users',
        theory: `The input() function lets you get user input. It always returns a string.\n\nTo use it as a number, you must convert:\n• int(input()) for integers\n• float(input()) for decimals\n\nIn PY Play, input() shows a browser prompt dialog.`,
        examples: [
          {
            title: 'Basic input',
            code: 'name = input("Enter your name: ")\nprint("Hello, " + name + "!")',
          },
          {
            title: 'Numeric input',
            code: 'age = int(input("Enter your age: "))\nprint(f"In 10 years you will be {age + 10}.")',
          },
        ],
        exercises: [
          {
            question: 'What type does input() always return?',
            code: '',
            options: ['int', 'float', 'str', 'bool'],
            answer: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'control-flow',
    title: 'Control Flow',
    icon: '🔄',
    lessons: [
      {
        id: 'if-else',
        title: 'Python If...Else',
        description: 'Making decisions in code',
        theory: `Python supports the usual logical conditions from mathematics.\n\nif condition:\n    # runs if condition is true\nelif another_condition:\n    # runs if this is true\nelse:\n    # runs if nothing above was true\n\nPython relies on indentation (whitespace) to define scope.`,
        examples: [
          {
            title: 'If statement',
            code: 'a = 33\nb = 200\nif b > a:\n    print("b is greater than a")',
          },
          {
            title: 'Elif',
            code: 'a = 33\nb = 33\nif b > a:\n    print("b is greater than a")\nelif a == b:\n    print("a and b are equal")',
          },
          {
            title: 'Else',
            code: 'a = 200\nb = 33\nif b > a:\n    print("b is greater than a")\nelif a == b:\n    print("a and b are equal")\nelse:\n    print("a is greater than b")',
          },
          {
            title: 'Short Hand If...Else (Ternary)',
            code: 'a = 330\nb = 330\nprint("A") if a > b else print("=") if a == b else print("B")',
          },
        ],
        exercises: [
          {
            question: 'What keyword is used for "else if" in Python?',
            code: '',
            options: ['else if', 'elif', 'elseif', 'elsif'],
            answer: 1,
          },
        ],
      },
      {
        id: 'for-loops',
        title: 'Python For Loops',
        description: 'Iterating over sequences',
        theory: `A for loop is used for iterating over a sequence (list, tuple, string, range).\n\nfor item in sequence:\n    # do something\n\nThe range() function returns a sequence of numbers:\n• range(6) → 0,1,2,3,4,5\n• range(2, 6) → 2,3,4,5\n• range(0, 10, 2) → 0,2,4,6,8`,
        examples: [
          {
            title: 'Loop through a list',
            code: 'fruits = ["apple", "banana", "cherry"]\nfor x in fruits:\n    print(x)',
          },
          {
            title: 'Loop through a string',
            code: 'for x in "banana":\n    print(x)',
          },
          {
            title: 'The range() function',
            code: 'for x in range(6):\n    print(x)',
          },
          {
            title: 'Nested loops',
            code: 'adj = ["red", "big", "tasty"]\nfruits = ["apple", "banana", "cherry"]\n\nfor x in adj:\n    for y in fruits:\n        print(x, y)',
          },
          {
            title: 'List Comprehension',
            code: 'fruits = ["apple", "banana", "cherry", "kiwi", "mango"]\nnewlist = [x for x in fruits if "a" in x]\nprint(newlist)',
          },
        ],
        exercises: [
          {
            question: 'How many times will this loop run: for x in range(5)?',
            code: 'for x in range(5):\n    print(x)',
            options: ['4', '5', '6', 'Infinite'],
            answer: 1,
          },
        ],
      },
      {
        id: 'while-loops',
        title: 'Python While Loops',
        description: 'Loop while a condition is true',
        theory: `The while loop executes as long as the condition is true.\n\nwhile condition:\n    # code\n\n• break — exit the loop\n• continue — skip to next iteration\n• else — runs when condition is False`,
        examples: [
          {
            title: 'Basic while loop',
            code: 'i = 1\nwhile i < 6:\n    print(i)\n    i += 1',
          },
          {
            title: 'Break statement',
            code: 'i = 1\nwhile i < 6:\n    print(i)\n    if i == 3:\n        break\n    i += 1',
          },
          {
            title: 'Continue statement',
            code: 'i = 0\nwhile i < 6:\n    i += 1\n    if i == 3:\n        continue\n    print(i)',
          },
        ],
        exercises: [
          {
            question: 'What does the break statement do?',
            code: '',
            options: ['Pauses the loop', 'Exits the loop', 'Skips one iteration', 'Restarts the loop'],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    icon: '📊',
    lessons: [
      {
        id: 'lists',
        title: 'Python Lists',
        description: 'Ordered, changeable collections',
        theory: `Lists are used to store multiple items in a single variable. Lists are ordered, changeable, and allow duplicate values.\n\nKey methods:\n• .append(x) — add to end\n• .insert(i, x) — insert at index\n• .remove(x) — remove item\n• .pop(i) — remove at index\n• .sort() — sort the list\n• .reverse() — reverse the list`,
        examples: [
          {
            title: 'Create a list',
            code: 'thislist = ["apple", "banana", "cherry"]\nprint(thislist)',
          },
          {
            title: 'Access items',
            code: 'thislist = ["apple", "banana", "cherry"]\nprint(thislist[1])     # banana\nprint(thislist[-1])    # cherry\nprint(thislist[0:2])   # first two',
          },
          {
            title: 'Add and remove items',
            code: 'thislist = ["apple", "banana", "cherry"]\nthislist.append("orange")\nthislist.insert(1, "mango")\nprint(thislist)\nthislist.remove("banana")\nprint(thislist)',
          },
          {
            title: 'Sort a list',
            code: 'thislist = [100, 50, 65, 82, 23]\nthislist.sort()\nprint(thislist)\nthislist.sort(reverse=True)\nprint(thislist)',
          },
        ],
        exercises: [
          {
            question: 'Which method adds an item to the end of a list?',
            code: '',
            options: ['.add()', '.append()', '.insert()', '.push()'],
            answer: 1,
          },
        ],
      },
      {
        id: 'tuples',
        title: 'Python Tuples',
        description: 'Ordered, unchangeable collections',
        theory: `Tuples are used to store multiple items. A tuple is ordered and unchangeable (immutable).\n\nTuples are written with round brackets.\nSince they are immutable, you cannot add, change, or remove items.`,
        examples: [
          {
            title: 'Create a tuple',
            code: 'thistuple = ("apple", "banana", "cherry")\nprint(thistuple)\nprint(type(thistuple))',
          },
          {
            title: 'Access and unpack tuples',
            code: 'fruits = ("apple", "banana", "cherry")\n(a, b, c) = fruits\nprint(a)\nprint(b)\nprint(c)',
          },
        ],
        exercises: [
          {
            question: 'Can you change values in a tuple after creation?',
            code: '',
            options: ['Yes', 'No'],
            answer: 1,
          },
        ],
      },
      {
        id: 'dictionaries',
        title: 'Python Dictionaries',
        description: 'Key-value pairs',
        theory: `Dictionaries store data in key:value pairs. They are ordered (Python 3.7+), changeable, and do not allow duplicate keys.\n\nAccess values: dict[key] or dict.get(key)\nMethods: .keys(), .values(), .items(), .update(), .pop()`,
        examples: [
          {
            title: 'Create a dictionary',
            code: 'thisdict = {\n    "brand": "Ford",\n    "model": "Mustang",\n    "year": 1964\n}\nprint(thisdict)',
          },
          {
            title: 'Access items',
            code: 'thisdict = {"brand": "Ford", "model": "Mustang", "year": 1964}\nprint(thisdict["model"])\nprint(thisdict.get("year"))\nprint(thisdict.keys())',
          },
          {
            title: 'Loop through a dictionary',
            code: 'thisdict = {"brand": "Ford", "model": "Mustang", "year": 1964}\nfor key, value in thisdict.items():\n    print(f"{key}: {value}")',
          },
          {
            title: 'Dictionary comprehension',
            code: 'squares = {x: x**2 for x in range(6)}\nprint(squares)',
          },
        ],
        exercises: [
          {
            question: 'How do you access the value of "model" in thisdict?',
            code: 'thisdict = {"brand": "Ford", "model": "Mustang"}',
            options: ['thisdict.model', 'thisdict["model"]', 'thisdict(model)', 'thisdict->model'],
            answer: 1,
          },
        ],
      },
      {
        id: 'sets',
        title: 'Python Sets',
        description: 'Unordered, unique collections',
        theory: `Sets are unordered, unchangeable (but you can add/remove items), and do not allow duplicate values.\n\nSet operations:\n• union: set1 | set2\n• intersection: set1 & set2\n• difference: set1 - set2`,
        examples: [
          {
            title: 'Create a set',
            code: 'thisset = {"apple", "banana", "cherry", "apple"}\nprint(thisset)  # duplicates removed',
          },
          {
            title: 'Set operations',
            code: 'a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint("Union:", a | b)\nprint("Intersection:", a & b)\nprint("Difference:", a - b)',
          },
        ],
        exercises: [
          {
            question: 'Do sets allow duplicate values?',
            code: '',
            options: ['Yes', 'No'],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'functions',
    title: 'Functions',
    icon: '⚡',
    lessons: [
      {
        id: 'functions-basics',
        title: 'Python Functions',
        description: 'Creating reusable code blocks',
        theory: `A function is a block of code that only runs when it is called.\n\ndef function_name(parameters):\n    # code\n    return value\n\nFunctions can receive data (parameters) and return data as a result.`,
        examples: [
          {
            title: 'Create and call a function',
            code: 'def greet(name):\n    print(f"Hello, {name}!")\n\ngreet("World")\ngreet("Python")',
          },
          {
            title: 'Default parameter value',
            code: 'def greet(name="World"):\n    print(f"Hello, {name}!")\n\ngreet()\ngreet("Nishan")',
          },
          {
            title: 'Return values',
            code: 'def add(a, b):\n    return a + b\n\nresult = add(3, 5)\nprint("Sum:", result)',
          },
          {
            title: '*args and **kwargs',
            code: 'def my_func(*args, **kwargs):\n    print("Args:", args)\n    print("Kwargs:", kwargs)\n\nmy_func(1, 2, 3, name="Nishan", lang="Python")',
          },
        ],
        exercises: [
          {
            question: 'What keyword is used to create a function in Python?',
            code: '',
            options: ['function', 'def', 'func', 'create'],
            answer: 1,
          },
        ],
      },
      {
        id: 'lambda',
        title: 'Python Lambda',
        description: 'Small anonymous functions',
        theory: `A lambda function is a small anonymous function. It can take any number of arguments, but can only have one expression.\n\nSyntax: lambda arguments: expression`,
        examples: [
          {
            title: 'Lambda basics',
            code: 'x = lambda a: a + 10\nprint(x(5))\n\nadd = lambda a, b: a + b\nprint(add(3, 7))',
          },
          {
            title: 'Lambda with built-in functions',
            code: 'points = [(1, 2), (3, 1), (5, 4), (2, 3)]\npoints.sort(key=lambda p: p[1])\nprint("Sorted by y:", points)\n\nnums = [1, 2, 3, 4, 5, 6]\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint("Evens:", evens)',
          },
        ],
        exercises: [
          {
            question: 'What is the output of: (lambda x: x * 2)(5)?',
            code: 'print((lambda x: x * 2)(5))',
            options: ['5', '10', '25', 'Error'],
            answer: 1,
          },
        ],
      },
      {
        id: 'decorators',
        title: 'Python Decorators',
        description: 'Modifying function behavior',
        theory: `Decorators allow you to modify the behavior of a function without changing its code.\n\nUse @decorator_name above the function definition.\n\nCommon uses: logging, timing, caching, access control.`,
        examples: [
          {
            title: 'Simple decorator',
            code: 'def my_decorator(func):\n    def wrapper():\n        print("Before the function")\n        func()\n        print("After the function")\n    return wrapper\n\n@my_decorator\ndef say_hello():\n    print("Hello!")\n\nsay_hello()',
          },
          {
            title: 'Timer decorator',
            code: 'import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f"{func.__name__} took {time.time()-start:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow_function():\n    total = sum(range(1000000))\n    print(f"Sum: {total}")\n\nslow_function()',
          },
        ],
        exercises: [
          {
            question: 'What symbol is used to apply a decorator?',
            code: '',
            options: ['#', '@', '$', '&'],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'oop',
    title: 'OOP',
    icon: '🏗️',
    lessons: [
      {
        id: 'classes',
        title: 'Python Classes/Objects',
        description: 'Object-oriented programming basics',
        theory: `Python is an object-oriented programming language. A class is like a blueprint for creating objects.\n\nclass ClassName:\n    def __init__(self, params):\n        self.attribute = params\n\n• __init__() is the constructor\n• self refers to the current instance\n• All functions must have self as the first parameter`,
        examples: [
          {
            title: 'Create a class',
            code: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def greet(self):\n        print(f"Hello, my name is {self.name} and I am {self.age}.")\n\np1 = Person("Nishan", 22)\np1.greet()',
          },
          {
            title: 'The __str__() method',
            code: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def __str__(self):\n        return f"{self.name} ({self.age})"\n\np1 = Person("Nishan", 22)\nprint(p1)',
          },
        ],
        exercises: [
          {
            question: 'What is the name of the constructor method in Python?',
            code: '',
            options: ['__init__()', 'constructor()', '__new__()', 'create()'],
            answer: 0,
          },
        ],
      },
      {
        id: 'inheritance',
        title: 'Python Inheritance',
        description: 'Inheriting from parent classes',
        theory: `Inheritance allows a class to inherit all methods and properties from another class.\n\n• Parent class (base class) — the class being inherited from\n• Child class (derived class) — the class that inherits\n• Use super() to call the parent's methods`,
        examples: [
          {
            title: 'Basic inheritance',
            code: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        print(f"{self.name} makes a sound")\n\nclass Dog(Animal):\n    def speak(self):\n        print(f"{self.name} says Woof!")\n\nclass Cat(Animal):\n    def speak(self):\n        print(f"{self.name} says Meow!")\n\ndog = Dog("Rex")\ncat = Cat("Whiskers")\ndog.speak()\ncat.speak()\nprint(isinstance(dog, Animal))  # True',
          },
          {
            title: 'Using super()',
            code: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\nclass Student(Person):\n    def __init__(self, name, age, grade):\n        super().__init__(name, age)\n        self.grade = grade\n\n    def info(self):\n        print(f"{self.name}, age {self.age}, grade {self.grade}")\n\ns = Student("Alice", 20, "A")\ns.info()',
          },
        ],
        exercises: [
          {
            question: 'What function calls the parent class constructor?',
            code: '',
            options: ['parent()', 'super()', 'base()', 'this()'],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Python',
    icon: '🔥',
    lessons: [
      {
        id: 'error-handling',
        title: 'Python Try...Except',
        description: 'Handling errors gracefully',
        theory: `The try block lets you test a block of code for errors.\nThe except block handles the error.\nThe finally block runs no matter what.\n\ntry:\n    # risky code\nexcept ErrorType:\n    # handle error\nfinally:\n    # always runs`,
        examples: [
          {
            title: 'Basic try/except',
            code: 'try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")',
          },
          {
            title: 'Multiple exceptions',
            code: 'try:\n    x = int("hello")\nexcept ValueError:\n    print("That\'s not a number!")\nexcept TypeError:\n    print("Type error!")\nfinally:\n    print("This always runs.")',
          },
          {
            title: 'Raise an exception',
            code: 'def check_age(age):\n    if age < 0:\n        raise ValueError("Age cannot be negative!")\n    return f"Age is {age}"\n\ntry:\n    print(check_age(25))\n    print(check_age(-1))\nexcept ValueError as e:\n    print(f"Error: {e}")',
          },
        ],
        exercises: [
          {
            question: 'Which keyword is used to handle exceptions?',
            code: '',
            options: ['catch', 'except', 'handle', 'error'],
            answer: 1,
          },
        ],
      },
      {
        id: 'file-handling',
        title: 'Working with JSON',
        description: 'Parse and create JSON data',
        theory: `JSON (JavaScript Object Notation) is a popular data format for storing and exchanging data.\n\nimport json\n• json.dumps(obj) — Python to JSON string\n• json.loads(str) — JSON string to Python\n• json.dump() / json.load() for files`,
        examples: [
          {
            title: 'Python to JSON',
            code: 'import json\n\ndata = {\n    "name": "PY Play",\n    "version": "2.0",\n    "features": ["notebook", "lessons", "packages"]\n}\n\njson_str = json.dumps(data, indent=2)\nprint(json_str)',
          },
          {
            title: 'JSON to Python',
            code: 'import json\n\njson_str = \'{"name": "Alice", "age": 25, "scores": [90, 85, 92]}\'\ndata = json.loads(json_str)\n\nprint(f"Name: {data[\'name\']}")\nprint(f"Average score: {sum(data[\'scores\'])/len(data[\'scores\']):.1f}")',
          },
        ],
        exercises: [
          {
            question: 'Which method converts Python to JSON string?',
            code: '',
            options: ['json.parse()', 'json.dumps()', 'json.stringify()', 'json.encode()'],
            answer: 1,
          },
        ],
      },
      {
        id: 'regex',
        title: 'Python RegEx',
        description: 'Pattern matching in text',
        theory: `Regular expressions are used for searching patterns in strings.\n\nimport re\n• re.search() — find first match\n• re.findall() — find all matches\n• re.sub() — replace matches\n\nPatterns: \\d (digit), \\w (word char), \\s (space), . (any), + (one+), * (zero+)`,
        examples: [
          {
            title: 'Find all matches',
            code: 'import re\n\ntext = "The rain in Spain falls mainly on the plain"\nmatches = re.findall("ai", text)\nprint(matches)\nprint(f"Found {len(matches)} matches")',
          },
          {
            title: 'Email validation',
            code: 'import re\n\ndef is_valid_email(email):\n    pattern = r\'^[\\w.+-]+@[\\w-]+\\.[\\w.]+$\'\n    return bool(re.match(pattern, email))\n\nemails = ["user@example.com", "bad@", "good@domain.co.uk"]\nfor e in emails:\n    status = "✓" if is_valid_email(e) else "✗"\n    print(f"  {status} {e}")',
          },
        ],
        exercises: [
          {
            question: 'Which module is used for regular expressions in Python?',
            code: '',
            options: ['regex', 're', 'pattern', 'match'],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'data-science',
    title: 'Data Science',
    icon: '📈',
    lessons: [
      {
        id: 'statistics',
        title: 'Statistics with Python',
        description: 'Mean, median, standard deviation',
        theory: `Python's statistics module provides functions for statistical calculations.\n\n• mean() — average\n• median() — middle value\n• mode() — most frequent\n• stdev() — standard deviation\n\nFor advanced work, install numpy and pandas via the Package Manager.`,
        examples: [
          {
            title: 'Basic statistics',
            code: 'import statistics\n\ndata = [23, 45, 67, 12, 89, 34, 56, 78, 90, 21]\n\nprint(f"Mean:   {statistics.mean(data):.2f}")\nprint(f"Median: {statistics.median(data):.2f}")\nprint(f"StdDev: {statistics.stdev(data):.2f}")\nprint(f"Min:    {min(data)}")\nprint(f"Max:    {max(data)}")',
          },
          {
            title: 'Frequency analysis',
            code: 'from collections import Counter\n\ndata = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5]\ncounts = Counter(data)\n\nfor value, count in counts.most_common():\n    bar = "█" * count\n    print(f"  {value}: {bar} ({count})")',
          },
        ],
        exercises: [
          {
            question: 'What does statistics.median() return?',
            code: '',
            options: ['The average value', 'The most common value', 'The middle value', 'The largest value'],
            answer: 2,
          },
        ],
      },
      {
        id: 'data-analysis',
        title: 'Data Analysis',
        description: 'Processing and analyzing data',
        theory: `Data analysis involves collecting, cleaning, and analyzing data to find patterns.\n\nPython makes this easy with:\n• csv module for CSV files\n• json module for JSON data\n• collections for aggregation\n\nFor larger datasets, install pandas via Package Manager.`,
        examples: [
          {
            title: 'Analyze CSV data',
            code: 'import csv\nfrom io import StringIO\n\ncsv_data = """Name,Age,Score,City\nAlice,25,88,NYC\nBob,30,92,LA\nCharlie,22,76,Chicago\nDiana,28,95,NYC\nEve,26,85,LA"""\n\nreader = csv.DictReader(StringIO(csv_data))\ndata = list(reader)\n\nscores = [int(r["Score"]) for r in data]\nprint(f"Records: {len(data)}")\nprint(f"Avg Score: {sum(scores)/len(scores):.1f}")\nprint(f"Top: {max(data, key=lambda r: int(r[\'Score\']))[\'Name\']}")',
          },
          {
            title: 'Group-by analysis',
            code: 'data = [\n    {"city": "NYC", "sales": 100},\n    {"city": "LA", "sales": 150},\n    {"city": "NYC", "sales": 200},\n    {"city": "LA", "sales": 120},\n    {"city": "NYC", "sales": 180},\n]\n\ncity_totals = {}\nfor r in data:\n    city_totals[r["city"]] = city_totals.get(r["city"], 0) + r["sales"]\n\nfor city, total in city_totals.items():\n    print(f"{city}: ${total}")',
          },
        ],
        exercises: [
          {
            question: 'Which module is used to work with CSV files in Python?',
            code: '',
            options: ['csv', 'pandas', 'excel', 'data'],
            answer: 0,
          },
        ],
      },
      {
        id: 'eda-basics',
        title: 'Exploratory Data Analysis (EDA)',
        description: 'Inspect, summarize, and question a dataset before decisions',
        theory: `Exploratory Data Analysis (EDA) is the first serious stage of analytics. Before building dashboards or machine learning models, you need to understand what the data contains and whether it is trustworthy.

Recommended EDA workflow:
• Understand the business meaning of every column
• Check the number of rows, missing values, and duplicates
• Review totals, averages, minimums, and maximums
• Break the data into segments such as region, product, or customer type
• Look for unusual spikes, drops, and outliers
• Turn observations into business questions and hypotheses

Good EDA is not only technical. It connects the numbers to real decisions such as pricing, staffing, inventory, and marketing priorities.`,
        examples: [
          {
            title: 'Explore sales by region and product',
            code: 'sales = [\n    {"region": "North", "product": "Laptop", "revenue": 1200},\n    {"region": "North", "product": "Mouse", "revenue": 150},\n    {"region": "South", "product": "Laptop", "revenue": 900},\n    {"region": "South", "product": "Keyboard", "revenue": 220},\n    {"region": "East", "product": "Laptop", "revenue": 1400},\n]\n\nprint(f"Rows: {len(sales)}")\nprint(f"Total revenue: ${sum(r[\"revenue\"] for r in sales)}")\n\nregions = {}\nproducts = {}\nfor row in sales:\n    regions[row["region"]] = regions.get(row["region"], 0) + row["revenue"]\n    products[row["product"]] = products.get(row["product"], 0) + row["revenue"]\n\nprint("\\nRevenue by region:")\nfor region, total in regions.items():\n    print(f"  {region}: ${total}")\n\nprint("\\nRevenue by product:")\nfor product, total in products.items():\n    print(f"  {product}: ${total}")',
          },
          {
            title: 'Detect outliers using the IQR rule',
            code: 'sales = [110, 115, 118, 120, 121, 122, 124, 126, 130, 250]\n\nsorted_sales = sorted(sales)\nq1 = sorted_sales[len(sorted_sales) // 4]\nq3 = sorted_sales[(len(sorted_sales) * 3) // 4]\niqr = q3 - q1\nlower = q1 - 1.5 * iqr\nupper = q3 + 1.5 * iqr\noutliers = [value for value in sorted_sales if value < lower or value > upper]\n\nprint("Sorted values:", sorted_sales)\nprint(f"Q1: {q1}, Q3: {q3}, IQR: {iqr}")\nprint(f"Expected range: {lower} to {upper}")\nprint("Outliers:", outliers)',
          },
        ],
        exercises: [
          {
            question: 'What should you do first in an EDA workflow?',
            code: '',
            options: ['Train a model immediately', 'Understand the columns and data quality', 'Delete all rows with low values', 'Create random charts'],
            answer: 1,
          },
        ],
      },
      {
        id: 'data-cleaning',
        title: 'Data Cleaning and Transformation',
        description: 'Fix missing values, standardize text, and prepare clean data',
        theory: `Clean data leads to reliable analytics. If the raw data contains missing values, duplicates, inconsistent text, or invalid numbers, your results can be misleading.

Important cleaning tasks:
• Remove or repair incomplete rows
• Convert text numbers into numeric types
• Standardize category labels such as "nyc", "NYC", and "New York"
• Remove duplicate records
• Create new columns that make analysis easier

Transformation means reshaping the data into a format that answers the business question more clearly. This includes creating metrics like profit, margin, growth, and customer lifetime value.`,
        examples: [
          {
            title: 'Clean messy order records',
            code: 'raw_orders = [\n    {"id": 1, "city": "nyc", "sales": "1200"},\n    {"id": 2, "city": " NYC ", "sales": "980"},\n    {"id": 3, "city": "la", "sales": ""},\n    {"id": 4, "city": "LA", "sales": "1100"},\n]\n\nclean_orders = []\nfor row in raw_orders:\n    city = row["city"].strip().upper()\n    if not row["sales"].strip():\n        continue\n\n    clean_orders.append({\n        "id": row["id"],\n        "city": city,\n        "sales": int(row["sales"]),\n    })\n\nprint("Clean rows:")\nfor row in clean_orders:\n    print(row)',
          },
          {
            title: 'Create derived metrics for analysis',
            code: 'orders = [\n    {"product": "A", "revenue": 400, "cost": 250},\n    {"product": "B", "revenue": 550, "cost": 320},\n    {"product": "C", "revenue": 300, "cost": 180},\n]\n\nfor row in orders:\n    row["profit"] = row["revenue"] - row["cost"]\n    row["margin_pct"] = round((row["profit"] / row["revenue"]) * 100, 1)\n\nfor row in orders:\n    print(f"{row[\'product\']}: revenue=${row[\'revenue\']}, profit=${row[\'profit\']}, margin={row[\'margin_pct\']}%")',
          },
        ],
        exercises: [
          {
            question: 'Why is data cleaning important before analysis?',
            code: '',
            options: ['To make files larger', 'To avoid misleading results from bad data', 'To replace all numbers with text', 'To remove all categories'],
            answer: 1,
          },
        ],
      },
      {
        id: 'ml-basics',
        title: 'Machine Learning Basics',
        description: 'Build a simple ML classifier from scratch',
        theory: `Machine learning allows computers to learn from data.\n\nTypes:\n• Supervised: labeled data (classification, regression)\n• Unsupervised: unlabeled data (clustering)\n\nWe'll build K-Nearest Neighbors (KNN) from scratch — no libraries needed!`,
        examples: [
          {
            title: 'KNN Classifier from scratch',
            code: 'import math\nfrom collections import Counter\n\ndef distance(p1, p2):\n    return math.sqrt(sum((a-b)**2 for a, b in zip(p1, p2)))\n\ndef knn(data, query, k=3):\n    distances = [(distance(query, point), label) for point, label in data]\n    distances.sort(key=lambda x: x[0])\n    k_nearest = [label for _, label in distances[:k]]\n    return Counter(k_nearest).most_common(1)[0][0]\n\n# Training data: [height, weight] -> "M" or "F"\ndata = [\n    ([180, 80], "M"), ([175, 75], "M"), ([170, 70], "M"),\n    ([160, 55], "F"), ([165, 60], "F"), ([155, 50], "F"),\n]\n\ntest = [168, 65]\nresult = knn(data, test)\nprint(f"Input {test} → Predicted: {result}")',
          },
          {
            title: 'Linear Regression from scratch',
            code: 'def linear_regression(x, y):\n    n = len(x)\n    x_mean = sum(x) / n\n    y_mean = sum(y) / n\n    num = sum((x[i]-x_mean)*(y[i]-y_mean) for i in range(n))\n    den = sum((x[i]-x_mean)**2 for i in range(n))\n    slope = num / den\n    intercept = y_mean - slope * x_mean\n    return slope, intercept\n\n# Study hours vs test scores\nhours = [1, 2, 3, 4, 5, 6, 7, 8]\nscores = [52, 58, 65, 70, 78, 82, 89, 95]\n\nslope, intercept = linear_regression(hours, scores)\nprint(f"Formula: score = {slope:.1f} × hours + {intercept:.1f}")\n\nfor h in [5, 10]:\n    pred = slope * h + intercept\n    print(f"  {h} hours → predicted score: {pred:.1f}")',
          },
        ],
        exercises: [
          {
            question: 'What does KNN stand for?',
            code: '',
            options: ['K-Nearest Neighbors', 'K-Normal Networks', 'Key Node Networks', 'K-Nearest Numbers'],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'business-analytics',
    title: 'Business Analytics',
    icon: '💼',
    lessons: [
      {
        id: 'business-kpis',
        title: 'Business KPIs with Python',
        description: 'Track revenue, profit, conversion, and growth clearly',
        theory: `Business analytics turns raw numbers into business decisions. A strong analyst knows which KPIs matter and how to calculate them correctly.

Common KPIs:
• Revenue — total money earned
• Profit — revenue minus cost
• Average Order Value (AOV) — revenue divided by number of orders
• Conversion Rate — orders divided by visits or leads
• Growth Rate — how much a metric increased compared with an earlier period

KPIs are useful only when they are connected to a real decision such as improving pricing, reducing cost, or increasing marketing efficiency.`,
        examples: [
          {
            title: 'Calculate core business metrics',
            code: 'orders = [120, 150, 170, 160, 200]\ncosts = [70, 90, 110, 100, 125]\nvisits = 2500\n\nrevenue = sum(orders)\nprofit = revenue - sum(costs)\naov = revenue / len(orders)\nconversion_rate = len(orders) / visits * 100\n\nprint(f"Revenue: ${revenue}")\nprint(f"Profit: ${profit}")\nprint(f"AOV: ${aov:.2f}")\nprint(f"Conversion rate: {conversion_rate:.2f}%")',
          },
          {
            title: 'Month-over-month growth analysis',
            code: 'monthly_revenue = [12000, 13500, 14200, 15800, 14900, 17100]\n\nfor i in range(1, len(monthly_revenue)):\n    previous = monthly_revenue[i - 1]\n    current = monthly_revenue[i]\n    growth = ((current - previous) / previous) * 100\n    print(f"Month {i} -> Month {i+1}: {growth:.2f}%")',
          },
        ],
        exercises: [
          {
            question: 'How do you calculate conversion rate?',
            code: '',
            options: ['Revenue ÷ Cost', 'Orders ÷ Visits', 'Profit ÷ Orders', 'Visits ÷ Orders'],
            answer: 1,
          },
        ],
      },
      {
        id: 'customer-segmentation',
        title: 'Customer Segmentation',
        description: 'Group customers by behavior to improve decisions',
        theory: `Customer segmentation helps businesses understand that not all customers behave the same way. Some buy often, some spend a lot, and some have not returned in a long time.

One common approach is RFM analysis:
• Recency — how recently the customer purchased
• Frequency — how often the customer buys
• Monetary — how much the customer spends

Segmentation helps teams personalize offers, prioritize retention campaigns, and identify high-value customers.`,
        examples: [
          {
            title: 'Basic RFM-style segmentation',
            code: 'customers = [\n    {"name": "Asha", "days_since_last_order": 8, "orders": 12, "spend": 2400},\n    {"name": "Bilal", "days_since_last_order": 65, "orders": 4, "spend": 600},\n    {"name": "Cara", "days_since_last_order": 18, "orders": 7, "spend": 1100},\n    {"name": "Dilan", "days_since_last_order": 140, "orders": 2, "spend": 300},\n]\n\ndef segment(customer):\n    if customer["days_since_last_order"] <= 30 and customer["spend"] >= 1000:\n        return "High Value Active"\n    if customer["days_since_last_order"] > 90:\n        return "At Risk"\n    return "Regular"\n\nfor customer in customers:\n    customer_segment = segment(customer)\n    print(f"{customer[\'name\']}: {customer_segment}")',
          },
          {
            title: 'Count customers in each segment',
            code: 'segments = ["High Value Active", "Regular", "At Risk", "Regular", "High Value Active"]\nsummary = {}\nfor name in segments:\n    summary[name] = summary.get(name, 0) + 1\n\nfor segment, total in summary.items():\n    print(f"{segment}: {total}")',
          },
        ],
        exercises: [
          {
            question: 'In RFM analysis, what does the M stand for?',
            code: '',
            options: ['Market', 'Monthly', 'Monetary', 'Margin'],
            answer: 2,
          },
        ],
      },
      {
        id: 'forecasting-basics',
        title: 'Forecasting for Business Planning',
        description: 'Use trends and averages to estimate future results',
        theory: `Forecasting helps a business plan ahead. Teams use forecasts to make decisions about inventory, staffing, budgeting, and sales targets.

Common beginner methods:
• Moving average — smooths short-term fluctuations
• Trend analysis — measures the average increase or decrease over time
• Scenario planning — compares best-case, expected, and worst-case outcomes

Forecasts are estimates, not guarantees. A strong analyst explains the assumptions behind the numbers.`,
        examples: [
          {
            title: 'Three-period moving average forecast',
            code: 'sales = [210, 220, 250, 240, 265, 280]\nwindow = 3\nforecast = sum(sales[-window:]) / window\nprint("Recent sales:", sales)\nprint(f"Next period forecast: {forecast:.2f}")',
          },
          {
            title: 'Simple trend-based forecast',
            code: 'monthly_sales = [1000, 1120, 1190, 1310, 1420]\nchanges = []\nfor i in range(1, len(monthly_sales)):\n    changes.append(monthly_sales[i] - monthly_sales[i - 1])\n\navg_change = sum(changes) / len(changes)\nnext_month = monthly_sales[-1] + avg_change\nprint("Monthly sales:", monthly_sales)\nprint(f"Average monthly change: {avg_change:.1f}")\nprint(f"Forecast for next month: {next_month:.1f}")',
          },
        ],
        exercises: [
          {
            question: 'Why do analysts use a moving average?',
            code: '',
            options: ['To remove all data', 'To smooth short-term fluctuations', 'To increase costs', 'To sort text alphabetically'],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'algorithms',
    title: 'Algorithms',
    icon: '🧮',
    lessons: [
      {
        id: 'sorting',
        title: 'Sorting Algorithms',
        description: 'Bubble, selection, and quick sort',
        theory: `Sorting algorithms arrange data in a specific order.\n\nCommon algorithms:\n• Bubble Sort — O(n²), compare adjacent pairs\n• Selection Sort — O(n²), find minimum\n• Quick Sort — O(n log n) average, divide and conquer`,
        examples: [
          {
            title: 'Bubble Sort',
            code: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\ndata = [64, 34, 25, 12, 22, 11, 90]\nprint("Sorted:", bubble_sort(data))',
          },
          {
            title: 'Quick Sort',
            code: 'def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr)//2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + mid + quick_sort(right)\n\nimport random\ndata = random.sample(range(100), 15)\nprint("Original:", data)\nprint("Sorted:  ", quick_sort(data))',
          },
        ],
        exercises: [
          {
            question: 'What is the average time complexity of Quick Sort?',
            code: '',
            options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'],
            answer: 2,
          },
        ],
      },
      {
        id: 'searching',
        title: 'Searching Algorithms',
        description: 'Linear and binary search',
        theory: `Searching algorithms find elements in data structures.\n\n• Linear Search — O(n), check every element\n• Binary Search — O(log n), requires sorted data, halves the search space each step`,
        examples: [
          {
            title: 'Linear vs Binary Search',
            code: 'def linear_search(arr, target):\n    for i, val in enumerate(arr):\n        if val == target:\n            return i\n    return -1\n\ndef binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\ndata = list(range(0, 10000, 3))\ntarget = 7777\nprint(f"Linear: index {linear_search(data, target)}")\nprint(f"Binary: index {binary_search(data, target)}")',
          },
        ],
        exercises: [
          {
            question: 'Binary search requires the data to be:',
            code: '',
            options: ['Random', 'Sorted', 'Unique', 'Numeric'],
            answer: 1,
          },
        ],
      },
      {
        id: 'recursion',
        title: 'Recursion',
        description: 'Functions that call themselves',
        theory: `Recursion is a technique where a function calls itself.\n\nEvery recursive function needs:\n1. Base case — when to stop\n2. Recursive case — the function calls itself with a simpler input`,
        examples: [
          {
            title: 'Factorial and Fibonacci',
            code: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nfor i in range(1, 11):\n    print(f"{i}! = {factorial(i)}")\n\ndef fibonacci(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fibonacci(n-1) + fibonacci(n-2)\n    return memo[n]\n\nprint("\\nFibonacci:", [fibonacci(i) for i in range(15)])',
          },
        ],
        exercises: [
          {
            question: 'What is a base case in recursion?',
            code: '',
            options: ['The first call', 'The condition to stop recursion', 'The recursive call', 'The return type'],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'projects',
    title: 'Real Projects',
    icon: '🚀',
    lessons: [
      {
        id: 'calculator',
        title: 'Scientific Calculator',
        description: 'Build a calculator with math functions',
        theory: `Build a real calculator supporting arithmetic, trigonometry, and more using Python's math module and eval().`,
        examples: [
          {
            title: 'Full Scientific Calculator',
            code: 'import math\n\nclass Calculator:\n    def __init__(self):\n        self.history = []\n    \n    def calculate(self, expr):\n        try:\n            allowed = {"sin": math.sin, "cos": math.cos, "tan": math.tan,\n                        "sqrt": math.sqrt, "log": math.log, "pi": math.pi,\n                        "e": math.e, "abs": abs, "pow": pow}\n            result = eval(expr, {"__builtins__": {}}, allowed)\n            self.history.append(f"{expr} = {result}")\n            return result\n        except Exception as e:\n            return f"Error: {e}"\n\ncalc = Calculator()\nfor expr in ["2 + 3 * 4", "sqrt(144)", "sin(pi/2)", "2**10"]:\n    print(f"  {expr} = {calc.calculate(expr)}")',
          },
        ],
        exercises: [],
      },
      {
        id: 'todo-app',
        title: 'Todo Application',
        description: 'Task management system with OOP',
        theory: `Build a complete todo application using classes, lists, and string formatting.`,
        examples: [
          {
            title: 'Todo App',
            code: 'class Task:\n    def __init__(self, title, priority="medium"):\n        self.title = title\n        self.priority = priority\n        self.done = False\n    def __str__(self):\n        s = "✅" if self.done else "⬜"\n        p = {"high":"🔴","medium":"🟡","low":"🟢"}[self.priority]\n        return f"{s} {p} {self.title}"\n\nclass TodoApp:\n    def __init__(self):\n        self.tasks = []\n    def add(self, title, priority="medium"):\n        self.tasks.append(Task(title, priority))\n    def complete(self, i):\n        self.tasks[i].done = True\n    def show(self):\n        for i, t in enumerate(self.tasks):\n            print(f"  {i}. {t}")\n\napp = TodoApp()\napp.add("Learn Python", "high")\napp.add("Build a project", "high")\napp.add("Practice algorithms", "medium")\napp.add("Read docs", "low")\napp.complete(0)\napp.complete(2)\nprint("📋 My Tasks:")\napp.show()',
          },
        ],
        exercises: [],
      },
      {
        id: 'password-gen',
        title: 'Password Generator',
        description: 'Generate and check password strength',
        theory: `Build a secure password generator with customizable length, character types, and strength analysis.`,
        examples: [
          {
            title: 'Password Generator & Checker',
            code: 'import random\nimport string\n\ndef generate_password(length=16):\n    chars = string.ascii_letters + string.digits + "!@#$%^&*"\n    return "".join(random.choice(chars) for _ in range(length))\n\ndef check_strength(pwd):\n    checks = [\n        (len(pwd) >= 8, "8+ chars"),\n        (any(c.isupper() for c in pwd), "Uppercase"),\n        (any(c.islower() for c in pwd), "Lowercase"),\n        (any(c.isdigit() for c in pwd), "Digit"),\n        (any(c in string.punctuation for c in pwd), "Special"),\n    ]\n    score = sum(1 for passed, _ in checks if passed)\n    for passed, desc in checks:\n        print(f"  {\"✓\" if passed else \"✗\"} {desc}")\n    labels = ["Very Weak","Weak","Fair","Good","Strong","Excellent"]\n    print(f"  Rating: {labels[score]}")\n\nfor i in range(3):\n    pwd = generate_password(random.randint(12, 20))\n    print(f"\\nPassword: {pwd}")\n    check_strength(pwd)',
          },
        ],
        exercises: [],
      },
    ],
  },
];

// Flatten all lessons for navigation
export function getAllLessons(): { lesson: Lesson; categoryId: string; categoryTitle: string }[] {
  const all: { lesson: Lesson; categoryId: string; categoryTitle: string }[] = [];
  for (const cat of lessonCategories) {
    for (const lesson of cat.lessons) {
      all.push({ lesson, categoryId: cat.id, categoryTitle: cat.title });
    }
  }
  return all;
}
