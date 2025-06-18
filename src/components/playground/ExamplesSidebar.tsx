
import { Card } from '@/components/ui/card';
import { ExamplesSidebarProps } from '@/types/playground';

const ExamplesSidebar = ({ examples, onExampleSelect }: ExamplesSidebarProps) => {
  return (
    <div className="h-full">
      <div className="bg-white border border-gray-300 rounded-lg p-4 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Examples</h3>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => onExampleSelect(example.code)}
              className="w-full text-left p-3 rounded-md bg-white hover:bg-blue-50 transition-colors group border border-gray-200 hover:border-blue-300"
            >
              <h4 className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors mb-1 text-sm">
                {example.title}
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                {example.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamplesSidebar;
