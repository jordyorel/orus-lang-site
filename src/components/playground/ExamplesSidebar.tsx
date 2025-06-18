
import { Card } from '@/components/ui/card';
import { ExamplesSidebarProps } from '@/types/playground';

const ExamplesSidebar = ({ examples, onExampleSelect }: ExamplesSidebarProps) => {
  return (
    <div className="h-full">
      <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-6">Code Examples</h3>
        <div className="space-y-3 flex-1 overflow-y-auto">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => onExampleSelect(example.code)}
              className="w-full text-left p-4 rounded-lg bg-charcoal-900/50 hover:bg-charcoal-700/50 transition-colors group border border-charcoal-700/30 hover:border-gold-500/30"
            >
              <h4 className="text-white font-medium group-hover:text-gold-400 transition-colors mb-2">
                {example.title}
              </h4>
              <p className="text-charcoal-400 text-sm leading-relaxed">
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
