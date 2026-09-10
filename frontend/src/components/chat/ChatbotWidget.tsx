import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Activity, User, Maximize2, Minimize2, Sparkles, AlertCircle } from 'lucide-react';
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
      const response = await fetch('/api/chat', {
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
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-medical-blue to-medical-cyan rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,190,255,0.5)] hover:scale-110 transition-transform z-50 group border border-white/20"
      >
        <Sparkles className="absolute top-2 right-2 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
        <MessageSquare className="w-7 h-7 text-black" />
      </button>
    );
  }

  return (
    <div 
      className={cn(
        "fixed z-50 flex flex-col transition-all duration-300 ease-out shadow-2xl rounded-2xl border border-white/10 overflow-hidden bg-zinc-950/95 backdrop-blur-xl",
        isExpanded 
          ? "top-6 bottom-6 right-6 left-6 md:left-24 lg:left-72" 
          : "bottom-6 right-6 w-[380px] h-[600px] max-h-[85vh]"
      )}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-medical-cyan to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,190,255,0.4)]">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-950"></div>
          </div>
          <div>
            <h3 className="font-semibold text-white text-[15px]">MedVision AI</h3>
            <p className="text-[12px] text-medical-cyan flex items-center gap-1.5 opacity-90">
              <span className="w-1.5 h-1.5 rounded-full bg-medical-cyan animate-pulse"></span>
              Online
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar relative">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md",
              msg.role === 'user' ? "bg-zinc-700" : "bg-gradient-to-br from-medical-cyan to-blue-600"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
            </div>
            <div className={cn(
              "px-4 py-3 rounded-2xl whitespace-pre-wrap text-[14px] leading-relaxed",
              msg.role === 'user' 
                ? "bg-zinc-800 text-white rounded-tr-sm" 
                : "bg-white/10 border border-white/5 text-zinc-100 rounded-tl-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medical-cyan to-blue-600 flex items-center justify-center shrink-0 shadow-md">
              <Activity className="w-4 h-4 text-white animate-spin-slow" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 rounded-tl-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-medical-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-medical-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-medical-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="relative flex items-end gap-2 bg-black/40 border border-white/10 rounded-2xl p-1.5 focus-within:border-medical-cyan/50 focus-within:shadow-[0_0_15px_rgba(0,190,255,0.1)] transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about diagnostics or health..."
            className="w-full bg-transparent px-3 py-2.5 text-[14px] text-white placeholder-zinc-500 focus:outline-none resize-none custom-scrollbar min-h-[44px] max-h-[120px]"
            rows={1}
            style={{
              height: input ? Math.min(Math.max(44, input.split('\n').length * 24 + 20), 120) + 'px' : '44px'
            }}
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-[40px] w-[40px] rounded-xl bg-gradient-to-br from-medical-cyan to-blue-600 hover:opacity-90 text-white shrink-0 p-0 shadow-md transition-all mb-0.5"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
        <div className="text-center mt-3">
          <p className="text-[11px] text-zinc-500">
            AI can make mistakes. Always verify with a doctor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
