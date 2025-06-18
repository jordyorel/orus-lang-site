
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Zap, Shield, Code, Sparkles } from 'lucide-react';

const Roadmap = () => {
  const roadmapItems = [
    {
      version: 'v0.1.0',
      title: 'Foundation',
      status: 'completed',
      date: 'Q1 2024',
      description: 'Core language features and basic tooling',
      features: [
        'Basic syntax and semantics',
        'Memory safety guarantees',
        'Pattern matching',
        'Basic standard library',
        'Compiler frontend'
      ],
      icon: CheckCircle,
      color: 'green'
    },
    {
      version: 'v0.2.0',
      title: 'Advanced Features',
      status: 'in-progress',
      date: 'Q2 2024',
      description: 'Advanced language features and improved tooling',
      features: [
        'Async/await support',
        'Generic types and traits',
        'Macro system',
        'Package manager',
        'LSP integration'
      ],
      icon: Clock,
      color: 'gold'
    },
    {
      version: 'v0.3.0',
      title: 'Performance & Optimization',
      status: 'planned',
      date: 'Q3 2024',
      description: 'Focus on performance optimizations and compiler improvements',
      features: [
        'LLVM backend optimization',
        'Incremental compilation',
        'Profile-guided optimization',
        'Advanced static analysis',
        'Cross-platform support'
      ],
      icon: Zap,
      color: 'blue'
    },
    {
      version: 'v0.4.0',
      title: 'Ecosystem & Tooling',
      status: 'planned',
      date: 'Q4 2024',
      description: 'Rich ecosystem and developer experience improvements',
      features: [
        'IDE plugins',
        'Debugger integration',
        'Documentation generator',
        'Testing framework',
        'Benchmarking tools'
      ],
      icon: Code,
      color: 'purple'
    },
    {
      version: 'v1.0.0',
      title: 'Stable Release',
      status: 'future',
      date: '2025',
      description: 'Production-ready stable release with complete feature set',
      features: [
        'API stability guarantees',
        'Complete standard library',
        'Enterprise features',
        '100% memory safety',
        'Full ecosystem maturation'
      ],
      icon: Sparkles,
      color: 'gold'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950 py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="text-gold-400">Orus</span> Roadmap
          </h1>
          <p className="text-xl text-charcoal-400 max-w-3xl mx-auto">
            Follow our journey as we build the future of systems programming. 
            Here's what we're working on and what's coming next.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-400 via-gold-500 to-charcoal-600"></div>
          
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
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">{item.version}</h3>
                            <Badge className={`${getStatusColor(item.status)} font-medium`}>
                              {getStatusIcon(item.status)}
                              <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                            </Badge>
                          </div>
                          <h4 className="text-xl font-semibold text-gold-400 mb-2">{item.title}</h4>
                          <p className="text-charcoal-400 mb-4">{item.description}</p>
                        </div>
                        <span className="text-charcoal-500 font-medium text-sm whitespace-nowrap ml-4">
                          {item.date}
                        </span>
                      </div>
                      
                      <div>
                        <h5 className="text-white font-medium mb-3">Key Features:</h5>
                        <ul className="space-y-2">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-2 text-charcoal-300">
                              {item.status === 'completed' ? (
                                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                              ) : item.status === 'in-progress' ? (
                                <Clock size={16} className="text-gold-400 flex-shrink-0" />
                              ) : (
                                <Circle size={16} className="text-charcoal-500 flex-shrink-0" />
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

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border-gold-500/30 p-8 mt-16">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">Want to Contribute?</h3>
            <p className="text-charcoal-300 mb-6 max-w-2xl mx-auto">
              Orus is an open-source project and we welcome contributions from the community. 
              Whether you're interested in language design, compiler implementation, or tooling, 
              there's a place for you in our project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/orus-lang/orus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold rounded-lg transition-colors"
              >
                View on GitHub
              </a>
              <a 
                href="https://discord.gg/orus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 rounded-lg transition-colors"
              >
                Join Discord
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Roadmap;
