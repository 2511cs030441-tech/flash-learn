import { motion } from 'framer-motion';
import { Zap, Brain, Search, Layers, ArrowRight, Star, Shield, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/landing-hero.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
};

const stagger = {
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

const features = [
  {
    icon: Layers,
    title: 'Smart Flashcards',
    description: 'Create, flip, and master cards with polished interactions and spaced repetition.',
  },
  {
    icon: Brain,
    title: 'AI Study Buddy',
    description: 'Get instant explanations, quizzes, and guided review sessions powered by AI.',
  },
  {
    icon: Search,
    title: 'Intelligent Search',
    description: 'Find cards and notes instantly across your subjects with full-text search.',
  },
  {
    icon: Clock,
    title: 'Spaced Repetition',
    description: 'Review at the right time to maximize retention and reduce cramming.',
  },
];

const stats = [
  { value: '10x', label: 'Faster Learning' },
  { value: '95%', label: 'Retention Rate' },
  { value: '24/7', label: 'AI Assistance' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen app-shell overflow-x-hidden">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15">
              <Zap className="w-4.5 h-4.5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">Flash Learn</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/auth?mode=login')}
              className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground press"
            >
              Sign in
            </Button>
            <Button
              onClick={() => navigate('/auth?mode=signup')}
              className="h-9 px-5 rounded-xl text-sm font-semibold press"
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-success/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">AI Powered Learning</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-foreground">
              Study Smarter, <span className="text-primary">Not Harder</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance">
              Flash Learn blends modern flashcards, AI tutoring, and spaced repetition so every session is focused and effective.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate('/auth?mode=signup')}
                className="group h-12 px-8 rounded-xl text-base font-semibold shadow-[var(--shadow-lg)] press"
              >
                Start Learning Free
                <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-12 px-8 rounded-xl text-base font-semibold press"
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-16 md:mt-20 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-[var(--shadow-xl)]">
              <img
                src={heroImage}
                alt="Flash Learn dashboard showing flashcards and AI study tools"
                className="w-full h-auto object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-y border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            {...stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} {...fadeUp} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-primary tabular-nums">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="section-label text-primary mb-3">Features</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Everything you need to <span className="text-primary">ace your studies</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-balance">
              From building decks to AI-assisted revision, every tool is designed to keep you in flow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="float-card p-8 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card/30 border-y border-border/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground leading-snug max-w-2xl mx-auto">
              "Flash Learn changed how I study. The AI tutor feels like having a personal teacher available all day."
            </blockquote>
            <p className="mt-6 text-sm text-muted-foreground font-medium">A happy student</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
              <Shield className="w-8 h-8 text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Ready to transform your learning?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto text-balance">
              Join students who study with focus, consistency, and better recall.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth?mode=signup')}
              className="group mt-10 h-12 px-10 rounded-xl text-base font-semibold shadow-[var(--shadow-lg)] press"
            >
              Create Free Account
              <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-10 bg-card/35 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <span className="font-display text-sm font-semibold text-foreground">Flash Learn</span>
          </div>
          <p className="text-xs text-muted-foreground">(c) {new Date().getFullYear()} Flash Learn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
