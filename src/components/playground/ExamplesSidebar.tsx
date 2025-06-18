
import { Card } from '@/components/ui/card';
import { ExamplesSidebarProps } from '@/types/playground';

const ExamplesSidebar = ({ examples, onExampleSelect }: ExamplesSidebarProps) => {
  return (
    <div className="w-96 flex-shrink-0 hidden lg:block">
      <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 sticky top-8">
        <h3 className="text-lg font-semibold text-white mb-4">Examples</h3>
        <div className="space-y-3">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => onExampleSelect(example.code)}
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
  );
};

export default ExamplesSidebar;
