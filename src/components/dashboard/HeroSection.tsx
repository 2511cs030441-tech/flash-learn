import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-students.jpg';

interface HeroSectionProps {
  displayName: string;
  dueCount: number;
  totalCards: number;
}

export function HeroSection({ displayName, dueCount, totalCards }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Students studying together" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,15,28,0.88)] via-[rgba(10,15,28,0.6)] to-[rgba(10,15,28,0.3)]" />
      </div>

      <div className="relative z-10 px-5 py-8 md:px-12 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] text-white"
          >
            Hey {displayName}!
            <br />
            <span className="text-white/60 text-2xl md:text-3xl font-medium">
              Ready to study?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-4 text-[15px] leading-relaxed text-white/50 max-w-md"
          >
            {dueCount > 0
              ? `You have ${dueCount} card${dueCount !== 1 ? 's' : ''} waiting for review.`
              : totalCards > 0
                ? "You're all caught up! Add new cards or explore AI tutoring."
                : "Create flashcards and study smarter with spaced repetition."
            }
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Button
              onClick={() => navigate('/flashcards')}
              className="group bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-xl text-sm font-semibold shadow-[var(--shadow-lg)] press"
            >
              {dueCount > 0 ? 'Start Reviewing' : 'Create Flashcards'}
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/ai-tutor')}
              className="group h-11 px-6 rounded-xl text-sm font-semibold text-white/80 hover:text-white bg-white/5 border border-white/10 hover:bg-white/12 hover:border-white/20 backdrop-blur-sm press transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-1.5 group-hover:rotate-12 transition-transform duration-300" />
              AI Study Buddy
            </Button>
          </motion.div>
        </div>

        {/* Stats pills */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex md:flex-col gap-3"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 text-center min-w-[100px] border border-white/10 transition-all duration-300 hover:bg-white/15">
            <p className="font-display text-3xl font-bold text-white tabular-nums">{totalCards}</p>
            <p className="text-[11px] font-medium mt-0.5 text-white/50 uppercase tracking-wider">Cards</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 text-center min-w-[100px] border border-white/10 transition-all duration-300 hover:bg-white/15">
            <p className="font-display text-3xl font-bold text-white tabular-nums">{dueCount}</p>
            <p className="text-[11px] font-medium mt-0.5 text-white/50 uppercase tracking-wider">Due</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
