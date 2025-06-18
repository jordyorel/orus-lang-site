
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code, BookOpen, Play, MapPin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Code },
    { path: '/install', label: 'Install', icon: Download },
    { path: '/docs', label: 'Docs', icon: BookOpen },
    { path: '/play', label: 'Playground', icon: Play },
    { path: '/roadmap', label: 'Roadmap', icon: MapPin },
  ];

  return (
    <nav className="bg-charcoal-950/90 backdrop-blur-md border-b border-charcoal-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
              <span className="text-charcoal-950 font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold text-gold-400 group-hover:text-gold-300 transition-colors">
              Orus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : 'text-charcoal-300 hover:text-gold-400 hover:bg-charcoal-800/50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-charcoal-300 hover:text-gold-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-charcoal-800 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                        : 'text-charcoal-300 hover:text-gold-400 hover:bg-charcoal-800/50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
