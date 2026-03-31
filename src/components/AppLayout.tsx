import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { useInitializeStore } from '@/hooks/use-initialize-store';
import { useFlashLearnStore } from '@/store/useFlashLearnStore';
import { Loader2 } from 'lucide-react';

const FULL_HEIGHT_ROUTES = ['/ai-tutor'];

export function AppLayout({ children }: { children: ReactNode }) {
  useInitializeStore();
  const loading = useFlashLearnStore((s) => s.loading);
  const initialized = useFlashLearnStore((s) => s.initialized);
  const location = useLocation();
  const isFullHeight = FULL_HEIGHT_ROUTES.includes(location.pathname);

  return (
    <div className="app-shell min-h-screen flex flex-col relative">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-20 left-[-10%] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-[-8%] h-72 w-72 rounded-full bg-success/10 blur-3xl" />
      </div>
      <TopNav />
      <main className={`flex-1 max-w-6xl mx-auto px-4 md:px-6 w-full flex flex-col ${
        isFullHeight ? 'py-4 md:py-6' : 'py-6 md:py-10 pb-24 md:pb-10'
      }`}>
        <AnimatePresence mode="wait">
          {!initialized && loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 gap-3"
            >
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-medium">Loading your study data...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={isFullHeight ? 'flex-1 flex flex-col min-h-0' : ''}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {!isFullHeight && <Footer />}
    </div>
  );
}
