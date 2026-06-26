export interface ErrorSuggestion {
  pattern: RegExp;
  message: string;
  fix: string;
}

export const commonErrors: ErrorSuggestion[] = [
  {
    pattern: /SyntaxError: invalid syntax/i,
    message: "There's a syntax error in your code.",
    fix: "Check for missing colons (:) after if/for/def/class statements, unmatched brackets, or typos in keywords.",
  },
  {
    pattern: /NameError: name '(\w+)' is not defined/i,
    message: "You're using a variable or function that hasn't been defined yet.",
    fix: "Make sure you've defined '$1' before using it. Check for typos in variable names.",
  },
  {
    pattern: /TypeError: unsupported operand/i,
    message: "You're trying to use an operator with incompatible types.",
    fix: "Convert types before operating: use int(), float(), or str() to match types.",
  },
  {
    pattern: /IndentationError/i,
    message: "Your code has incorrect indentation.",
    fix: "Use consistent 4-space indentation inside blocks (if, for, def, class). Don't mix tabs and spaces.",
  },
  {
    pattern: /TypeError:.*argument/i,
    message: "A function received the wrong number or type of arguments.",
    fix: "Check the function signature and make sure you're passing the correct number and types of arguments.",
  },
  {
    pattern: /IndexError: list index out of range/i,
    message: "You're trying to access an index that doesn't exist in the list.",
    fix: "Check your list length with len() before accessing indices. Remember: indices start at 0.",
  },
  {
    pattern: /KeyError: '?(\w+)'?/i,
    message: "The key '$1' doesn't exist in the dictionary.",
    fix: "Use dict.get('$1', default_value) to safely access keys, or check with 'if key in dict:' first.",
  },
  {
    pattern: /ZeroDivisionError/i,
    message: "You're trying to divide by zero.",
    fix: "Add a check: 'if divisor != 0:' before dividing.",
  },
  {
    pattern: /AttributeError: '(\w+)' object has no attribute '(\w+)'/i,
    message: "The object type '$1' doesn't have a method or property called '$2'.",
    fix: "Check the documentation for '$1' type. You might be using the wrong method name.",
  },
  {
    pattern: /ImportError|ModuleNotFoundError/i,
    message: "The module you're trying to import isn't available.",
    fix: "In the browser, only Python standard library modules are available. Some modules like 'requests' won't work here.",
  },
  {
    pattern: /ValueError/i,
    message: "A function received an argument of the right type but wrong value.",
    fix: "Validate your input before passing it to functions. Use try/except to handle invalid values.",
  },
  {
    pattern: /RecursionError/i,
    message: "Your function is calling itself too many times (infinite recursion).",
    fix: "Make sure your recursive function has a proper base case that stops the recursion.",
  },
];

export function getErrorSuggestion(error: string): { message: string; fix: string } | null {
  for (const err of commonErrors) {
    const match = error.match(err.pattern);
    if (match) {
      let message = err.message;
      let fix = err.fix;
      // Replace capture groups
      match.forEach((m, i) => {
        if (i > 0) {
          message = message.replace(`$${i}`, m);
          fix = fix.replace(`$${i}`, m);
        }
      });
      return { message, fix };
    }
  }
  return null;
}
