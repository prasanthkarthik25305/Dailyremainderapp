import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import gokuImage from '@/assets/goku-ultra-instinct.png';

interface MotivationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityType: string;
}

const MotivationalModal = ({ isOpen, onClose, activityType }: MotivationalModalProps) => {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowImage(true);
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds

      return () => clearTimeout(timer);
    } else {
      setShowImage(false);
    }
  }, [isOpen, onClose]);

  const getMotivationalMessage = () => {
    switch (activityType) {
      case 'exercise':
        return {
          title: "🔥 UNLEASH YOUR POWER! 🔥",
          message: "Like Goku achieving Ultra Instinct through intense training, your body grows stronger with every rep! Push beyond your limits!",
          quote: '"The power to transform comes from within. Every drop of sweat is a step towards mastery!"'
        };
      case 'work':
        return {
          title: "⚡ FOCUS MODE ACTIVATED! ⚡",
          message: "Channel Goku's unwavering determination! Your mind is your greatest weapon - sharpen it with focus!",
          quote: '"True strength comes from never giving up, no matter how difficult the challenge!"'
        };
      case 'study':
        return {
          title: "🧠 KNOWLEDGE IS POWER! 🧠",
          message: "Like Goku mastering new techniques, every concept you learn makes you stronger! Keep growing!",
          quote: '"Learning is not a destination, but a lifelong journey of self-improvement!"'
        };
      default:
        return {
          title: "💪 STAY STRONG! 💪",
          message: "Remember Goku's journey - every challenge makes you stronger!",
          quote: '"The only limit is the one you set for yourself!"'
        };
    }
  };

  const motivation = getMotivationalMessage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <div className="text-center space-y-6 p-4">
          <div className="relative">
            <img 
              src={gokuImage} 
              alt="Goku Ultra Instinct - Motivation" 
              className={`w-40 h-40 mx-auto rounded-full object-cover border-4 border-primary/30 transition-all duration-1000 ${
                showImage ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            />
            <div className="absolute inset-0 rounded-full animate-pulse bg-primary/10"></div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary animate-bounce">
              {motivation.title}
            </h2>
            
            <p className="text-foreground leading-relaxed">
              {motivation.message}
            </p>
            
            <blockquote className="italic text-primary/80 border-l-4 border-primary/30 pl-4">
              {motivation.quote}
            </blockquote>
          </div>

          <div className="flex items-center justify-center gap-2 text-warning">
            <span className="animate-pulse">⚡</span>
            <span className="font-semibold">BELIEVE IN YOURSELF</span>
            <span className="animate-pulse">⚡</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MotivationalModal;