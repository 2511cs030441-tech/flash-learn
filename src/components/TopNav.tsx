import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Brain, MessageSquare, Search, User, LogOut, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFlashLearnStore } from '@/store/useFlashLearnStore';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home', mobileLabel: 'Home' },
  { to: '/flashcards', icon: Brain, label: 'Flashcards', mobileLabel: 'Cards' },
  { to: '/ai-tutor', icon: MessageSquare, label: 'AI Tutor', mobileLabel: 'Tutor' },
  { to: '/search', icon: Search, label: 'Search', mobileLabel: 'Search' },
  { to: '/profile', icon: User, label: 'Profile', mobileLabel: 'Profile' },
];

export function TopNav() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const flashcards = useFlashLearnStore((s) => s.flashcards);
  const now = new Date();
  const dueCount = flashcards.filter((c) => new Date(c.next_review) <= now).length;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        className="sticky top-0 z-50 w-full hidden md:flex justify-center pt-4 px-4"
      >
        <div className="flex items-center gap-1 h-12 px-3 glass-subtle rounded-full transition-shadow duration-300 hover:shadow-[var(--shadow-xl)]">
          <nav className="flex items-center gap-0.5">
            {navItems.map(({ to, icon: Icon, label }, i) => {
              const active = location.pathname === to;
              return (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
                >
                  <NavLink
                    to={to}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200 press relative',
                      active
                        ? 'bg-primary text-primary-foreground shadow-[var(--shadow-sm)]'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80',
                    )}
                  >
                    <Icon className="w-4 h-4" strokeWidth={active ? 2 : 1.5} />
                    <span>{label}</span>
                    {label === 'Flashcards' && dueCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums',
                          active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary',
                        )}
                      >
                        {dueCount}
                      </motion.span>
                    )}
                  </NavLink>
                </motion.div>
              );
            })}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 press"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 press"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span>Sign out</span>
            </motion.button>
          </nav>
        </div>
      </motion.header>

      <motion.nav
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-2xl border-t border-border/40 px-2 pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-lg)]"
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ to, icon: Icon, label, mobileLabel }) => {
            const active = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] relative active:scale-95',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <motion.div
                  animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                    active && 'bg-primary/10',
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2 : 1.5} />
                </motion.div>
                <span className="text-[10px] font-medium whitespace-nowrap">{mobileLabel ?? label}</span>
                {label === 'Flashcards' && dueCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="absolute -top-0.5 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {dueCount}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
