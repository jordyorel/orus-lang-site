
import { Card } from '@/components/ui/card';

const TipsCard = () => {
  return (
    <Card className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border-gold-500/30 p-6 mt-6">
      <h3 className="text-lg font-semibold text-white mb-2">💡 Tips</h3>
      <ul className="text-charcoal-300 space-y-1 text-sm">
        <li>• Use <code className="text-gold-400 font-fira">println!</code> for debug output</li>
        <li>• Try the examples on the left to explore different Orus features</li>
        <li>• The editor supports syntax highlighting and basic autocomplete</li>
        <li>• Share your code using the Share button to get a permanent link</li>
      </ul>
    </Card>
  );
};

export default TipsCard;
