import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Activity, User, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am MedVision AI. How can I help you understand your health data today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I am currently having trouble connecting to the network. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-medical-blue to-medical-cyan rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,190,255,0.5)] hover:scale-110 transition-transform z-50 group border-2 border-white/20"
      >
        <Sparkles className="absolute top-2 right-2 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
        <MessageSquare className="w-7 h-7 text-black" />
      </button>
    );
  }

  return (
    <div 
      className={cn(
        "fixed z-50 transition-all duration-500 ease-out flex flex-col overflow-hidden animate-fade-in-up shadow-[0_0_50px_rgba(0,190,255,0.15)] rounded-2xl border border-white/20",
        isExpanded 
          ? "top-6 bottom-6 right-6 left-6 md:left-24 lg:left-72" 
          : "bottom-6 right-6 w-[400px] h-[650px] max-h-[85vh]"
      )}
    >
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 z-[-2] bg-zinc-950"></div>
      
      {/* Moving gradient orbs */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] z-[-1] opacity-40 mix-blend-screen pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 190, 255, 0.15), transparent 60%)',
        animation: 'spin 20s linear infinite'
      }}></div>
      <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] z-[-1] opacity-30 mix-blend-screen pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.15), transparent 60%)',
        animation: 'spin 15s linear infinite reverse'
      }}></div>

      {/* Glass overlay */}
      <div className="absolute inset-0 z-[-1] bg-black/40 backdrop-blur-3xl pointer-events-none"></div>
      
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-black/60 to-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-cyan to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,190,255,0.5)]">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-900"></div>
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide">MedVision AI</h3>
            <p className="text-xs text-medical-cyan flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-medical-cyan animate-pulse"></span>
              Intelligence Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden md:block"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar relative z-10">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex gap-3 max-w-[85%] group animate-fade-in-up",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
              msg.role === 'user' ? "bg-zinc-700" : "bg-gradient-to-br from-medical-cyan to-blue-600"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl whitespace-pre-wrap text-[15px] leading-relaxed shadow-xl",
              msg.role === 'user' 
                ? "bg-gradient-to-br from-zinc-800 to-zinc-900 text-white rounded-tr-sm border border-white/10" 
                : "bg-white/10 backdrop-blur-md border border-white/20 text-zinc-100 rounded-tl-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] animate-fade-in-up">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-cyan to-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,190,255,0.3)]">
              <Activity className="w-4 h-4 text-white animate-spin-slow" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 rounded-tl-sm flex items-center gap-2 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-medical-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-medical-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-medical-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md relative z-10">
        <div className="relative flex items-end gap-3 bg-black/40 border border-white/20 rounded-2xl p-1.5 focus-within:border-medical-cyan/50 focus-within:shadow-[0_0_20px_rgba(0,190,255,0.15)] transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about diagnostics, X-Rays, or health..."
            className="w-full bg-transparent px-4 py-3 text-[15px] text-white placeholder-zinc-500 focus:outline-none resize-none custom-scrollbar min-h-[48px] max-h-[150px]"
            rows={1}
            style={{
              height: input ? `${Math.min(e => e.target.scrollHeight, 150)}px` : '48px'
            }}
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-[44px] w-[44px] rounded-xl bg-gradient-to-br from-medical-cyan to-blue-600 hover:opacity-90 text-white shrink-0 p-0 shadow-[0_0_15px_rgba(0,190,255,0.4)] transition-all"
          >
            <Send className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="text-center mt-3">
          <p className="text-[11px] text-zinc-500 font-medium">
            MedVision AI can make mistakes. Always verify with a real doctor.
          </p>
        </div>
      </div>
      
      {/* Add keyframe for spin locally if tailwind doesn't have it natively for slow spins */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default ChatbotWidget;
