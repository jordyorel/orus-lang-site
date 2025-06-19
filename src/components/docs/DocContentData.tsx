
import { Card } from '@/components/ui/card';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';

export interface DocSection {
  title: string;
  nextSection: string | null;
  content: JSX.Element;
}

export const getDocContent = (sectionName: string): DocSection => {
  switch (sectionName) {
    case 'hello-world':
      return {
        title: 'Hello World',
        nextSection: 'syntax',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              A simple program prints text using the built-in <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">print</code> function:
            </p>
            
            <SyntaxHighlighter
              code={`fn main() {
    print("Hello, Orus!")
}`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              The interpreter looks for a <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">main</code> function in the entry file. 
              Exactly one such function must exist across the project.
            </p>
          </div>
        )
      };
      
    case 'syntax':
      return {
        title: 'Basic Syntax',
        nextSection: 'variables',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Variables and Mutability</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Variables are declared with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let</code>.
            </p>
            
            <SyntaxHighlighter
              code={`let number: i32 = 5     // immutable
let mut count = 0       // mutable, type inferred as i32`}
              language="orus"
            />
            
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><strong>Immutability</strong> is the default. Reassigning an immutable binding is a compile-time error.</li>
              <li>Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let mut</code> to allow reassignment.</li>
              <li>Variables are block scoped and must be declared inside functions.</li>
            </ul>

            <h3 className="text-xl font-semibold text-white">Comments</h3>
            <SyntaxHighlighter
              code={`// single line
let x = 1 /* inline */ + 2

/*
This is a block comment.
*/`}
              language="orus"
            />
          </div>
        )
      };
      
    case 'variables':
      return {
        title: 'Variables & Types',
        nextSection: 'functions',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Primitive Types</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">i32</code> – 32‑bit signed integer</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">i64</code> – 64‑bit signed integer</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">u32</code> – 32‑bit unsigned integer</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">u64</code> – 64‑bit unsigned integer</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">f64</code> – double precision floating point</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">bool</code> – boolean (true or false)</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">string</code> – UTF‑8 text</li>
            </ul>
            
            <SyntaxHighlighter
              code={`let flag: bool = true
let text = "hello"       // type inference`}
              language="orus"
            />
            
            <h3 className="text-xl font-semibold text-white">Type Casting</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Numeric types never convert implicitly. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">as</code> to cast:
            </p>
            
            <SyntaxHighlighter
              code={`let a: i32 = -5
let b: u32 = a as u32
let big: u64 = a as u64
let c: i32 = big as i32`}
              language="orus"
            />
          </div>
        )
      };

    case 'functions':
      return {
        title: 'Functions',
        nextSection: 'control-flow',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              Functions are defined with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">fn</code>. Parameter types are required and the return type follows <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">-&gt;</code>.
            </p>
            
            <SyntaxHighlighter
              code={`fn add(a: i32, b: i32) -> i32 {
    return a + b
}

fn greet(name: string) {    // no return value
    print("Hello, {}!", name)
}`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              Functions may be declared after their call site. Generic functions can also be referenced before their definitions thanks to a prepass that records all generic signatures.
            </p>
          </div>
        )
      };

    case 'control-flow':
      return {
        title: 'Control Flow',
        nextSection: 'pattern-matching',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Conditionals</h3>
            <SyntaxHighlighter
              code={`if n > 0 {
    print("positive")
} elif n == 0 {
    print("zero")
} else {
    print("negative")
}`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              An inline form <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">condition ? expr1 : expr2</code> evaluates to <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">expr1</code> when the condition is true, otherwise <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">expr2</code>.
            </p>

            <h3 className="text-xl font-semibold text-white">Loops</h3>
            <SyntaxHighlighter
              code={`for i in 0..5 {          // 0 to 4
    print(i)
}

while condition {
    // repeat while true
}

break      // exit loop
continue   // next iteration`}
              language="orus"
            />
          </div>
        )
      };

    case 'pattern-matching':
      return {
        title: 'Pattern Matching',
        nextSection: 'arrays',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">match</code> compares a value against patterns, similar to <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">switch</code> in other languages but with explicit patterns like Rust.
            </p>
            
            <SyntaxHighlighter
              code={`match value {
    0 => print("zero"),
    1 => print("one"),
    _ => print("other"),
}`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              The first matching branch runs. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">_</code> as a wildcard.
            </p>
          </div>
        )
      };

    case 'arrays':
      return {
        title: 'Arrays & Slicing',
        nextSection: 'structs',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Fixed Arrays</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Fixed-length arrays use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">[T; N]</code> syntax. Elements are zero indexed.
            </p>
            
            <SyntaxHighlighter
              code={`let nums: [i32; 3] = [1, 2, 3]
let first = nums[0]
nums[1] = 20`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Dynamic Arrays</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Built-in functions can grow arrays dynamically.
            </p>
            
            <SyntaxHighlighter
              code={`let values: [i32; 1] = [0]
push(values, 10)
print(len(values))  // 2`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Slicing</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Subarrays are created with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">[start..end]</code> (end exclusive).
            </p>
            
            <SyntaxHighlighter
              code={`let part = nums[0..2]  // first to 3rd element
let part = nums[..2]   // first to 3rd element  
let part = nums[0..]   // first to last element
let part = nums[..]    // entire array`}
              language="orus"
            />
          </div>
        )
      };

    case 'structs':
      return {
        title: 'Structs & Methods',
        nextSection: 'generics',
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Defining Structs</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Structs group named fields.
            </p>
            
            <SyntaxHighlighter
              code={`struct Point {
    x: i32,
    y: i32,
}

let p = Point{ x: 1, y: 2 }
print(p.x)`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Methods with impl</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Methods attach functions to a struct inside an <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">impl</code> block. This style is similar to Rust.
            </p>
            
            <SyntaxHighlighter
              code={`impl Point {
    fn new(x: i32, y: i32) -> Point {
        return Point{ x: x, y: y }
    }

    fn move_by(self, dx: i32, dy: i32) {
        self.x = self.x + dx
        self.y = self.y + dy
    }
}

// Usage
let p = Point.new(1, 2)
p.move_by(3, 4)`}
              language="orus"
            />
          </div>
        )
      };

    case 'generics':
      return {
        title: 'Generics',
        nextSection: 'modules',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              Functions and structs may take type parameters using angle brackets.
            </p>
            
            <SyntaxHighlighter
              code={`fn id<T>(x: T) -> T {
    return x
}

struct Box<T> { value: T }`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              Type arguments can often be inferred:
            </p>
            
            <SyntaxHighlighter
              code={`let a = id<i32>(5)
let b: Box<string> = Box { value: "hi" }`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Constraints</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Type parameters may declare constraints. <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Numeric</code> enables arithmetic and bitwise operators while <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Comparable</code> allows comparison and equality.
            </p>
            
            <SyntaxHighlighter
              code={`fn add<T: Numeric>(a: T, b: T) -> T { return a + b }
fn min<T: Comparable>(a: T, b: T) -> T { 
    if a < b { return a } else { return b } 
}`}
              language="orus"
            />
          </div>
        )
      };

    case 'modules':
      return {
        title: 'Modules',
        nextSection: 'error-handling',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              Code can be split into multiple files. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">use</code> to load an entire module.
            </p>
            
            <SyntaxHighlighter
              code={`use math::utils
use datetime as dt

fn main() {
    utils.helper()
    dt.now()
}`}
              language="orus"
            />

            <h3 className="text-xl font-semibold text-white">Public Functions</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Use the <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pub</code> keyword before a top-level function to export it from a module.
            </p>
            
            <SyntaxHighlighter
              code={`// utils.orus
pub fn helper() {
    print("from helper")
}

// main.orus
use utils

fn main() {
    utils.helper()
}`}
              language="orus"
            />
          </div>
        )
      };

    case 'error-handling':
      return {
        title: 'Error Handling',
        nextSection: 'builtins',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">try</code>/<code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">catch</code> blocks handle runtime errors.
            </p>
            
            <SyntaxHighlighter
              code={`try {
    let x = 10 / 0
} catch err {
    print("Error: {}", err)
}`}
              language="orus"
            />
            
            <p className="text-charcoal-300 leading-relaxed">
              Error messages include the file, line and column as well as a short stack trace.
            </p>
          </div>
        )
      };

    case 'builtins':
      return {
        title: 'Built-in Functions',
        nextSection: 'best-practices',
        content: (
          <div className="space-y-6">
            <p className="text-charcoal-300 leading-relaxed">
              Common utilities are always available without importing.
            </p>
            
            <h3 className="text-xl font-semibold text-white">I/O Functions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">print(values...)</code> - Print values to stdout</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">input(prompt)</code> - Read user input</li>
            </ul>

            <h3 className="text-xl font-semibold text-white">Array Functions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">len(value)</code> - Get length of array or string</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">push(array, value)</code> - Add element to array</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pop(array)</code> - Remove last element</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">reserve(array, capacity)</code> - Preallocate capacity</li>
            </ul>

            <h3 className="text-xl font-semibold text-white">Utility Functions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">type_of(value)</code> - Get type name</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">timestamp()</code> - Current timestamp</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">int(text)</code> - Parse integer</li>
              <li><code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">float(text)</code> - Parse float</li>
            </ul>
            
            <SyntaxHighlighter
              code={`let arr: [i32; 1] = [1]
reserve(arr, 10) // preallocate capacity
push(arr, 2)
print(len(arr))`}
              language="orus"
            />
          </div>
        )
      };

    case 'best-practices':
      return {
        title: 'Best Practices',
        nextSection: null,
        content: (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Naming Conventions</h3>
            <ul className="list-disc list-inside text-charcoal-300 space-y-2">
              <li>Functions and variables use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">snake_case</code></li>
              <li>Struct names use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">CamelCase</code></li>
              <li>Constants are written in <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">UPPERCASE</code> with underscores</li>
            </ul>

            <h3 className="text-xl font-semibold text-white">Immutability First</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Favor immutable bindings and avoid <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let mut</code> unless mutation is necessary. This reduces accidental state changes and eases reasoning about code.
            </p>

            <h3 className="text-xl font-semibold text-white">Module Organization</h3>
            <p className="text-charcoal-300 leading-relaxed">
              Group related functions and structs into modules. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pub</code> to expose only necessary definitions and keep implementation details private.
            </p>
          </div>
        )
      };
      
    default:
      return {
        title: 'Documentation',
        nextSection: null,
        content: (
          <div className="text-center py-12">
            <p className="text-charcoal-400 text-lg">
              Documentation for "{sectionName}" is coming soon.
            </p>
          </div>
        )
      };
  }
};
