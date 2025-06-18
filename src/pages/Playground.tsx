
import { useState } from 'react';
import PlaygroundHeader from '@/components/playground/PlaygroundHeader';
import ExamplesSidebar from '@/components/playground/ExamplesSidebar';
import PlaygroundToolbar from '@/components/playground/PlaygroundToolbar';
import CodeEditor from '@/components/playground/CodeEditor';
import OutputPanel from '@/components/playground/OutputPanel';
import TipsCard from '@/components/playground/TipsCard';
import { CodeExample } from '@/types/playground';

const Playground = () => {
  const [code, setCode] = useState(`fn main() {
    let name = "World";
    println!("Hello, {}!", name);
    
    // Fibonacci sequence
    let mut a = 0;
    let mut b = 1;
    
    print!("Fibonacci: {} {}", a, b);
    
    for _ in 0..8 {
        let temp = a + b;
        a = b;
        b = temp;
        print!(" {}", b);
    }
    
    println!();
    
    // Vector operations
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
    
    println!("Original: {:?}", numbers);
    println!("Sum: {}", sum);
    println!("Doubled: {:?}", doubled);
}`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput(`Hello, World!
Fibonacci: 0 1 1 2 3 5 8 13 21 34
Original: [1, 2, 3, 4, 5]
Sum: 15
Doubled: [2, 4, 6, 8, 10]

Process finished with exit code 0`);
      setIsRunning(false);
    }, 1500);
  };

  const resetCode = () => {
    setCode(`fn main() {
    println!("Hello, Orus!");
}`);
    setOutput('');
  };

  const shareCode = () => {
    navigator.clipboard.writeText(window.location.href + '?code=' + encodeURIComponent(code));
    // In a real app, you'd implement proper sharing logic
  };

  const exportCode = () => {
    // In a real app, you'd implement export logic
  };

  const handleExampleSelect = (exampleCode: string) => {
    setCode(exampleCode);
    setOutput('');
  };

  const examples: CodeExample[] = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950">
      <div className="max-w-full mx-auto px-6 py-8">
        <PlaygroundHeader />

        <div className="flex gap-6">
          <ExamplesSidebar 
            examples={examples} 
            onExampleSelect={handleExampleSelect} 
          />

          <div className="flex-1">
            <PlaygroundToolbar
              isRunning={isRunning}
              onRun={runCode}
              onReset={resetCode}
              onShare={shareCode}
              onExport={exportCode}
            />

            <div className="grid lg:grid-cols-2 gap-6">
              <CodeEditor code={code} onChange={setCode} />
              <OutputPanel output={output} isRunning={isRunning} />
            </div>

            <TipsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
