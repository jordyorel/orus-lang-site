
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MonacoEditor from '@/components/MonacoEditor';
import { Play, Download, Share, RotateCcw, Terminal } from 'lucide-react';

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

  const examples = [
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
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="text-gold-400">Orus</span> Playground
          </h1>
          <p className="text-xl text-charcoal-400">
            Write, run, and experiment with Orus code directly in your browser.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Examples Sidebar */}
          <div className="w-96 flex-shrink-0 hidden lg:block">
            <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Examples</h3>
              <div className="space-y-3">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCode(example.code);
                      setOutput('');
                    }}
                    className="w-full text-left p-3 rounded-lg bg-charcoal-900/50 hover:bg-charcoal-700/50 transition-colors group"
                  >
                    <h4 className="text-white font-medium group-hover:text-gold-400 transition-colors">
                      {example.title}
                    </h4>
                    <p className="text-charcoal-400 text-sm mt-1">
                      {example.description}
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold"
                >
                  <Play size={16} className="mr-2" />
                  {isRunning ? 'Running...' : 'Run'}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetCode}
                  className="border-charcoal-600 text-charcoal-300 hover:text-gold-400 hover:border-gold-500/50"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={shareCode}
                  className="text-charcoal-400 hover:text-gold-400"
                >
                  <Share size={16} className="mr-2" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-charcoal-400 hover:text-gold-400"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Editor */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Code Editor */}
              <Card className="bg-charcoal-800/50 border-charcoal-700 p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Terminal size={16} className="text-gold-400" />
                  <span className="text-white font-medium">Code Editor</span>
                </div>
                <MonacoEditor
                  value={code}
                  onChange={setCode}
                  language="orus"
                  height="600px"
                />
              </Card>

              {/* Output */}
              <Card className="bg-charcoal-800/50 border-charcoal-700 p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Terminal size={16} className="text-gold-400" />
                  <span className="text-white font-medium">Output</span>
                </div>
                <div className="bg-charcoal-900 rounded-lg p-4 h-[600px] overflow-y-auto">
                  {isRunning ? (
                    <div className="text-gold-400 font-fira">
                      <div className="animate-pulse">Compiling and running...</div>
                    </div>
                  ) : output ? (
                    <pre className="text-charcoal-200 font-fira text-sm leading-relaxed whitespace-pre-wrap">
                      {output}
                    </pre>
                  ) : (
                    <div className="text-charcoal-500 font-fira text-sm">
                      Click "Run" to execute your code...
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Tips */}
            <Card className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border-gold-500/30 p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">💡 Tips</h3>
              <ul className="text-charcoal-300 space-y-1 text-sm">
                <li>• Use <code className="text-gold-400 font-fira">println!</code> for debug output</li>
                <li>• Try the examples on the left to explore different Orus features</li>
                <li>• The editor supports syntax highlighting and basic autocomplete</li>
                <li>• Share your code using the Share button to get a permanent link</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
