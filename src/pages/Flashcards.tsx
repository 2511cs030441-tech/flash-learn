import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Plus, ChevronLeft, ChevronRight, Trash2, Clock, Layers, BookOpen, Sparkles, Trophy, Hash, Pencil, AlertTriangle } from 'lucide-react';
import { useFlashLearnStore, Flashcard } from '@/store/useFlashLearnStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import flashcardsEmptyImg from '@/assets/flashcards-empty.jpg';

const subjectIcons: Record<string, typeof BookOpen> = {
  'General': BookOpen,
  'Biology': Sparkles,
  'Physics': Hash,
  'Computer Science': Layers,
};

// ─── Flip Card ───
function FlipCard({ card, onReview }: { card: Flashcard; onReview: (quality: 'easy' | 'good' | 'hard') => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="w-full max-w-lg mx-auto perspective-1000">
      <motion.div
        className="relative w-full h-72 cursor-pointer"
        onClick={() => setFlipped(!flipped)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 180, damping: 22 }}
      >
        {/* Front */}
        <div className="absolute inset-0 float-card p-8 flex flex-col justify-center items-center text-center backface-hidden">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3"
          >
            <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </motion.div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary mb-3">{card.subject}</span>
          <p className="font-display text-lg font-bold tracking-tight leading-relaxed">{card.front}</p>
          <p className="text-xs text-muted-foreground mt-6 font-medium">tap to flip</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 float-card p-8 flex flex-col justify-center items-center text-center backface-hidden border-success/20"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-success" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-success mb-3">Answer</span>
          <p className="text-[15px] leading-relaxed">{card.back}</p>
        </div>
      </motion.div>
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="flex justify-center gap-3 mt-6"
          >
            <Button size="sm" variant="outline" className="rounded-xl h-10 px-5 font-semibold text-sm text-destructive border-destructive/20 hover:bg-destructive/5 press"
              onClick={(e) => { e.stopPropagation(); onReview('hard'); setFlipped(false); }}>Hard</Button>
            <Button size="sm" variant="outline" className="rounded-xl h-10 px-5 font-semibold text-sm text-primary border-primary/20 hover:bg-primary/5 press"
              onClick={(e) => { e.stopPropagation(); onReview('good'); setFlipped(false); }}>Good</Button>
            <Button size="sm" variant="outline" className="rounded-xl h-10 px-5 font-semibold text-sm text-success border-success/20 hover:bg-success/5 press"
              onClick={(e) => { e.stopPropagation(); onReview('easy'); setFlipped(false); }}>Easy</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Card Form Dialog ───
function CardFormDialog({
  open, onOpenChange, title, initial, onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  initial?: { front: string; back: string; subject: string };
  onSubmit: (front: string, back: string, subject: string) => void;
}) {
  const [front, setFront] = useState(initial?.front ?? '');
  const [back, setBack] = useState(initial?.back ?? '');
  const [subject, setSubject] = useState(initial?.subject ?? '');

  // Reset when dialog opens with new initial values
  const handleOpenChange = (v: boolean) => {
    if (v && initial) {
      setFront(initial.front);
      setBack(initial.back);
      setSubject(initial.subject);
    } else if (v) {
      setFront(''); setBack(''); setSubject('');
    }
    onOpenChange(v);
  };

  const handleSubmit = () => {
    if (!front.trim() || !back.trim()) return;
    onSubmit(front, back, subject || 'General');
    onOpenChange(false);
    setFront(''); setBack(''); setSubject('');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="glass-strong border-border/40 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {title === 'Edit Flashcard' ? 'Update the card details below.' : 'Fill in the question and answer.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Input placeholder="Subject (e.g., Biology)" value={subject} onChange={e => setSubject(e.target.value)}
            className="bg-secondary/50 border-border/40 text-sm rounded-xl h-10 text-foreground" autoFocus />
          <Textarea placeholder="Front (Question)" value={front} onChange={e => setFront(e.target.value)}
            className="bg-secondary/50 border-border/40 text-sm rounded-xl min-h-[80px] text-foreground" />
          <Textarea placeholder="Back (Answer)" value={back} onChange={e => setBack(e.target.value)}
            className="bg-secondary/50 border-border/40 text-sm rounded-xl min-h-[80px] text-foreground" />
          <Button onClick={handleSubmit} disabled={!front.trim() || !back.trim()}
            className="w-full bg-primary text-primary-foreground h-10 text-sm rounded-xl font-semibold press">
            {title === 'Edit Flashcard' ? 'Save Changes' : 'Create Flashcard'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation ───
function DeleteConfirmDialog({
  open, onOpenChange, cardFront, onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cardFront: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/40 rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" strokeWidth={1.5} />
            Delete Card
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-1">
          Are you sure you want to delete "<span className="font-medium text-foreground">{cardFront}</span>"?
        </p>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 rounded-xl h-10 text-sm font-semibold press">
            Cancel
          </Button>
          <Button onClick={() => { onConfirm(); onOpenChange(false); }}
            className="flex-1 rounded-xl h-10 text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 press">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ───
export default function Flashcards() {
  const flashcards = useFlashLearnStore((s) => s.flashcards);
  const reviewCard = useFlashLearnStore((s) => s.reviewCard);
  const addFlashcard = useFlashLearnStore((s) => s.addFlashcard);
  const updateFlashcard = useFlashLearnStore((s) => s.updateFlashcard);
  const removeFlashcard = useFlashLearnStore((s) => s.removeFlashcard);
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id || '';
  const [mode, setMode] = useState<'browse' | 'review' | 'complete'>('browse');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCard, setEditCard] = useState<Flashcard | null>(null);
  const [deleteCard, setDeleteCard] = useState<Flashcard | null>(null);

  const now = new Date();
  const dueCards = flashcards.filter(c => new Date(c.next_review) <= now);
  const subjects = [...new Set(flashcards.map(c => c.subject))];

  const handleReview = (quality: 'easy' | 'good' | 'hard') => {
    reviewCard(dueCards[currentIdx].id, quality);
    if (currentIdx < dueCards.length - 1) setCurrentIdx(currentIdx + 1);
    else { setMode('complete'); setCurrentIdx(0); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="page-title">Flashcards</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span className="font-semibold text-primary">{dueCards.length} due</span> · {flashcards.length} total
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {dueCards.length > 0 && mode === 'browse' && (
            <Button onClick={() => { setMode('review'); setCurrentIdx(0); }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-sm rounded-xl font-semibold press">
              <RotateCcw className="w-4 h-4 mr-1.5" strokeWidth={1.5} /> Review ({dueCards.length})
            </Button>
          )}
          <Button variant="outline" onClick={() => setCreateOpen(true)} className="h-10 text-sm rounded-xl font-semibold press">
            <Plus className="w-4 h-4 mr-1.5" strokeWidth={1.5} /> Create
          </Button>
        </div>
      </motion.div>

      {/* Review Mode */}
      {mode === 'review' && dueCards.length > 0 && (
        <div className="py-4">
          <div className="max-w-lg mx-auto mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Progress</span>
              <span className="tabular-nums font-semibold">{currentIdx + 1} / {dueCards.length}</span>
            </div>
            <Progress value={((currentIdx + 1) / dueCards.length) * 100} className="h-2" />
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl press" onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl press" onClick={() => setCurrentIdx(Math.min(dueCards.length - 1, currentIdx + 1))} disabled={currentIdx >= dueCards.length - 1}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={dueCards[currentIdx]?.id}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <FlipCard card={dueCards[currentIdx]} onReview={handleReview} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Completion */}
      {mode === 'complete' && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="float-card p-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-success/10 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-success" strokeWidth={1.5} />
            </motion.div>
            <h2 className="font-display text-2xl font-bold tracking-tight mb-2">Deck Complete!</h2>
            <p className="text-muted-foreground text-sm">Great work — you reviewed everything.</p>
            <Button onClick={() => setMode('browse')} className="mt-6 bg-primary text-primary-foreground rounded-xl h-10 px-6 font-semibold press">
              Back to Deck
            </Button>
          </div>
        </motion.div>
      )}

      {/* Subjects */}
      {mode === 'browse' && subjects.length > 0 && (
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-4">
            <p className="section-label">Your Decks</p>
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground tabular-nums">{subjects.length} subjects</span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.map((subject, i) => {
              const cards = flashcards.filter(c => c.subject === subject);
              const due = cards.filter(c => new Date(c.next_review) <= now).length;
              const SubjectIcon = subjectIcons[subject] || BookOpen;
              return (
                <motion.div key={subject} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="float-card p-5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                      <SubjectIcon className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold tracking-tight">{subject}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="tabular-nums">{cards.length} cards</span>
                        {due > 0 && <span className="font-semibold text-primary tabular-nums">{due} due</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Cards */}
      {mode === 'browse' && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-4">
            <p className="section-label">All Cards</p>
            <div className="flex-1 h-px bg-border/60" />
          </motion.div>
          {flashcards.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="float-card p-10 text-center">
                <img src={flashcardsEmptyImg} alt="Colorful flashcards" className="w-24 h-24 mx-auto rounded-2xl object-cover mb-5 opacity-90" />
                <h3 className="font-display text-lg font-bold tracking-tight mb-2">No flashcards yet</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">Create your first card to start learning with spaced repetition.</p>
                <Button onClick={() => setCreateOpen(true)} className="mt-5 bg-primary text-primary-foreground rounded-xl h-10 px-6 font-semibold press">
                  <Plus className="w-4 h-4 mr-1.5" /> Create Flashcard
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <AnimatePresence>
                {flashcards.map((card, i) => {
                  const CardIcon = subjectIcons[card.subject] || BookOpen;
                  return (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <div className="float-card p-5 group">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CardIcon className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{card.subject}</span>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button
                              onClick={() => setEditCard(card)}
                              className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => setDeleteCard(card)}
                              className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-medium leading-relaxed mb-1.5">{card.front}</p>
                        <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">{card.back}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1 ${
                            new Date(card.next_review) <= now ? 'bg-primary/8 text-primary' : 'bg-secondary text-muted-foreground'
                          }`}>
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            {new Date(card.next_review) <= now ? 'Due now' : `In ${card.interval}d`}
                          </span>
                          <span className="text-[10px] text-muted-foreground/50 tabular-nums">×{card.review_count}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* Create Dialog */}
      <CardFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Flashcard"
        onSubmit={(front, back, subject) => {
          addFlashcard(userId, front, back, subject);
          toast({ title: '✨ Card created', description: `"${front.substring(0, 40)}..." added to ${subject}.` });
        }}
      />

      {/* Edit Dialog */}
      <CardFormDialog
        open={!!editCard}
        onOpenChange={(v) => { if (!v) setEditCard(null); }}
        title="Edit Flashcard"
        initial={editCard ? { front: editCard.front, back: editCard.back, subject: editCard.subject } : undefined}
        onSubmit={(front, back, subject) => {
          if (editCard) updateFlashcard(editCard.id, front, back, subject);
          setEditCard(null);
          toast({ title: '✅ Card updated', description: 'Your changes have been saved.' });
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteCard}
        onOpenChange={(v) => { if (!v) setDeleteCard(null); }}
        cardFront={deleteCard?.front ?? ''}
        onConfirm={() => {
          if (deleteCard) removeFlashcard(deleteCard.id);
          setDeleteCard(null);
          toast({ title: '🗑️ Card deleted', description: 'The flashcard has been removed.' });
        }}
      />

      {/* Floating Create (mobile) */}
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} onClick={() => setCreateOpen(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-[var(--shadow-xl)]">
        <Plus className="w-6 h-6" strokeWidth={2} />
      </motion.button>
    </div>
  );
}

