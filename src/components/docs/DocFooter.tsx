
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DocFooterProps {
  nextSection: string | null;
}

const DocFooter = ({ nextSection }: DocFooterProps) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-8 border-t border-charcoal-700">
      <Link to="/docs">
        <Button variant="outline" className="border-gold-500/50 text-gold-400">
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </Button>
      </Link>
      
      {nextSection && (
        <Link to={`/docs/${nextSection}`}>
          <Button className="bg-gold-500 hover:bg-gold-600 text-charcoal-950">
            Next
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default DocFooter;
