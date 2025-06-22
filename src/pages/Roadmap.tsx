
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Zap, Shield, Code, Sparkles, Cpu, Layers, Package, Settings } from 'lucide-react';

const Roadmap = () => {
  const roadmapItems = [
    {
      version: 'Phase 1',
      title: 'Foundation & Core Data Structures',
      status: 'completed',
      date: 'Completed',
      description: 'Register VM foundation with structs, impl blocks, and enhanced function support',
      features: [
        'Struct support with field operations (ROP_STRUCT_LITERAL, ROP_FIELD_GET, ROP_FIELD_SET)',
        'Impl blocks with method calls (ROP_CALL_METHOD)',
        'Multi-argument function calls with proper register allocation',
        'Direct register VM compilation infrastructure',
        'Comprehensive test coverage (15 test cases)'
      ],
      icon: CheckCircle,
      color: 'green',
      progress: '100%'
    },
    {
      version: 'Phase 2',
      title: 'Advanced Language Features',
      status: 'in-progress',
      date: 'Q1 2025',
      description: 'Enums, pattern matching, and robust error handling system',
      features: [
        'Enum support with variant construction (ROP_ENUM_LITERAL, ROP_ENUM_VARIANT)',
        'Pattern matching with destructuring (ROP_MATCH_BEGIN, ROP_MATCH_END)',
        'Try-catch error handling with exception stack',
        'Enhanced type checking and runtime type information',
        'Error propagation and error types'
      ],
      icon: Clock,
      color: 'gold',
      progress: '15%'
    },
    {
      version: 'Phase 3',
      title: 'Advanced Type System',
      status: 'planned',
      date: 'Q2 2025',
      description: 'Generics system and advanced type operations for flexible programming',
      features: [
        'Generic functions with type constraints (ROP_CALL_GENERIC)',
        'Generic structs and enums with type inference',
        'Union types and advanced type casting',
        'Runtime type information and type checking',
        'Generic type instantiation and resolution'
      ],
      icon: Layers,
      color: 'blue',
      progress: '0%'
    },
    {
      version: 'Phase 4',
      title: 'Module System',
      status: 'planned',
      date: 'Q2-Q3 2025',
      description: 'Comprehensive module system with imports, exports, and dependency management',
      features: [
        'Module loading and caching (ROP_IMPORT, ROP_MODULE_CALL)',
        'Cross-module function calls and variable access',
        'Public/private visibility and module re-exports',
        'Dependency resolution and circular dependency handling',
        'Module compilation to register IR'
      ],
      icon: Package,
      color: 'purple',
      progress: '0%'
    },
    {
      version: 'Phase 5',
      title: 'Standard Library Integration',
      status: 'planned',
      date: 'Q3 2025',
      description: 'Rich standard library with built-in functions and data structures',
      features: [
        'Enhanced built-in functions and collection operations',
        'File I/O and network I/O capabilities',
        'Advanced math functions and data structures',
        'Hash maps, sets, and custom collections',
        'Iterator support and string manipulation'
      ],
      icon: Code,
      color: 'cyan',
      progress: '0%'
    },
    {
      version: 'Phase 6',
      title: 'Optimization & Performance',
      status: 'future',
      date: 'Q4 2025',
      description: 'Performance optimizations, memory management, and production readiness',
      features: [
        'Graph coloring register allocation with liveness analysis',
        'Garbage collection integration and memory pooling',
        'Instruction fusion and peephole optimizations',
        'JIT compilation hooks and inline caching',
        'Performance competitive with stack VM'
      ],
      icon: Zap,
      color: 'gold',
      progress: '0%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-gold-500/20 text-gold-400 border-gold-500/30';
      case 'planned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'future':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-charcoal-500/20 text-charcoal-400 border-charcoal-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'in-progress':
        return <Clock size={16} className="text-gold-400" />;
      default:
        return <Circle size={16} className="text-charcoal-400" />;
    }
  };

  const getProgressColor = (progress: string) => {
    const percent = parseInt(progress);
    if (percent === 100) return 'bg-green-500';
    if (percent > 50) return 'bg-gold-500';
    if (percent > 0) return 'bg-blue-500';
    return 'bg-charcoal-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950 py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="text-gold-400">Orus</span> Register VM Roadmap
          </h1>
          <p className="text-xl text-charcoal-400 max-w-4xl mx-auto mb-8">
            Comprehensive implementation roadmap for the Orus register VM. 
            Follow our progress as we build advanced language features with production-ready quality.
          </p>
          
          {/* Progress Overview */}
          <div className="flex justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">1/6</div>
              <div className="text-sm text-charcoal-400">Phases Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">15+</div>
              <div className="text-sm text-charcoal-400">Test Cases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">3-5</div>
              <div className="text-sm text-charcoal-400">Months Timeline</div>
            </div>
          </div>
        </div>

        {/* Current Status Banner */}
        <Card className="bg-gradient-to-r from-green-500/10 to-gold-500/10 border-green-500/30 p-6 mb-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-400">
              <Cpu className="text-green-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">🎉 Phase 1 Complete!</h3>
              <p className="text-charcoal-300">
                Register VM now has production-ready struct support, impl blocks with method calls, 
                and direct compilation infrastructure. Ready for advanced language features.
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-bold px-4 py-2">
              Phase 1 ✓
            </Badge>
          </div>
        </Card>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-gold-500 to-charcoal-600"></div>
          
          <div className="space-y-8">
            {roadmapItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.version} className="relative flex items-start space-x-6">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                    item.status === 'completed' 
                      ? 'bg-green-500 border-green-400' 
                      : item.status === 'in-progress'
                      ? 'bg-gold-500 border-gold-400'
                      : 'bg-charcoal-800 border-charcoal-600'
                  }`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <Card className="bg-charcoal-800/50 border-charcoal-700 p-6 hover:bg-charcoal-800/70 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">{item.version}</h3>
                            <Badge className={`${getStatusColor(item.status)} font-medium`}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                            </Badge>
                            {item.progress && (
                              <Badge className="bg-charcoal-700 text-charcoal-300 border-charcoal-600">
                                {item.progress}
                              </Badge>
                            )}
                          </div>
                          <h4 className="text-xl font-semibold text-gold-400 mb-2">{item.title}</h4>
                          <p className="text-charcoal-400 mb-4">{item.description}</p>
                          
                          {/* Progress Bar */}
                          {item.progress && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-charcoal-400 mb-1">
                                <span>Progress</span>
                                <span>{item.progress}</span>
                              </div>
                              <div className="w-full bg-charcoal-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.progress)}`}
                                  style={{ width: item.progress }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className="text-charcoal-500 font-medium text-sm whitespace-nowrap ml-4">
                          {item.date}
                        </span>
                      </div>
                      
                      <div>
                        <h5 className="text-white font-medium mb-3">Key Implementation Features:</h5>
                        <ul className="space-y-2">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2 text-charcoal-300 text-sm">
                              {item.status === 'completed' ? (
                                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                              ) : item.status === 'in-progress' ? (
                                <Clock size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Circle size={16} className="text-charcoal-500 flex-shrink-0 mt-0.5" />
                              )}
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid md:grid-cols-2 gap-6 mt-16 mb-12">
          <Card className="bg-charcoal-800/50 border-charcoal-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="text-gold-400" size={24} />
              <h3 className="text-xl font-semibold text-white">Technical Architecture</h3>
            </div>
            <ul className="space-y-2 text-charcoal-300 text-sm">
              <li>• Register-based VM with optimized bytecode</li>
              <li>• Direct compilation from AST to register IR</li>
              <li>• Comprehensive opcode set (ROP_* instructions)</li>
              <li>• Future-ready for stack VM replacement</li>
              <li>• Production-quality test coverage</li>
            </ul>
          </Card>

          <Card className="bg-charcoal-800/50 border-charcoal-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-blue-400" size={24} />
              <h3 className="text-xl font-semibold text-white">Quality Standards</h3>
            </div>
            <ul className="space-y-2 text-charcoal-300 text-sm">
              <li>• Test coverage > 80% for all phases</li>
              <li>• Performance regression < 10%</li>
              <li>• Memory usage regression < 15%</li>
              <li>• Feature branch development process</li>
              <li>• Comprehensive integration testing</li>
            </ul>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border-gold-500/30 p-8 mt-16">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">Join the Orus Development</h3>
            <p className="text-charcoal-300 mb-6 max-w-3xl mx-auto">
              Orus is actively developed with a focus on performance, safety, and developer experience. 
              The register VM implementation represents the future of the language with modern compiler techniques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/orus-lang/orus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold rounded-lg transition-colors"
              >
                View Implementation
              </a>
              <a 
                href="https://discord.gg/orus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 rounded-lg transition-colors"
              >
                Join Development
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Roadmap;
