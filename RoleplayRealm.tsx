import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Button } from './Button';
import { Send, User, Bot, Sparkles, MessageCircle } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";

const SCENARIOS = [
  { id: 'cafe', title: 'Parisian Café', icon: '☕', prompt: 'You are a waiter in a busy café in Paris. The user is a customer ordering coffee and a croissant.', lang: 'French' },
  { id: 'market', title: 'Tokyo Market', icon: '🍣', prompt: 'You are a fishmonger at Tsukiji Outer Market. The user is a tourist asking about fresh sushi.', lang: 'Japanese' },
  { id: 'train', title: 'Berlin Station', icon: '🚆', prompt: 'You are a ticket conductor in Berlin. The user is lost and trying to find the train to Munich.', lang: 'German' },
  { id: 'hotel', title: 'Cancún Resort', icon: '🌴', prompt: 'You are a concierge at a hotel in Cancún. The user is asking about booking a tour to Chichen Itza.', lang: 'Spanish' },
];

export const RoleplayRealm: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startScenario = async (scenarioId: string) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    setSelectedScenario(scenarioId);
    setMessages([]);
    setIsTyping(true);

    try {
      const chat = createChatSession(scenario.prompt, scenario.lang);
      setChatSession(chat);

      // Initial greeting
      const result: GenerateContentResponse = await chat.sendMessage({ message: "Start the conversation with a greeting." });
      const text = result.text || "Hello!";
      
      setMessages([{
        id: 'init',
        role: 'model',
        text: text,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error("Failed to start chat", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
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

  if (!selectedScenario) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => startScenario(scenario.id)}
            className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-brand-500 rounded-3xl p-6 text-left transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <MessageCircle className="w-24 h-24" />
            </div>
            <div className="text-4xl mb-4">{scenario.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{scenario.title}</h3>
            <p className="text-slate-400 text-sm mb-4">{scenario.prompt}</p>
            <span className="inline-block px-3 py-1 bg-brand-900/50 text-brand-300 text-xs font-bold rounded-full border border-brand-700">
              Practice {scenario.lang}
            </span>
          </button>
        ))}
      </div>
    );
  }

  const activeScenario = SCENARIOS.find(s => s.id === selectedScenario);

  return (
    <div className="flex flex-col h-[600px] max-w-3xl mx-auto bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-xl">
            {activeScenario?.icon}
          </div>
          <div>
            <h3 className="font-bold text-white">{activeScenario?.title}</h3>
            <p className="text-xs text-brand-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Tutor Active
            </p>
          </div>
        </div>
        <Button 
            variant="ghost" 
            onClick={() => setSelectedScenario(null)}
            className="text-xs px-3 py-2 h-auto"
        >
            Change Scenario
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-600' : 'bg-brand-600'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-700 text-slate-100 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-500 text-sm ml-12 animate-pulse">
            <span>typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            autoFocus
          />
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!inputText.trim() || isTyping}
            className="w-12 px-0 rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};