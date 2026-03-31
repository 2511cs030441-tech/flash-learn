import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  iconVariant?: 'primary' | 'success' | 'accent';
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, iconVariant = 'primary' }: EmptyStateProps) {
  const containerClass = iconVariant === 'success'
    ? 'icon-container-success'
    : iconVariant === 'accent'
      ? 'icon-container-accent'
      : 'icon-container';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="surface-glass p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className={`${containerClass} w-16 h-16 mx-auto mb-4`}
      >
        <Icon className={`w-8 h-8 ${iconVariant === 'success' ? 'text-success' : 'text-primary'}`} strokeWidth={1.3} />
      </motion.div>
      <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5 bg-primary text-primary-foreground rounded-xl h-10 px-6">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
