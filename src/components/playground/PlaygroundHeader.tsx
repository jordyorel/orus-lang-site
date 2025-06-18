
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const PlaygroundHeader = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white">
          Orus Playground
        </h1>
        <div className="text-sm text-gold-400">
          Stable channel
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="text-charcoal-300 hover:text-white hover:bg-charcoal-800"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </div>
  );
};

export default PlaygroundHeader;
