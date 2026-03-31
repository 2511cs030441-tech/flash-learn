import { motion } from 'framer-motion';
import { Brain, Clock, Target, Flame, TrendingUp, Zap, Sparkles, BookOpen, ArrowRight, Plus, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import brainImage from '@/assets/brain-learn.jpg';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

// ─── STATS BENTO ───
interface StatsBentoProps {
  totalCards: number;
  dueToday: number;
  streak: number;
  accuracy: number;
  subjectProgress: { subject: string; total: number; done: number; progress: number }[];
  subjectCount: number;
}

export function StatsBento({ totalCards, dueToday, streak, accuracy, subjectProgress, subjectCount }: StatsBentoProps) {
  const navigate = useNavigate();

  const weekData = [
    { day: 'Mon', cards: 12 },
    { day: 'Tue', cards: 8 },
    { day: 'Wed', cards: 15 },
    { day: 'Thu', cards: 6 },
    { day: 'Fri', cards: 20 },
    { day: 'Sat', cards: 10 },
    { day: 'Sun', cards: totalCards > 0 ? 14 : 0 },
  ];

  const accuracyData = [{ value: accuracy, fill: 'hsl(var(--primary))' }];

  return (
    <div>
      <motion.div {...fadeUp(0.05)} className="flex items-center gap-3 mb-5">
        <p className="section-label">Your Progress</p>
        <div className="flex-1 h-px bg-border/60" />
      </motion.div>

      <div className="grid grid-cols-12 gap-3">
        {/* Streak */}
        <motion.div {...fadeUp(0.08)} className="col-span-12 sm:col-span-6 md:col-span-3">
          <div className="float-card p-5 h-full min-h-[160px] flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
              <Flame className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Streak</p>
              <p className="font-display text-3xl font-bold tracking-tight mt-0.5 tabular-nums">
                {streak}<span className="text-sm font-medium text-muted-foreground ml-1">days</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div {...fadeUp(0.12)} className="col-span-12 sm:col-span-6 md:col-span-5">
          <div className="float-card p-5 h-full min-h-[160px] flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Weekly Activity</p>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px', boxShadow: 'var(--shadow-lg)' }}
                    labelStyle={{ fontWeight: 600, fontFamily: 'Space Grotesk' }}
                  />
                  <Area type="monotone" dataKey="cards" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorCards)" dot={{ r: 2.5, fill: 'hsl(var(--primary))', strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 2, stroke: 'hsl(var(--card))' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Accuracy ring */}
        <motion.div {...fadeUp(0.16)} className="col-span-12 md:col-span-4">
          <div className="float-card p-5 h-full min-h-[160px] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={7} data={accuracyData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background={{ fill: 'hsl(var(--muted) / 0.5)' }} dataKey="value" angleAxisId={0} cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Accuracy</p>
                <p className="font-display text-3xl font-bold tracking-tight mt-0.5 tabular-nums">
                  {accuracy}
                  <span className="text-sm text-muted-foreground">%</span>
                </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accuracy >= 80 ? 'Excellent' : accuracy >= 50 ? 'Good progress' : 'Keep practicing'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mini stats */}
        <motion.div {...fadeUp(0.18)} className="col-span-6 sm:col-span-3 md:col-span-2">
          <div className="float-card p-4 h-full min-h-[90px] flex flex-col justify-between text-center">
            <Brain className="w-5 h-5 text-primary mx-auto" strokeWidth={1.5} />
            <div>
              <p className="font-display text-2xl font-bold tabular-nums">{totalCards}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Cards</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="col-span-6 sm:col-span-3 md:col-span-2">
          <div className={`float-card p-4 h-full min-h-[90px] flex flex-col justify-between text-center ${dueToday > 0 ? 'border-primary/20' : ''}`}>
            <Clock className="w-5 h-5 text-primary mx-auto" strokeWidth={1.5} />
            <div>
              <p className="font-display text-2xl font-bold tabular-nums">{dueToday}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.14em]">Due</p>
            </div>
          </div>
        </motion.div>

        {/* Study Plan */}
        <motion.div {...fadeUp(0.22)} className="col-span-12 md:col-span-8">
          <div className="float-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-5 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold tracking-tight">Today's Study Plan</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{dueToday} cards - {subjectCount} subjects</p>
                </div>
              </div>
              {dueToday > 0 && (
                <Button onClick={() => navigate('/flashcards')} size="sm" className="group bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold text-xs h-9 px-4 press">
                  Continue <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              )}
            </div>
            {subjectProgress.length > 0 ? (
              <div className="space-y-4">
                {subjectProgress.slice(0, 4).map(({ subject, total, done, progress }) => (
                  <div key={subject} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{subject}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{done}/{total}</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No subjects yet — create some flashcards to get started.</p>
                <Button variant="outline" size="sm" className="mt-3 rounded-xl text-xs font-semibold press" onClick={() => navigate('/flashcards')}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Create Flashcard
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── QUICK ACTIONS ───
const actions = [
  { icon: Zap, label: 'Start Review', desc: 'Jump into due cards', to: '/flashcards' },
  { icon: Plus, label: 'Create Card', desc: 'Add new flashcard', to: '/flashcards' },
  { icon: Sparkles, label: 'AI Study Buddy', desc: 'Get explanations', to: '/ai-tutor' },
  { icon: BookOpen, label: 'Search & Learn', desc: 'Explore content', to: '/search' },
];

export function QuickActionsV2() {
  const navigate = useNavigate();

  return (
    <div>
      <motion.div {...fadeUp(0.05)} className="flex items-center gap-3 mb-4">
        <p className="section-label">Quick Actions</p>
        <div className="flex-1 h-px bg-border/60" />
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map(({ icon: Icon, label, desc, to }, i) => (
          <motion.div key={label} {...fadeUp(0.08 + i * 0.03)}>
            <div
              onClick={() => navigate(to)}
              className="float-card p-5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-200">
                <Icon className="w-[18px] h-[18px] text-primary" strokeWidth={1.5} />
              </div>
              <p className="font-display text-sm font-bold tracking-tight">{label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── DUE CARDS ───
interface DueCard { id: string; front: string; subject: string; }
interface DueCardsV2Props { dueCards: DueCard[]; totalCards: number; }

export function DueCardsV2({ dueCards, totalCards }: DueCardsV2Props) {
  const navigate = useNavigate();

  if (dueCards.length > 0) {
    return (
      <div>
        <motion.div {...fadeUp(0.02)} className="flex items-center justify-between mb-4">
          <p className="section-label">Due for Review</p>
          <Button variant="ghost" size="sm" onClick={() => navigate('/flashcards')} className="text-primary text-xs h-8 font-semibold press">
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dueCards.slice(0, 3).map((card, i) => (
            <motion.div key={card.id} {...fadeUp(i * 0.05)}>
              <div onClick={() => navigate('/flashcards')} className="float-card p-5 cursor-pointer group">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{card.subject}</span>
                </div>
                <p className="text-sm font-medium line-clamp-2 leading-relaxed">{card.front}</p>
                <p className="mt-3 text-[11px] text-muted-foreground group-hover:text-primary transition-colors duration-200 font-semibold">Review →</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (totalCards === 0) {
    return (
      <motion.div {...fadeUp(0.3)}>
        <div className="float-card p-10 text-center">
          <img src={brainImage} alt="" className="w-16 h-16 mx-auto rounded-2xl object-cover mb-4 opacity-70" />
          <h3 className="font-display text-lg font-bold tracking-tight mb-1">Start your learning adventure</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">Create your first flashcard and study with spaced repetition.</p>
          <Button onClick={() => navigate('/flashcards')} className="mt-5 bg-primary text-primary-foreground rounded-xl h-10 px-6 font-semibold text-sm press">
            <Plus className="w-4 h-4 mr-1.5" /> Create Flashcard
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...fadeUp(0.3)}>
      <div className="float-card p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-success/10 flex items-center justify-center">
          <Target className="w-6 h-6 text-success" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-lg font-bold tracking-tight mb-1">All caught up!</h3>
        <p className="text-sm text-muted-foreground">No cards due for review right now.</p>
      </div>
    </motion.div>
  );
}

