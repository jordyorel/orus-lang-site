
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
