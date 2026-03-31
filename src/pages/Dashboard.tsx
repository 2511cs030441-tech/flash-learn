import { useFlashLearnStore } from '@/store/useFlashLearnStore';
import { useAuth } from '@/contexts/AuthContext';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { StatsBento, QuickActionsV2, DueCardsV2 } from '@/components/dashboard/DashboardBento';

export default function Dashboard() {
  const { profile } = useAuth();
  const flashcards = useFlashLearnStore((s) => s.flashcards);
  const now = new Date();
  const dueCards = flashcards.filter(c => new Date(c.next_review) <= now);
  const reviewed = flashcards.filter(c => c.review_count > 0);

  const stats = {
    totalCards: flashcards.length,
    dueToday: dueCards.length,
    streak: 7,
    accuracy: reviewed.length > 0 ? Math.round((reviewed.filter(c => c.difficulty !== 'hard').length / reviewed.length) * 100) : 0,
  };

  const subjects = [...new Set(flashcards.map(c => c.subject))];
  const subjectProgress = subjects.map(subject => {
    const cards = flashcards.filter(c => c.subject === subject);
    const done = cards.filter(c => c.review_count > 0).length;
    return { subject, total: cards.length, done, progress: cards.length > 0 ? Math.round((done / cards.length) * 100) : 0 };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
      <HeroSection
        displayName={profile?.display_name || 'Student'}
        dueCount={stats.dueToday}
        totalCards={stats.totalCards}
      />
      <StatsBento
        totalCards={stats.totalCards}
        dueToday={stats.dueToday}
        streak={stats.streak}
        accuracy={stats.accuracy}
        subjectProgress={subjectProgress}
        subjectCount={subjects.length}
      />
      <QuickActionsV2 />
      <DueCardsV2
        dueCards={dueCards.map(c => ({ id: c.id, front: c.front, subject: c.subject }))}
        totalCards={stats.totalCards}
      />
    </div>
  );
}
