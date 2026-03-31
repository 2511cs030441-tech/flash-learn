import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Target, Bell, Moon, Cloud, Mail, Clock, Brain, Download, Shield, ChevronRight, Edit3, TrendingUp, LogOut, Award, Flame, Zap, Star, Check, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFlashLearnStore } from '@/store/useFlashLearnStore';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import profileHeroImg from '@/assets/profile-hero.jpg';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

export default function Profile() {
  const flashcards = useFlashLearnStore((s) => s.flashcards);
  const reviewed = flashcards.filter(c => c.review_count > 0);
  const weeklyGoal = 70;
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.display_name || '');

  const handleSaveName = async () => {
    if (!user || !editName.trim()) return;
    const { error } = await supabase.from('profiles').update({ display_name: editName.trim() }).eq('id', user.id);
    if (!error) {
      toast({ title: 'Profile updated', description: 'Your display name has been saved.' });
      await refreshProfile();
      setEditing(false);
    } else {
      toast({ title: 'Error', description: 'Could not update profile. Try again.' });
    }
  };

  const stats = [
    { icon: Brain, label: 'Cards Created', value: flashcards.length, color: 'text-blue-500' },
    { icon: BookOpen, label: 'Studied', value: reviewed.length, color: 'text-emerald-500' },
    { icon: Clock, label: 'Time Spent', value: '2.5h', color: 'text-amber-500' },
    { icon: TrendingUp, label: 'Accuracy', value: reviewed.length > 0 ? `${Math.round((reviewed.filter(c => c.difficulty !== 'hard').length / reviewed.length) * 100)}%` : '0%', color: 'text-purple-500' },
  ];

  const achievements = [
    { icon: Flame, label: 'Week Warrior', desc: '7-day streak', unlocked: true, color: 'text-orange-500' },
    { icon: Brain, label: 'Card Master', desc: '50+ cards', unlocked: flashcards.length >= 50, color: 'text-blue-500' },
    { icon: Zap, label: 'Speed Learner', desc: '10 in 5min', unlocked: false, color: 'text-yellow-500' },
    { icon: Star, label: 'Perfect Score', desc: '100% accuracy', unlocked: false, color: 'text-amber-500' },
    { icon: BookOpen, label: 'Bookworm', desc: '100+ reviews', unlocked: reviewed.length >= 100, color: 'text-emerald-500' },
    { icon: Award, label: 'Champion', desc: '30-day streak', unlocked: false, color: 'text-purple-500' },
  ];

  const pieData = [
    { name: 'Reviewed', value: reviewed.length || 1, color: 'hsl(var(--primary))' },
    { name: 'Remaining', value: Math.max(0, flashcards.length - reviewed.length) || 1, color: 'hsl(var(--muted))' },
  ];

  const subjects = [...new Set(flashcards.map(c => c.subject))];
  const subjectData = subjects.slice(0, 3).map(subject => {
    const cards = flashcards.filter(c => c.subject === subject);
    const done = cards.filter(c => c.review_count > 0).length;
    return { subject, cards: cards.length, progress: cards.length > 0 ? Math.round((done / cards.length) * 100) : 0 };
  });

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Profile Header */}
      <motion.div {...fadeUp()}>
        <div className="float-card p-6 md:p-8">
          <div className="flex items-start gap-5">
            <div className="relative">
              <img src={profileHeroImg} alt="Profile" className="w-16 h-16 rounded-2xl object-cover" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-card flex items-center justify-center">
                <span className="text-[8px] text-success-foreground">v</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  {editing ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Input value={editName} onChange={e => setEditName(e.target.value)}
                        className="h-9 text-lg font-bold w-full sm:w-48 rounded-xl" autoFocus
                        onKeyDown={e => e.key === 'Enter' && handleSaveName()} />
                      <Button size="icon" variant="ghost" onClick={handleSaveName} className="h-8 w-8 rounded-lg text-success">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditing(false)} className="h-8 w-8 rounded-lg text-muted-foreground">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <h1 className="page-title">{profile?.display_name || 'Student'}</h1>
                  )}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                    <p className="text-sm text-muted-foreground">{user?.email || 'student@flashlearn.app'}</p>
                  </div>
                </div>
                {!editing && (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { setEditName(profile?.display_name || ''); setEditing(true); }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200">
                    <Edit3 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  </motion.button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-primary/8 text-primary flex items-center gap-1">
                  <Award className="w-3 h-3" /> {flashcards.length >= 50 ? 'Advanced' : flashcards.length >= 10 ? 'Intermediate' : 'Beginner'}
                </span>
                <span className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-success/8 text-success flex items-center gap-1">
                  <Flame className="w-3 h-3" /> 7-day streak
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.06)} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} {...fadeUp(0.08 + i * 0.03)}>
            <div className="float-card p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center mx-auto mb-2.5">
                <Icon className={`w-[18px] h-[18px] ${color}`} strokeWidth={1.5} />
              </div>
              <p className="font-display text-xl font-bold tabular-nums">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase tracking-[0.14em]">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Weekly Goal + Pie */}
      <div className="grid grid-cols-12 gap-3">
        <motion.div {...fadeUp(0.16)} className="col-span-12 sm:col-span-8">
          <div className="float-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-sm font-bold tracking-tight">This Week's Goal</h3>
              </div>
              <span className="font-display text-lg font-bold text-primary tabular-nums">{weeklyGoal}%</span>
            </div>
            <Progress value={weeklyGoal} className="h-2" />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">{reviewed.length} / {flashcards.length} cards reviewed</p>
              <p className="text-xs font-bold text-success">+12%</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.18)} className="col-span-12 sm:col-span-4">
          <div className="float-card p-4 h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={30} strokeWidth={0}>
                    {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-[0.14em]">Reviewed</p>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div {...fadeUp(0.2)}>
        <div className="flex items-center gap-3 mb-3">
          <p className="section-label">Achievements</p>
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-xs text-muted-foreground tabular-nums">{achievements.filter(a => a.unlocked).length} earned</span>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
          {achievements.map(({ icon: Icon, label, desc, unlocked, color }) => (
            <motion.div key={label} whileHover={unlocked ? { y: -2, scale: 1.02 } : {}} className={`float-card p-3 text-center transition-opacity ${!unlocked && 'opacity-35'}`}>
              <div className={`w-8 h-8 rounded-lg ${unlocked ? 'bg-secondary/80' : 'bg-muted/50'} flex items-center justify-center mx-auto mb-1.5`}>
                <Icon className={`w-4 h-4 ${unlocked ? color : 'text-muted-foreground'}`} strokeWidth={1.5} />
              </div>
              <p className="text-[10px] font-bold leading-tight">{label}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Study Goals - Dynamic from real data */}
      {subjectData.length > 0 && (
        <motion.div {...fadeUp(0.24)}>
          <div className="flex items-center gap-3 mb-3">
            <p className="section-label">Study Progress</p>
            <div className="flex-1 h-px bg-border/60" />
          </div>
          <div className="space-y-2.5">
            {subjectData.map(({ subject, cards, progress }) => (
              <div key={subject} className="float-card p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{subject}</span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">{cards} cards</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
                <span className="text-xs font-bold w-10 text-right tabular-nums text-primary">{progress}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Settings */}
      <motion.div {...fadeUp(0.28)}>
        <div className="flex items-center gap-3 mb-3">
          <p className="section-label">Settings</p>
          <div className="flex-1 h-px bg-border/60" />
        </div>
        <div className="float-card p-4 space-y-0.5">
          <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-secondary/50 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-secondary/80 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium">Daily reminders</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Get notified about due cards</p>
              </div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-secondary/50 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-secondary/80 flex items-center justify-center">
                <Moon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">Switch color theme</p>
              </div>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
          {[
            { icon: Cloud, label: 'Cloud sync', desc: 'Sync across devices' },
            { icon: Download, label: 'Export data', desc: 'Download flashcards' },
            { icon: Shield, label: 'Privacy', desc: 'Manage your data' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-secondary/50 transition-colors duration-200 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-secondary/80 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-200" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sign Out */}
      <motion.div {...fadeUp(0.32)}>
        <motion.button whileTap={{ scale: 0.98 }} onClick={signOut}
          className="w-full float-card p-4 flex items-center gap-3 border-destructive/10 hover:border-destructive/20 group">
          <LogOut className="w-4 h-4 text-destructive" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-destructive">Sign out</span>
        </motion.button>
      </motion.div>
    </div>
  );
}




