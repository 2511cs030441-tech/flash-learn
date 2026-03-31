import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Plus, Globe, BookOpen, Sparkles, FileText, Bookmark, ExternalLink, Microscope, Atom, Check, Loader2 } from 'lucide-react';
import { useFlashLearnStore } from '@/store/useFlashLearnStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import searchEmptyImg from '@/assets/search-empty.jpg';

interface SearchResult { id: string; title: string; snippet: string; source: string; url: string; }

const sourceIcons: Record<string, typeof BookOpen> = {
  'Khan Academy': BookOpen,
  'Biology Online': Microscope,
  'Nature Education': Atom,
  'Study Guide': BookOpen,
  'Academic Resource': FileText,
  'Practice Hub': Sparkles,
};

const MOCK_RESULTS: Record<string, SearchResult[]> = {
  'photosynthesis': [
    { id: '1', title: 'Photosynthesis — Complete Guide', snippet: 'Photosynthesis is the process by which green plants convert sunlight, carbon dioxide, and water into glucose and oxygen.', source: 'Khan Academy', url: '#' },
    { id: '2', title: 'Light-Dependent vs Light-Independent Reactions', snippet: 'Photosynthesis occurs in two stages: light-dependent reactions in thylakoids and the Calvin cycle in stroma.', source: 'Biology Online', url: '#' },
    { id: '3', title: 'Chloroplast Structure and Function', snippet: 'Chloroplasts contain chlorophyll, the green pigment that absorbs light energy for photosynthesis.', source: 'Nature Education', url: '#' },
  ],
  'default': [
    { id: '1', title: 'Introduction to the Topic', snippet: 'This comprehensive guide covers the fundamentals and advanced concepts.', source: 'Study Guide', url: '#' },
    { id: '2', title: 'Key Concepts and Definitions', snippet: 'Understanding the core terminology is essential for mastery.', source: 'Academic Resource', url: '#' },
    { id: '3', title: 'Practice Problems and Examples', snippet: 'Apply your knowledge with practice problems with step-by-step solutions.', source: 'Practice Hub', url: '#' },
  ],
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'web' | 'notes' | 'saved'>('web');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const { addFlashcard } = useFlashLearnStore();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true); setSearched(true);
    setTimeout(() => {
      const key = Object.keys(MOCK_RESULTS).find(k => query.toLowerCase().includes(k)) || 'default';
      setResults(MOCK_RESULTS[key]); setIsSearching(false);
    }, 600);
  };

  const createCardFromResult = (result: SearchResult) => {
    if (!user) return;
    addFlashcard(user.id, result.title, result.snippet, 'Search');
    setSavedIds(prev => new Set(prev).add(result.id));
    toast({ title: '✨ Flashcard created', description: `"${result.title}" added to your deck.` });
  };

  const tabs = [
    { id: 'web' as const, icon: Globe, label: 'Web' },
    { id: 'notes' as const, icon: FileText, label: 'Notes' },
    { id: 'saved' as const, icon: Bookmark, label: 'Saved' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <SearchIcon className="w-5 h-5 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="page-title">Search & Learn</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Find content and turn it into flashcards</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="glass-strong rounded-2xl p-2.5 flex gap-2">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" strokeWidth={1.5} />
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search for any topic..."
            className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50" autoFocus />
        </div>
        <Button onClick={handleSearch} disabled={isSearching} className="rounded-xl h-10 px-5 text-sm font-semibold bg-primary text-primary-foreground press">
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </Button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-secondary/50 p-1 rounded-xl w-fit">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 press relative ${
              activeTab === id ? 'bg-card text-foreground shadow-[var(--shadow-sm)]' : 'text-muted-foreground hover:text-foreground'
            }`}>
            <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isSearching && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.span key={i} className="w-2 h-2 rounded-full bg-primary/40"
                animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-medium">Searching "{query}"...</p>
        </motion.div>
      )}

      {/* Results */}
      {activeTab === 'web' && (
        <AnimatePresence>
          {!isSearching && results.map((result, i) => {
            const SourceIcon = sourceIcons[result.source] || Globe;
            const isSaved = savedIds.has(result.id);
            return (
              <motion.div key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}>
                <div className="float-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <SourceIcon className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{result.source}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/30 ml-auto" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-base font-bold tracking-tight mb-1.5">{result.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.snippet}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => createCardFromResult(result)}
                      disabled={isSaved}
                      className={`text-xs h-8 rounded-xl font-semibold press ${isSaved ? 'text-success border-success/20' : ''}`}>
                      {isSaved ? <Check className="w-3.5 h-3.5 mr-1 text-success" /> : <Plus className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} />}
                      {isSaved ? 'Saved' : 'Save as Card'}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-8 text-primary font-semibold press">
                      <Sparkles className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} /> Ask AI
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}

      {/* Empty states */}
      {activeTab === 'notes' && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="float-card p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-lg font-bold tracking-tight mb-1">No notes yet</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Save content from search to build your notes.</p>
          </div>
        </motion.div>
      )}

      {activeTab === 'saved' && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="float-card p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-lg font-bold tracking-tight mb-1">No saved items</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Bookmark results to access them later.</p>
          </div>
        </motion.div>
      )}

      {activeTab === 'web' && !searched && !isSearching && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
          <motion.img src={searchEmptyImg} alt="Search and discover"
            className="w-28 h-28 mx-auto rounded-2xl object-cover mb-5"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }} />
          <h3 className="font-display text-lg font-bold tracking-tight mb-1">Discover study content</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">Search any topic and turn it into flashcards.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Photosynthesis', icon: Microscope },
              { label: 'React Hooks', icon: Atom },
              { label: "Newton's Laws", icon: BookOpen },
            ].map(({ label, icon: Icon }, i) => (
              <motion.button key={label}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setQuery(label); }}
                className="text-xs px-4 py-2.5 rounded-xl font-medium float-card flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'web' && searched && !isSearching && results.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-sm text-muted-foreground">No results found. Try a different search term.</p>
        </motion.div>
      )}
    </div>
  );
}

