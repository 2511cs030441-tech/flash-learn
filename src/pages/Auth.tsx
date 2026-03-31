import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, ArrowLeft, Layers, Brain, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const benefits = [
  { icon: Layers, text: 'Beautiful 3D flashcards with spaced repetition' },
  { icon: Brain, text: 'AI tutor for instant explanations & quizzes' },
  { icon: Sparkles, text: 'Smart search across all your study decks' },
];

export default function Auth() {
  const { session, loading, signIn, signUp } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') setIsLogin(false);
    else if (mode === 'login') setIsLogin(true);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </motion.div>
      </div>
    );
  }

  if (session) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast({ title: 'Email not confirmed', description: 'Please check your inbox and click the confirmation link.', variant: 'destructive' });
          } else {
            throw error;
          }
        } else {
          toast({ title: 'Welcome back!' });
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        setSignupComplete(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (signupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-8">
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">Flash Learn</span>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-strong p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
                className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-success/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-7 h-7 text-success" strokeWidth={1.5} />
              </motion.div>

              <h1 className="font-display text-xl font-semibold tracking-tight mb-2">Check your email</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">We've sent a confirmation link to</p>
              <p className="text-sm font-semibold text-foreground mb-4">{email}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Click the link in the email to activate your account, then come back here to sign in.</p>

              <div className="mt-6 pt-6 border-t border-border/30">
                <button onClick={() => { setSignupComplete(false); setIsLogin(true); }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 mx-auto press">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left panel: Benefits ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative overflow-hidden bg-card border-r border-border/40"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 py-12 w-full">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">Flash Learn</span>
          </div>

          <h2 className="font-display text-3xl xl:text-4xl font-bold tracking-tight leading-tight text-foreground mb-4">
            Learn anything,
            <br />
            <span className="text-primary">remember everything.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-12 max-w-md">
            Join the smartest way to study. AI-powered flashcards that adapt to how you learn.
          </p>

          <div className="space-y-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <b.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed pt-2">{b.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto pt-16">
            <p className="text-xs text-muted-foreground/60">Trusted by students worldwide</p>
          </div>
        </div>
      </motion.div>

      {/* ── Right panel: Auth form ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">Flash Learn</span>
          </div>

          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-8">
            <motion.div variants={fadeUp}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isLogin ? 'Sign in to continue your learning journey' : 'Start studying smarter in seconds'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fadeUp}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Display name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name"
                          className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                      className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6}
                      className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60" />
                  </div>
                </div>

                <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl text-sm font-semibold press mt-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{isLogin ? 'Sign in' : 'Create account'}<ArrowRight className="w-4 h-4 ml-2" /></>}
                </Button>
              </form>
            </motion.div>

            <motion.div variants={fadeUp} className="text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-foreground transition-colors press">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="font-semibold text-primary">{isLogin ? 'Sign up' : 'Sign in'}</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
