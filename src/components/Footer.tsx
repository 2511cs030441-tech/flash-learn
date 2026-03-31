import { Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const footerLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Flashcards', to: '/flashcards' },
  { label: 'AI Tutor', to: '/ai-tutor' },
  { label: 'Search', to: '/search' },
  { label: 'Profile', to: '/profile' },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' as const },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
};

export function Footer() {
  return (
    <footer className="border-t border-border/30 mt-12 hidden md:block bg-card/35 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <motion.div {...fadeUp} className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15">
                <Zap className="w-[18px] h-[18px] text-primary" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">Flash Learn</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Study smarter with AI-powered flashcards and spaced repetition.
            </p>
            <p className="handwritten text-lg text-muted-foreground/70">Learn once, remember forever.</p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <h4 className="section-label mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.map(({ label, to }, i) => (
                <motion.li
                  key={to}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                >
                  <NavLink
                    to={to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                  >
                    {label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <h4 className="section-label mb-4">Study Tips</h4>
            <ul className="space-y-3">
              {[
                'Review cards daily for best retention.',
                'Use active recall and test yourself first.',
                'Short sessions beat long cramming.',
                'Ask AI to explain tricky concepts.',
              ].map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.3 }}
                  className="text-sm text-muted-foreground leading-relaxed"
                >
                  {tip}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-muted-foreground/60">(c) {new Date().getFullYear()} Flash Learn. All rights reserved.</p>
          <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-destructive/60 fill-destructive/60" /> for students everywhere
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
