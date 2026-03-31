import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Trash2, Lightbulb, BookOpen, Brain, ListChecks, MessageSquare, Plus, ArrowRight, GraduationCap, Zap, Copy, Check } from 'lucide-react';
import { useFlashLearnStore } from '@/store/useFlashLearnStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import aiTutorImg from '@/assets/ai-tutor-empty.jpg';

const AI_RESPONSES: Record<string, string> = {
  default: "I'm your AI tutor! Ask me anything about your studies. I can explain concepts, help you create flashcards, or quiz you on topics. What would you like to learn today?",
  flashcard: "Great idea! I've noted that. You can create a flashcard from my explanations by clicking the **Create Flashcard** button. What concept would you like to study?",
  explain: "Let me break that down for you in a simpler way. Complex topics become easier when we approach them step by step. Could you tell me which specific part you'd like me to elaborate on?",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('flashcard') || lower.includes('card')) return AI_RESPONSES.flashcard;
  if (lower.includes('explain') || lower.includes('simple') || lower.includes('help')) return AI_RESPONSES.explain;
  if (lower.includes('newton') || lower.includes('physics')) {
    return "**Newton's Laws of Motion** are fundamental to classical mechanics:\n\n1. **First Law (Inertia):** An object at rest stays at rest unless acted upon by an external force.\n\n2. **Second Law:** F = ma — Force equals mass times acceleration.\n\n3. **Third Law:** For every action, there is an equal and opposite reaction.\n\nWould you like me to create flashcards for these?";
  }
  if (lower.includes('react') || lower.includes('hook') || lower.includes('component')) {
    return "**React Hooks** let you use state and lifecycle features in functional components:\n\n- `useState` — manage local state\n- `useEffect` — handle side effects\n- `useContext` — access context values\n- `useMemo` / `useCallback` — optimize performance\n\nHooks must be called at the **top level** of your component. Want me to explain any specific hook?";
  }
  if (lower.includes('mcq') || lower.includes('quiz') || lower.includes('test')) {
    return "Here are 5 quick MCQs:\n\n**1.** What is the powerhouse of the cell?\n- A) Nucleus\n- B) Mitochondria ✅\n- C) Ribosome\n\n**2.** F = ma is known as?\n- A) First Law\n- B) Second Law ✅\n- C) Third Law\n\n**3.** What does `useState` return?\n- A) A value\n- B) An array with value and setter ✅\n- C) An object\n\n**4.** Photosynthesis produces?\n- A) CO₂\n- B) Glucose and O₂ ✅\n- C) Water\n\n**5.** Binary search complexity?\n- A) O(n)\n- B) O(log n) ✅\n- C) O(n²)";
  }
  return "That's a great question! I can help you understand concepts, break down complex topics, or create study materials. Try asking me to:\n\n- **Explain** a concept\n- **Compare** two ideas\n- **Quiz** you on a topic\n\nWhat would you like to explore?";
}

const suggestionItems = [
  { icon: Lightbulb, label: "Explain Newton's Laws", color: 'text-amber-500' },
  { icon: ListChecks, label: 'Give me 5 MCQs on Biology', color: 'text-emerald-500' },
  { icon: BookOpen, label: 'Teach me React Hooks', color: 'text-blue-500' },
  { icon: Brain, label: 'Summarize photosynthesis', color: 'text-purple-500' },
];

export default function AITutor() {
  const { chatMessages, addChatMessage, clearChat, addFlashcard } = useFlashLearnStore();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  const userId = user?.id || '';

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isTyping || !userId) return;
    setInput('');
    addChatMessage(userId, 'user', msg);
    setIsTyping(true);
    setTimeout(() => {
      addChatMessage(userId, 'assistant', getAIResponse(msg));
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSaveAsFlashcard = (content: string) => {
    if (!userId) return;
    const lines = content.split('\n').filter(l => l.trim());
    const front = lines[0]?.replace(/\*\*/g, '').substring(0, 100) || 'AI Response';
    addFlashcard(userId, front, content.substring(0, 300), 'AI Tutor');
    toast({ title: '✨ Saved as Flashcard', description: 'Added to your study deck.' });
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content.replace(/\*\*/g, ''));
    setCopiedId(id);
    toast({ title: '📋 Copied!', description: 'Response copied to clipboard.' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Auto-scroll
  const messagesEndRef = (node: HTMLDivElement | null) => {
    node?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col flex-1 min-h-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="page-title text-xl">AI Study Buddy</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <p className="text-xs text-muted-foreground">Online �- Ready to help</p>
            </div>
          </div>
        </div>
        {chatMessages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => { clearChat(userId); toast({ title: '🗑️ Chat cleared' }); }}
            className="text-muted-foreground text-xs h-8 rounded-xl press">
            <Trash2 className="w-3.5 h-3.5 mr-1" strokeWidth={1.5} /> Clear
          </Button>
        )}
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
        {chatMessages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center px-4">
            <motion.img src={aiTutorImg} alt="AI Tutor" className="w-24 h-24 rounded-2xl object-cover mb-5"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }} />
            <h2 className="font-display text-xl font-bold tracking-tight mb-2">Hi! I'm your AI Study Buddy</h2>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
              Ask me anything — I'll explain, quiz, and summarize.
            </p>
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-md">
              {suggestionItems.map(({ icon: Icon, label, color }, i) => (
                <motion.button key={label}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleSend(label)}
                  className="text-[13px] p-4 flex items-center gap-2.5 text-left rounded-2xl float-card font-medium">
                  <div className="w-7 h-7 rounded-lg bg-secondary/80 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-3.5 h-3.5 ${color}`} strokeWidth={1.5} />
                  </div>
                  <span className="line-clamp-1">{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {chatMessages.map((msg, idx) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: idx === chatMessages.length - 1 ? 0.05 : 0 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="w-7 h-7 flex-shrink-0 mt-1 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
                </motion.div>
              )}
              <div className="flex flex-col max-w-[78%]">
                <div className={`px-4 py-3 ${
                  msg.role === 'user'
                    ? 'rounded-2xl rounded-br-md bg-primary text-primary-foreground text-sm'
                    : 'rounded-2xl rounded-bl-md float-card'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none text-[13px] leading-relaxed text-foreground [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs [&_strong]:text-foreground">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-[13px] leading-relaxed">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'assistant' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="flex gap-1 mt-1.5 ml-1">
                    <button onClick={() => handleSaveAsFlashcard(msg.content)}
                      className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/5 transition-all duration-200 press">
                      <Plus className="w-3 h-3" /> Save as Card
                    </button>
                    <button onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/5 transition-all duration-200 press">
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                    <button onClick={() => handleSend('Explain this more simply')}
                      className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/5 transition-all duration-200 press">
                      <MessageSquare className="w-3 h-3" /> Simplify
                    </button>
                    <button onClick={() => handleSend('Tell me more about this')}
                      className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/5 transition-all duration-200 press">
                      <ArrowRight className="w-3 h-3" /> More
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 flex-shrink-0 mt-1 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="rounded-2xl rounded-bl-md float-card px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
                  animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="mt-4 glass-strong rounded-2xl p-2 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/50" autoFocus />
        <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping}
          className="rounded-xl px-4 h-10 bg-primary text-primary-foreground font-semibold press">
          <Send className="w-[18px] h-[18px]" strokeWidth={1.5} />
        </Button>
      </motion.div>
    </div>
  );
}

