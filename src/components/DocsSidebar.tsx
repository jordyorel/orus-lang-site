import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Book, Code, Hash, Zap, GitBranch, Search, List, Package, 
  Play, Triangle, FolderOpen, AlertTriangle, Wrench, CheckCircle,
  Lightbulb, Layers
} from 'lucide-react';

const DocsSidebar = () => {
  const location = useLocation();
  
  const sections = [
    { id: 'hello-world', title: 'Hello World', icon: Play },
    { id: 'syntax', title: 'Basic Syntax', icon: Code },
    { id: 'variables', title: 'Variables & Types', icon: Hash },
    { id: 'functions', title: 'Functions', icon: Zap },
    { id: 'control-flow', title: 'Control Flow', icon: GitBranch },
    { id: 'pattern-matching', title: 'Pattern Matching', icon: Search },
    { id: 'arrays', title: 'Arrays & Slicing', icon: List },
    { id: 'structs', title: 'Structs & Methods', icon: Package },
    { id: 'enums', title: 'Enums & Options', icon: Layers },
    { id: 'generics', title: 'Generics', icon: Triangle },
    { id: 'modules', title: 'Modules', icon: FolderOpen },
    { id: 'error-handling', title: 'Error Handling', icon: AlertTriangle },
    { id: 'builtins', title: 'Built-in Functions', icon: Wrench },
    { id: 'best-practices', title: 'Best Practices', icon: CheckCircle },
    { id: 'examples', title: 'Practical Examples', icon: Lightbulb },
  ];

  return (
    <div className="bg-charcoal-800 rounded-lg p-4 space-y-2">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = location.pathname === `/docs/${section.id}`;

        return (
          <Link 
            to={`/docs/${section.id}`} 
            key={section.id}
            className={`flex items-center space-x-3 py-2 px-3 rounded-md transition-colors duration-200
              ${isActive 
                ? 'bg-gold-500 text-charcoal-900 font-semibold' 
                : 'text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-700'}`}
          >
            <Icon size={16} />
            <span>{section.title}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default DocsSidebar;
