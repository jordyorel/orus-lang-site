
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DocsSidebar from '@/components/DocsSidebar';
import { Book, ArrowRight, Code, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Docs = () => {
  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of Orus programming',
      icon: Book,
      path: '/docs/hello-world'
    },
    {
      title: 'Language Features',
      description: 'Explore Orus syntax and capabilities',
      icon: Code,
      path: '/docs/syntax'
    },
    {
      title: 'Performance Tips',
      description: 'Write efficient Orus code',
      icon: Zap,
      path: '/docs/performance'
    },
    {
      title: 'Memory Safety',
      description: 'Understanding ownership and borrowing',
      icon: Shield,
      path: '/docs/ownership'
    }
  ];

  const exampleCode = `use orus::prelude::*;

#[derive(Debug)]
struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: &str, age: u32) -> Person {
        Person {
            name: name.to_string(),
            age,
        }
    }
    
    fn greet(&self) -> String {
        format!("Hello, I'm {} and I'm {} years old", self.name, self.age)
    }
}

fn main() {
    let person = Person::new("Alice", 30);
    println!("{}", person.greet());
    
    // Pattern matching
    match person.age {
        0..=17 => println!("Minor"),
        18..=64 => println!("Adult"),
        _ => println!("Senior"),
    }
}`;

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
            {/* Header */}
            <div className="mb-12 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                <span className="text-gold-400">Orus</span> Documentation
              </h1>
              <p className="text-xl text-charcoal-400 max-w-3xl">
                Complete guide to the Orus programming language. Learn everything from basic syntax 
                to advanced systems programming concepts.
              </p>
            </div>

            {/* Introduction */}
            <Card className="bg-charcoal-800/50 border-charcoal-700 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Introduction to Orus</h2>
              <p className="text-charcoal-300 mb-4 leading-relaxed">
                Orus is a systems programming language designed for performance, safety, and productivity. 
                It combines the low-level control of languages like C and C++ with the safety and 
                expressiveness of modern languages.
              </p>
              <p className="text-charcoal-300 mb-6 leading-relaxed">
                Key features include zero-cost abstractions, memory safety without garbage collection, 
                fearless concurrency, and a rich type system that prevents common programming errors 
                at compile time.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium border border-gold-500/30">
                  Memory Safe
                </span>
                <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium border border-gold-500/30">
                  Zero Cost
                </span>
                <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium border border-gold-500/30">
                  Concurrent
                </span>
                <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium border border-gold-500/30">
                  Fast
                </span>
              </div>
            </Card>

            {/* Quick Links */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Quick Start</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link key={index} to={link.path}>
                      <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 hover:bg-charcoal-800/70 transition-all duration-300 group hover:border-gold-500/30 h-full">
                        <div className="flex items-start space-x-4">
                          <div className="text-gold-400 group-hover:text-gold-300 transition-colors">
                            <Icon size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                              {link.title}
                            </h3>
                            <p className="text-charcoal-400 text-sm">
                              {link.description}
                            </p>
                          </div>
                          <ArrowRight 
                            className="text-charcoal-600 group-hover:text-gold-400 transition-colors" 
                            size={16} 
                          />
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Code Example */}
            <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Example: Person Struct</h3>
              <p className="text-charcoal-400 mb-4">
                Here's a simple example demonstrating Orus syntax, structs, methods, and pattern matching:
              </p>
              
              <div className="bg-charcoal-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code className="text-charcoal-200 font-fira leading-relaxed">
                    {exampleCode}
                  </code>
                </pre>
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border-gold-500/30 p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Ready to Start Learning?</h3>
              <p className="text-charcoal-300 mb-6">
                Begin your journey with Orus by following our step-by-step tutorials and examples.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/docs/hello-world">
                  <Button className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold">
                    Start Tutorial
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
                <Link to="/play">
                  <Button 
                    variant="outline" 
                    className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
                  >
                    Try in Playground
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
