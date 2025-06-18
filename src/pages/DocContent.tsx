
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import DocsSidebar from '@/components/DocsSidebar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const DocContent = () => {
  const { section } = useParams();

  const getDocContent = (sectionName: string) => {
    switch (sectionName) {
      case 'hello-world':
        return {
          title: 'Hello World',
          content: (
            <div className="space-y-6">
              <p className="text-charcoal-300 leading-relaxed">
                A simple program prints text using the built-in <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">print</code> function:
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`fn main() {
    print("Hello, Orus!")
}`}
                </pre>
              </Card>
              
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
          content: (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Variables and Mutability</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Variables are declared with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let</code>.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`let number: i32 = 5     // immutable
let mut count = 0       // mutable, type inferred as i32`}
                </pre>
              </Card>
              
              <ul className="list-disc list-inside text-charcoal-300 space-y-2">
                <li><strong>Immutability</strong> is the default. Reassigning an immutable binding is a compile-time error.</li>
                <li>Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">let mut</code> to allow reassignment.</li>
                <li>Variables are block scoped and must be declared inside functions.</li>
              </ul>

              <h3 className="text-xl font-semibold text-white">Comments</h3>
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`// single line
let x = 1 /* inline */ + 2

/*
This is a block comment.
*/`}
                </pre>
              </Card>
            </div>
          )
        };
        
      case 'variables':
        return {
          title: 'Variables & Types',
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
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`let flag: bool = true
let text = "hello"       // type inference`}
                </pre>
              </Card>
              
              <h3 className="text-xl font-semibold text-white">Type Casting</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Numeric types never convert implicitly. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">as</code> to cast:
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`let a: i32 = -5
let b: u32 = a as u32
let big: u64 = a as u64
let c: i32 = big as i32`}
                </pre>
              </Card>
            </div>
          )
        };

      case 'functions':
        return {
          title: 'Functions',
          content: (
            <div className="space-y-6">
              <p className="text-charcoal-300 leading-relaxed">
                Functions are defined with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">fn</code>. Parameter types are required and the return type follows <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">-&gt;</code>.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`fn add(a: i32, b: i32) -> i32 {
    return a + b
}

fn greet(name: string) {    // no return value
    print("Hello, {}!", name)
}`}
                </pre>
              </Card>
              
              <p className="text-charcoal-300 leading-relaxed">
                Functions may be declared after their call site. Generic functions can also be referenced before their definitions thanks to a prepass that records all generic signatures.
              </p>
            </div>
          )
        };

      case 'control-flow':
        return {
          title: 'Control Flow',
          content: (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Conditionals</h3>
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`if n > 0 {
    print("positive")
} elif n == 0 {
    print("zero")
} else {
    print("negative")
}`}
                </pre>
              </Card>
              
              <p className="text-charcoal-300 leading-relaxed">
                An inline form <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">condition ? expr1 : expr2</code> evaluates to <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">expr1</code> when the condition is true, otherwise <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">expr2</code>.
              </p>

              <h3 className="text-xl font-semibold text-white">Loops</h3>
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`for i in 0..5 {          // 0 to 4
    print(i)
}

while condition {
    // repeat while true
}

break      // exit loop
continue   // next iteration`}
                </pre>
              </Card>
            </div>
          )
        };

      case 'pattern-matching':
        return {
          title: 'Pattern Matching',
          content: (
            <div className="space-y-6">
              <p className="text-charcoal-300 leading-relaxed">
                <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">match</code> compares a value against patterns, similar to <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">switch</code> in other languages but with explicit patterns like Rust.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`match value {
    0 => print("zero"),
    1 => print("one"),
    _ => print("other"),
}`}
                </pre>
              </Card>
              
              <p className="text-charcoal-300 leading-relaxed">
                The first matching branch runs. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">_</code> as a wildcard.
              </p>
            </div>
          )
        };

      case 'arrays':
        return {
          title: 'Arrays & Slicing',
          content: (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Fixed Arrays</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Fixed-length arrays use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">[T; N]</code> syntax. Elements are zero indexed.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`let nums: [i32; 3] = [1, 2, 3]
let first = nums[0]
nums[1] = 20`}
                </pre>
              </Card>

              <h3 className="text-xl font-semibold text-white">Dynamic Arrays</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Built-in functions can grow arrays dynamically.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`let values: [i32; 1] = [0]
push(values, 10)
print(len(values))  // 2`}
                </pre>
              </Card>

              <h3 className="text-xl font-semibold text-white">Slicing</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Subarrays are created with <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">[start..end]</code> (end exclusive).
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`let part = nums[0..2]  // first to 3rd element
let part = nums[..2]   // first to 3rd element  
let part = nums[0..]   // first to last element
let part = nums[..]    // entire array`}
                </pre>
              </Card>
            </div>
          )
        };

      case 'structs':
        return {
          title: 'Structs & Methods',
          content: (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Defining Structs</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Structs group named fields.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`struct Point {
    x: i32,
    y: i32,
}

let p = Point{ x: 1, y: 2 }
print(p.x)`}
                </pre>
              </Card>

              <h3 className="text-xl font-semibold text-white">Methods with impl</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Methods attach functions to a struct inside an <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">impl</code> block. This style is similar to Rust.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`impl Point {
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
                </pre>
              </Card>
            </div>
          )
        };

      case 'generics':
        return {
          title: 'Generics',
          content: (
            <div className="space-y-6">
              <p className="text-charcoal-300 leading-relaxed">
                Functions and structs may take type parameters using angle brackets.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`fn id<T>(x: T) -> T {
    return x
}

struct Box<T> { value: T }`}
                </pre>
              </Card>
              
              <p className="text-charcoal-300 leading-relaxed">
                Type arguments can often be inferred:
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`let a = id<i32>(5)
let b: Box<string> = Box { value: "hi" }`}
                </pre>
              </Card>

              <h3 className="text-xl font-semibold text-white">Constraints</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Type parameters may declare constraints. <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Numeric</code> enables arithmetic and bitwise operators while <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">Comparable</code> allows comparison and equality.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`fn add<T: Numeric>(a: T, b: T) -> T { return a + b }
fn min<T: Comparable>(a: T, b: T) -> T { 
    if a < b { return a } else { return b } 
}`}
                </pre>
              </Card>
            </div>
          )
        };

      case 'modules':
        return {
          title: 'Modules',
          content: (
            <div className="space-y-6">
              <p className="text-charcoal-300 leading-relaxed">
                Code can be split into multiple files. Use <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">use</code> to load an entire module.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`use math::utils
use datetime as dt

fn main() {
    utils.helper()
    dt.now()
}`}
                </pre>
              </Card>

              <h3 className="text-xl font-semibold text-white">Public Functions</h3>
              <p className="text-charcoal-300 leading-relaxed">
                Use the <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">pub</code> keyword before a top-level function to export it from a module.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`// utils.orus
pub fn helper() {
    print("from helper")
}

// main.orus
use utils

fn main() {
    utils.helper()
}`}
                </pre>
              </Card>
            </div>
          )
        };

      case 'error-handling':
        return {
          title: 'Error Handling',
          content: (
            <div className="space-y-6">
              <p className="text-charcoal-300 leading-relaxed">
                <code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">try</code>/<code className="bg-charcoal-800 px-2 py-1 rounded text-gold-400">catch</code> blocks handle runtime errors.
              </p>
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`try {
    let x = 10 / 0
} catch err {
    print("Error: {}", err)
}`}
                </pre>
              </Card>
              
              <p className="text-charcoal-300 leading-relaxed">
                Error messages include the file, line and column as well as a short stack trace.
              </p>
            </div>
          )
        };

      case 'builtins':
        return {
          title: 'Built-in Functions',
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
              
              <Card className="bg-charcoal-900 p-4">
                <pre className="text-charcoal-200 font-fira">
{`let arr: [i32; 1] = [1]
reserve(arr, 10) // preallocate capacity
push(arr, 2)
print(len(arr))`}
                </pre>
              </Card>
            </div>
          )
        };

      case 'best-practices':
        return {
          title: 'Best Practices',
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
          content: (
            <div className="text-center py-12">
              <p className="text-charcoal-400 text-lg">
                Documentation for "{section}" is coming soon.
              </p>
              <Link to="/docs" className="inline-block mt-4">
                <Button variant="outline" className="border-gold-500/50 text-gold-400">
                  Back to Documentation
                </Button>
              </Link>
            </div>
          )
        };
    }
  };

  const docData = getDocContent(section || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0 hidden lg:block">
            <DocsSidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Navigation */}
            <div className="mb-6">
              <Link to="/docs" className="inline-flex items-center text-gold-400 hover:text-gold-300 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Back to Documentation
              </Link>
            </div>
            
            {/* Content */}
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold text-white mb-8">{docData.title}</h1>
              
              <Card className="bg-charcoal-800/50 border-charcoal-700 p-8">
                {docData.content}
              </Card>
              
              {/* Navigation Footer */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-charcoal-700">
                <Link to="/docs">
                  <Button variant="outline" className="border-gold-500/50 text-gold-400">
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </Button>
                </Link>
                
                <Link to="/play">
                  <Button className="bg-gold-500 hover:bg-gold-600 text-charcoal-950">
                    Try in Playground
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocContent;
