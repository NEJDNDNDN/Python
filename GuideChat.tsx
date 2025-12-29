import React, { useState, useRef, useEffect } from 'react';
import { createGuideChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Button } from './Button';
import { Send, MapPin } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";

interface Props {
  lang: 'en' | 'ar';
}

export const GuideChat: React.FC<Props> = ({ lang }) => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Reset chat when language changes
    setMessages([]);
    const initChat = async () => {
      const chat = createGuideChat(lang);
      setChatSession(chat);
      setIsTyping(true);
      try {
        const welcomePrompt = lang === 'ar' 
            ? "عرف عن نفسك كمرشد سياحي فلسطيني اسمه هادي، ورحب بالضيف بلكنة فلسطينية محببة."
            : "Introduce yourself as Hadi, a Palestinian tour guide, and welcome the guest warmly.";
        
        const res = await chat.sendMessage({ message: welcomePrompt });
        setMessages([{
            id: 'init',
            role: 'model',
            text: res.text || (lang === 'ar' ? "أهلاً وسهلاً!" : "Welcome!"),
            timestamp: Date.now()
        }]);
      } catch (e) {
          console.error(e);
      } finally {
          setIsTyping(false);
      }
    };
    initChat();
  }, [lang]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const result: GenerateContentResponse = await chatSession.sendMessage({ message: userMsg.text });
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text || "...",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsTyping(false);
    }
  };

  const texts = {
    name: lang === 'en' ? 'Hadi: The Guide' : 'هادي: المرشد',
    desc: lang === 'en' ? 'Your companion in discovering beauty and resilience.' : 'رفيقك في رحلة اكتشاف الجمال والصمود.',
    placeholder: lang === 'en' ? 'Ask Hadi about Jerusalem, olive season, or Arabic coffee...' : 'اسأل هادي عن القدس، موسم الزيتون، أو القهوة العربية...',
    thinking: lang === 'en' ? 'Thinking...' : 'يفكر...'
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] lg:h-[700px] flex flex-col rounded-3xl lg:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 relative animate-fade-up old-paper">
        {/* Vintage Header */}
        <div className="bg-palestine-ink text-palestine-paper p-6 lg:p-8 flex items-center gap-4 lg:gap-6 relative overflow-hidden flex-shrink-0 border-b-4 border-palestine-gold/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-palestine-gold opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-palestine-paper rounded-full flex items-center justify-center border-4 border-palestine-gold shadow-lg relative z-10">
                <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-palestine-ink" />
            </div>
            <div className="relative z-10">
                <h3 className={`font-display font-black text-2xl lg:text-3xl mb-1 ${lang === 'en' ? 'tracking-wider' : ''}`}>{texts.name}</h3>
                <p className={`text-xs lg:text-sm text-palestine-gold ${lang === 'en' ? 'font-classic italic' : 'font-serif font-bold'} opacity-90`}>{texts.desc}</p>
            </div>
        </div>

        {/* Chat Area - Parchment style */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 relative">
            {/* Grain overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>

            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>
                    <div className={`max-w-[85%] lg:max-w-[80%] p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-md leading-loose text-base lg:text-lg border ${
                        msg.role === 'user' 
                        ? 'bg-palestine-olive text-white rounded-br-none border-transparent' 
                        : 'bg-white/60 text-palestine-ink rounded-bl-none border-palestine-ink/10'
                    }`}>
                        <p className={`whitespace-pre-line ${lang === 'en' ? 'font-classic font-bold' : 'font-serif font-medium'}`}>{msg.text}</p>
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start relative z-10">
                     <div className="bg-white/50 px-4 py-3 rounded-2xl rounded-bl-none border border-palestine-ink/10 flex items-center gap-2 shadow-sm">
                        <span className="w-2 h-2 bg-palestine-ink/50 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-palestine-ink/50 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-palestine-ink/50 rounded-full animate-bounce delay-200"></span>
                     </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 lg:p-6 bg-palestine-paper/90 border-t border-palestine-ink/10 flex gap-3 lg:gap-4 flex-shrink-0 relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={texts.placeholder}
                className={`flex-1 bg-white/50 border border-palestine-ink/20 rounded-2xl px-4 py-3 lg:px-6 lg:py-4 focus:outline-none focus:ring-2 focus:ring-palestine-olive/50 focus:border-palestine-olive transition-all text-palestine-ink text-base lg:text-lg font-bold placeholder-palestine-ink/40 ${lang === 'en' ? 'font-classic' : 'font-serif'}`}
            />
            <Button type="submit" variant="primary" className="bg-palestine-ink hover:bg-palestine-black border-none rounded-2xl w-12 lg:w-16 flex items-center justify-center p-0 text-palestine-gold">
                <Send className={`w-5 h-5 lg:w-6 lg:h-6 ${lang === 'ar' ? 'transform -rotate-180' : ''}`} />
            </Button>
        </form>
    </div>
  );
};
