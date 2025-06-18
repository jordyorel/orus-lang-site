
import { CodeExample } from '@/types/playground';

export const playgroundExamples: CodeExample[] = [
  {
    title: 'Hello World',
    description: 'Basic hello world program',
    code: `fn main() {
    println!("Hello, Orus!");
}`
  },
  {
    title: 'Variables & Types',
    description: 'Working with different data types',
    code: `fn main() {
    let x = 42;
    let y = 3.14;
    let name = "Orus";
    let is_awesome = true;
    
    println!("Integer: {}", x);
    println!("Float: {}", y);
    println!("String: {}", name);
    println!("Boolean: {}", is_awesome);
}`
  },
  {
    title: 'Functions',
    description: 'Defining and calling functions',
    code: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let result = add(5, 3);
    println!("5 + 3 = {}", result);
    
    greet("Developer");
}`
  },
  {
    title: 'Pattern Matching',
    description: 'Using match expressions',
    code: `fn describe_number(n: i32) {
    match n {
        0 => println!("Zero"),
        1..=5 => println!("Small number"),
        6..=10 => println!("Medium number"),
        _ => println!("Large number"),
    }
}

fn main() {
    describe_number(0);
    describe_number(3);
    describe_number(8);
    describe_number(42);
}`
  }
];
