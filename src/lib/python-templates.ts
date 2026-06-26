export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  code: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'hello',
    title: 'Hello World',
    description: 'Your first Python program',
    icon: '👋',
    difficulty: 'beginner',
    code: `# Hello World - Your first Python program!
print("Hello, World! 🌍")
print("Welcome to PyPlayground!")

name = "Coder"
print(f"Happy coding, {name}!")
`,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'A simple math calculator',
    icon: '🧮',
    difficulty: 'beginner',
    code: `# Simple Calculator
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: Division by zero!"
    return a / b

# Test the calculator
print("=== Calculator ===")
print(f"10 + 5 = {add(10, 5)}")
print(f"10 - 5 = {subtract(10, 5)}")
print(f"10 * 5 = {multiply(10, 5)}")
print(f"10 / 3 = {divide(10, 3):.2f}")
print(f"10 / 0 = {divide(10, 0)}")
`,
  },
  {
    id: 'todo',
    title: 'Todo List',
    description: 'A task manager with classes',
    icon: '✅',
    difficulty: 'intermediate',
    code: `# Todo List Manager
class TodoList:
    def __init__(self):
        self.tasks = []
    
    def add_task(self, task):
        self.tasks.append({"task": task, "done": False})
        print(f"✅ Added: {task}")
    
    def complete_task(self, index):
        if 0 <= index < len(self.tasks):
            self.tasks[index]["done"] = True
            print(f"🎉 Completed: {self.tasks[index]['task']}")
        else:
            print("❌ Invalid task index!")
    
    def show_tasks(self):
        print("\\n📋 Your Tasks:")
        print("-" * 30)
        for i, t in enumerate(self.tasks):
            status = "✓" if t["done"] else "○"
            print(f"  {i+1}. [{status}] {t['task']}")
        print(f"\\nTotal: {len(self.tasks)} | Done: {sum(1 for t in self.tasks if t['done'])}")

# Use the todo list
todo = TodoList()
todo.add_task("Learn Python basics")
todo.add_task("Build a calculator")
todo.add_task("Create a game")
todo.add_task("Master data structures")

todo.complete_task(0)
todo.complete_task(1)
todo.show_tasks()
`,
  },
  {
    id: 'guess-game',
    title: 'Number Guessing Game',
    description: 'A fun guessing game with logic',
    icon: '🎲',
    difficulty: 'intermediate',
    code: `# Number Guessing Game (Automated)
import random

def play_game():
    secret = random.randint(1, 50)
    attempts = 0
    max_attempts = 7
    
    print("🎲 Number Guessing Game!")
    print(f"I'm thinking of a number between 1 and 50.")
    print(f"You have {max_attempts} attempts.\\n")
    
    # Simulate guesses using binary search strategy
    low, high = 1, 50
    
    while attempts < max_attempts:
        guess = (low + high) // 2
        attempts += 1
        
        print(f"Attempt {attempts}: Guessing {guess}...")
        
        if guess == secret:
            print(f"\\n🎉 Correct! The number was {secret}!")
            print(f"Found it in {attempts} attempts!")
            return
        elif guess < secret:
            print(f"  📈 Too low!")
            low = guess + 1
        else:
            print(f"  📉 Too high!")
            high = guess - 1
    
    print(f"\\n😅 Out of attempts! The number was {secret}")

play_game()
`,
  },
  {
    id: 'data-analyzer',
    title: 'Data Analyzer',
    description: 'Analyze data with statistics',
    icon: '📊',
    difficulty: 'advanced',
    code: `# Data Analyzer
import random
import math

class DataAnalyzer:
    def __init__(self, data):
        self.data = sorted(data)
    
    def mean(self):
        return sum(self.data) / len(self.data)
    
    def median(self):
        n = len(self.data)
        mid = n // 2
        if n % 2 == 0:
            return (self.data[mid-1] + self.data[mid]) / 2
        return self.data[mid]
    
    def std_dev(self):
        avg = self.mean()
        variance = sum((x - avg) ** 2 for x in self.data) / len(self.data)
        return math.sqrt(variance)
    
    def histogram(self, bins=5):
        min_val, max_val = min(self.data), max(self.data)
        bin_width = (max_val - min_val) / bins
        
        print("\\n📊 Histogram:")
        for i in range(bins):
            low = min_val + i * bin_width
            high = low + bin_width
            count = sum(1 for x in self.data if low <= x < high or (i == bins-1 and x == high))
            bar = "█" * count
            print(f"  {low:6.1f}-{high:6.1f} | {bar} ({count})")
    
    def report(self):
        print("=" * 40)
        print("📈 Data Analysis Report")
        print("=" * 40)
        print(f"  Samples:  {len(self.data)}")
        print(f"  Mean:     {self.mean():.2f}")
        print(f"  Median:   {self.median():.2f}")
        print(f"  Std Dev:  {self.std_dev():.2f}")
        print(f"  Min:      {min(self.data):.2f}")
        print(f"  Max:      {max(self.data):.2f}")
        print(f"  Range:    {max(self.data) - min(self.data):.2f}")
        self.histogram()

# Generate sample data
random.seed(42)
scores = [random.gauss(75, 12) for _ in range(30)]

analyzer = DataAnalyzer(scores)
analyzer.report()
`,
  },
  {
    id: 'password-gen',
    title: 'Password Generator',
    description: 'Generate secure passwords',
    icon: '🔐',
    difficulty: 'beginner',
    code: `# Password Generator
import random
import string

def generate_password(length=12, use_upper=True, use_digits=True, use_special=True):
    chars = string.ascii_lowercase
    if use_upper: chars += string.ascii_uppercase
    if use_digits: chars += string.digits
    if use_special: chars += "!@#$%&*"
    
    password = ''.join(random.choice(chars) for _ in range(length))
    return password

def check_strength(password):
    score = 0
    if len(password) >= 8: score += 1
    if len(password) >= 12: score += 1
    if any(c.isupper() for c in password): score += 1
    if any(c.isdigit() for c in password): score += 1
    if any(c in "!@#$%&*" for c in password): score += 1
    
    levels = ["Very Weak 😰", "Weak 😟", "Fair 😐", "Strong 💪", "Very Strong 🔒", "Ultra Strong 🛡️"]
    return levels[score], score

print("🔐 Password Generator\\n")
for length in [8, 12, 16, 20]:
    pw = generate_password(length)
    strength, score = check_strength(pw)
    bar = "█" * score + "░" * (5 - score)
    print(f"  Length {length:2d}: {pw}")
    print(f"  Strength: [{bar}] {strength}\\n")
`,
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Classic game with AI opponent',
    icon: '❌',
    difficulty: 'intermediate',
    code: `# Tic-Tac-Toe with AI Opponent
import random

class TicTacToe:
    def __init__(self):
        self.board = [' '] * 9
        self.current = 'X'
    
    def display(self):
        for i in range(3):
            row = ' | '.join(self.board[i*3:(i+1)*3])
            print(f"  {row}")
            if i < 2: print("  " + "-" * 9)
    
    def available_moves(self):
        return [i for i, v in enumerate(self.board) if v == ' ']
    
    def make_move(self, pos):
        self.board[pos] = self.current
        self.current = 'O' if self.current == 'X' else 'X'
    
    def check_winner(self):
        wins = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
        for a, b, c in wins:
            if self.board[a] == self.board[b] == self.board[c] != ' ':
                return self.board[a]
        return 'draw' if ' ' not in self.board else None
    
    def ai_move(self):
        moves = self.available_moves()
        # Try to win
        for m in moves:
            self.board[m] = 'O'
            if self.check_winner() == 'O':
                self.board[m] = ' '
                return m
            self.board[m] = ' '
        # Block player
        for m in moves:
            self.board[m] = 'X'
            if self.check_winner() == 'X':
                self.board[m] = ' '
                return m
            self.board[m] = ' '
        # Center, corners, edges
        for pref in [4, 0, 2, 6, 8, 1, 3, 5, 7]:
            if pref in moves: return pref
        return random.choice(moves)

# Simulate a game
game = TicTacToe()
print("🎮 Tic-Tac-Toe: X (random) vs O (AI)\\n")

while not game.check_winner():
    if game.current == 'X':
        move = random.choice(game.available_moves())
        print(f"Player X → position {move}")
    else:
        move = game.ai_move()
        print(f"AI (O)   → position {move}")
    game.make_move(move)

print()
game.display()
result = game.check_winner()
print(f"\\n{'🎉 ' + result + ' wins!' if result != 'draw' else '🤝 Draw!'}")
`,
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Explorer',
    description: 'Explore the Fibonacci sequence',
    icon: '🌀',
    difficulty: 'beginner',
    code: `# Fibonacci Explorer
def fibonacci(n):
    """Generate first n Fibonacci numbers"""
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib[:n]

def golden_ratio_check(fib):
    """Show how ratios approach the golden ratio"""
    print("\\n✨ Golden Ratio Convergence:")
    print(f"  {'n':>3} | {'F(n)':>8} | {'F(n)/F(n-1)':>12} | {'φ = 1.6180...':>13}")
    print("  " + "-" * 45)
    for i in range(2, len(fib)):
        ratio = fib[i] / fib[i-1] if fib[i-1] != 0 else 0
        print(f"  {i:3d} | {fib[i]:8d} | {ratio:12.8f} | {'← approaching!' if abs(ratio - 1.618033988) < 0.001 else ''}")

# Generate and display
n = 20
fib = fibonacci(n)

print("🌀 Fibonacci Sequence Explorer\\n")
print(f"First {n} numbers:")
print(f"  {fib}\\n")

# Visual spiral
print("📐 Visual pattern:")
for i, f in enumerate(fib[:12]):
    bar = "█" * min(f, 40)
    print(f"  F({i:2d}) = {f:5d} {bar}")

golden_ratio_check(fib[:15])
`,
  },
  {
    id: 'chatbot',
    title: 'Simple Chatbot',
    description: 'Rule-based chatbot with patterns',
    icon: '🤖',
    difficulty: 'intermediate',
    code: `# Simple Pattern-Matching Chatbot
import random

class Chatbot:
    def __init__(self, name="PyBot"):
        self.name = name
        self.patterns = {
            'hello': ["Hi there! 👋", "Hello! How are you?", "Hey! Nice to meet you!"],
            'how are you': ["I'm great, thanks! 🎉", "Doing wonderful!", "I'm a bot, but I feel amazing! 😄"],
            'name': [f"I'm {name}! 🤖", f"Call me {name}!", f"The name's {name}, nice to meet you!"],
            'python': ["Python is awesome! 🐍", "I love Python! It's so versatile.", "Python is one of the best languages!"],
            'help': ["I can chat about Python, tell jokes, or just hang out! 💬", "Try asking me about Python or request a joke!"],
            'joke': [
                "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
                "What's a Python's favorite subject? Hiss-tory! 🐍",
                "Why did the developer go broke? He used up all his cache! 💸",
                "What do you call 8 hobbits? A hobbyte! 🧙",
            ],
            'bye': ["Goodbye! Have a great day! 👋", "See you later! 🎉", "Bye! Keep coding! 💻"],
        }
    
    def respond(self, message):
        msg = message.lower().strip()
        for key, responses in self.patterns.items():
            if key in msg:
                return random.choice(responses)
        return random.choice([
            "Interesting! Tell me more 🤔",
            "I'm still learning! Can you rephrase? 😅",
            "That's cool! What else is on your mind?",
        ])

# Simulate a conversation
bot = Chatbot()
conversation = [
    "Hello!",
    "What's your name?",
    "Tell me a joke",
    "Do you like Python?",
    "Help me",
    "Tell me another joke",
    "Goodbye!",
]

print(f"🤖 Chat with {bot.name}\\n")
print("=" * 40)
for msg in conversation:
    print(f"  You: {msg}")
    print(f"  {bot.name}: {bot.respond(msg)}")
    print()
`,
  },
  {
    id: 'sorting-viz',
    title: 'Sorting Visualizer',
    description: 'Visualize sorting algorithms',
    icon: '📶',
    difficulty: 'advanced',
    code: `# Sorting Algorithm Visualizer (Text-based)
import random

def visualize(arr, title="", highlight=None):
    max_val = max(arr)
    print(f"  {title}")
    for i, v in enumerate(arr):
        bar = "█" * int(v / max_val * 30)
        marker = " ◄" if highlight and i in highlight else ""
        print(f"  {v:3d} |{bar}{marker}")
    print()

def bubble_sort(arr):
    arr = arr.copy()
    n = len(arr)
    steps = 0
    for i in range(n):
        for j in range(0, n-i-1):
            steps += 1
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr, steps

def selection_sort(arr):
    arr = arr.copy()
    n = len(arr)
    steps = 0
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            steps += 1
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr, steps

def insertion_sort(arr):
    arr = arr.copy()
    steps = 0
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            steps += 1
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
        steps += 1
    return arr, steps

# Generate random data
random.seed(42)
data = [random.randint(5, 99) for _ in range(10)]

print("📶 Sorting Algorithm Comparison\\n")
print("=" * 40)
visualize(data, "Original Array:")

algorithms = [
    ("Bubble Sort", bubble_sort),
    ("Selection Sort", selection_sort),
    ("Insertion Sort", insertion_sort),
]

for name, sort_fn in algorithms:
    sorted_arr, steps = sort_fn(data)
    print(f"  {name}: {steps} comparisons")

print()
sorted_arr, _ = bubble_sort(data)
visualize(sorted_arr, "Sorted Array:")
`,
  },
];
