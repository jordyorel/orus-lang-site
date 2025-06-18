
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, Book, Zap, Shield, Code, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DocSection {
  title: string;
  icon: any;
  items: { title: string; path: string }[];
}

const DocsSidebar = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const location = useLocation();

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionTitle)
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const docSections: DocSection[] = [
    {
      title: 'Getting Started',
      icon: Book,
      items: [
        { title: 'Introduction', path: '/docs' },
        { title: 'Installation', path: '/docs/installation' },
        { title: 'Hello World', path: '/docs/hello-world' },
        { title: 'Basic Syntax', path: '/docs/syntax' },
      ]
    },
    {
      title: 'Language Features',
      icon: Zap,
      items: [
        { title: 'Variables & Types', path: '/docs/variables' },
        { title: 'Functions', path: '/docs/functions' },
        { title: 'Control Flow', path: '/docs/control-flow' },
        { title: 'Pattern Matching', path: '/docs/pattern-matching' },
      ]
    },
    {
      title: 'Memory Management',
      icon: Shield,
      items: [
        { title: 'Ownership', path: '/docs/ownership' },
        { title: 'Borrowing', path: '/docs/borrowing' },
        { title: 'Lifetimes', path: '/docs/lifetimes' },
        { title: 'Smart Pointers', path: '/docs/smart-pointers' },
      ]
    },
    {
      title: 'Advanced Topics',
      icon: Code,
      items: [
        { title: 'Concurrency', path: '/docs/concurrency' },
        { title: 'Async Programming', path: '/docs/async' },
        { title: 'FFI', path: '/docs/ffi' },
        { title: 'Unsafe Code', path: '/docs/unsafe' },
      ]
    },
    {
      title: 'Tooling',
      icon: Settings,
      items: [
        { title: 'Package Manager', path: '/docs/package-manager' },
        { title: 'Testing', path: '/docs/testing' },
        { title: 'Debugging', path: '/docs/debugging' },
        { title: 'Profiling', path: '/docs/profiling' },
      ]
    },
    {
      title: 'Reference',
      icon: FileText,
      items: [
        { title: 'Standard Library', path: '/docs/stdlib' },
        { title: 'Compiler Options', path: '/docs/compiler' },
        { title: 'Error Codes', path: '/docs/errors' },
        { title: 'Glossary', path: '/docs/glossary' },
      ]
    }
  ];

  return (
    <Card className="bg-charcoal-900/50 border-charcoal-700 h-fit sticky top-24">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Documentation</h3>
        
        <nav className="space-y-2">
          {docSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.includes(section.title.toLowerCase().replace(' ', '-'));
            
            return (
              <div key={section.title}>
                <Button
                  variant="ghost"
                  onClick={() => toggleSection(section.title.toLowerCase().replace(' ', '-'))}
                  className="w-full justify-between p-2 h-auto text-charcoal-300 hover:text-gold-400 hover:bg-charcoal-800/50"
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={16} />
                    <span className="font-medium">{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 animate-accordion-down">
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            isActive
                              ? 'bg-gold-500/20 text-gold-400 border-l-2 border-gold-400'
                              : 'text-charcoal-400 hover:text-gold-400 hover:bg-charcoal-800/30'
                          }`}
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </Card>
  );
};

export default DocsSidebar;
