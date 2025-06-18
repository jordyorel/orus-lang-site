
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown, Book, Code, Layers, Zap, Settings, FileText } from 'lucide-react';
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
        { title: 'Hello World', path: '/docs/hello-world' },
        { title: 'Basic Syntax', path: '/docs/syntax' },
        { title: 'Variables & Types', path: '/docs/variables' },
      ]
    },
    {
      title: 'Language Features',
      icon: Code,
      items: [
        { title: 'Functions', path: '/docs/functions' },
        { title: 'Control Flow', path: '/docs/control-flow' },
        { title: 'Pattern Matching', path: '/docs/pattern-matching' },
        { title: 'Arrays & Slicing', path: '/docs/arrays' },
      ]
    },
    {
      title: 'Advanced Topics',
      icon: Layers,
      items: [
        { title: 'Structs & Methods', path: '/docs/structs' },
        { title: 'Generics', path: '/docs/generics' },
        { title: 'Modules', path: '/docs/modules' },
        { title: 'Error Handling', path: '/docs/error-handling' },
      ]
    },
    {
      title: 'Built-ins & Standard Library',
      icon: Zap,
      items: [
        { title: 'Built-in Functions', path: '/docs/builtins' },
        { title: 'Standard Library', path: '/docs/stdlib' },
        { title: 'Collections', path: '/docs/collections' },
        { title: 'Math & Random', path: '/docs/math-random' },
      ]
    },
    {
      title: 'Development',
      icon: Settings,
      items: [
        { title: 'Debugging', path: '/docs/debugging' },
        { title: 'Testing', path: '/docs/testing' },
        { title: 'Best Practices', path: '/docs/best-practices' },
        { title: 'Performance', path: '/docs/performance' },
      ]
    },
    {
      title: 'Reference',
      icon: FileText,
      items: [
        { title: 'Language Reference', path: '/docs/reference' },
        { title: 'Error Codes', path: '/docs/errors' },
        { title: 'Roadmap', path: '/docs/roadmap' },
        { title: 'Examples', path: '/docs/examples' },
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
