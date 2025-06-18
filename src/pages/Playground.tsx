import { useState } from 'react';
import PlaygroundHeader from '@/components/playground/PlaygroundHeader';
import ExamplesSidebar from '@/components/playground/ExamplesSidebar';
import PlaygroundToolbar from '@/components/playground/PlaygroundToolbar';
import CodeEditor from '@/components/playground/CodeEditor';
import OutputPanel from '@/components/playground/OutputPanel';
import { CodeExample } from '@/types/playground';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
  };

  const exportCode = () => {
    // Export logic
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
    <div className="h-screen bg-white flex flex-col">
      {/* Header - Rust playground style */}
      <div className="bg-gray-800 text-white px-4 py-2 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <PlaygroundHeader />
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar - matches Rust playground */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
        <PlaygroundToolbar
          isRunning={isRunning}
          onRun={runCode}
          onReset={resetCode}
          onShare={shareCode}
          onExport={exportCode}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-300 flex-shrink-0 bg-gray-50`}>
          <div className="h-full p-4">
            <ExamplesSidebar 
              examples={examples} 
              onExampleSelect={handleExampleSelect} 
            />
          </div>
        </div>

        {/* Sidebar Toggle */}
        <div className="flex flex-col justify-center flex-shrink-0 bg-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-12 w-8 rounded-none border-y border-r border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-200"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Button>
        </div>

        {/* Editor and Output Area */}
        <div className="flex-1 flex min-w-0">
          {/* Code Editor */}
          <div className="flex-1 border-r border-gray-300 min-w-0">
            <CodeEditor code={code} onChange={setCode} />
          </div>

          {/* Output Panel */}
          <div className="flex-1 min-w-0">
            <OutputPanel output={output} isRunning={isRunning} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
