import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User as UserIcon,
  ChevronDown,
  Minimize2,
  Maximize2,
  Sprout,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateFarmerAiResponse } from '../../services/aiAssistantService';
import { ChatMessage } from '../../types';

export const AiFarmerAssistant: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages = [],
    addChatMessage,
    clearChat,
    user,
    language,
    t,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showPreviewBubble, setShowPreviewBubble] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickQuestions = [
    t?.chatPreset1 || 'How to control stem borer in Paddy?',
    t?.chatPreset2 || 'Urea & DAP fertilizer dosage guide',
    t?.chatPreset3 || 'Check today mandi wholesale rate',
    t?.chatPreset4 || 'Precaution for rain & spraying',
  ].filter(Boolean);

  const inputFieldRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom & focus input when opening
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        inputFieldRef.current?.focus();
      }, 100);
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (addChatMessage) {
      addChatMessage(userMsg);
    }
    setInputText('');
    setIsTyping(true);

    try {
      // Call Google Gemini Chat Backend Endpoint
      const historyPayload = (chatMessages || []).slice(-6).map((m) => ({ sender: m.sender, text: m.text }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          language,
          farmerProfile: user,
          history: historyPayload,
        }),
      });

      const data = await response.json();

      if (data && data.success && data.text) {
        const botMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'bot',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedPrompts: Array.isArray(data.suggestedPrompts) ? data.suggestedPrompts : [],
        };
        addChatMessage?.(botMsg);
      } else {
        // Fallback to local rule engine
        const reply = generateFarmerAiResponse(messageContent, language as any);
        const botMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'bot',
          text: reply.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedPrompts: reply.suggestedPrompts || [],
        };
        addChatMessage?.(botMsg);
      }
    } catch {
      const reply = generateFarmerAiResponse(messageContent, language as any);
      const botMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'bot',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: reply.suggestedPrompts || [],
      };
      addChatMessage?.(botMsg);
    } finally {
      setIsTyping(false);
    }
  };

  // Browser Speech Recognition Support (Voice Input)
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Match recognition language to active app language
      recognition.lang =
        language === 'hi'
          ? 'hi-IN'
          : language === 'te'
          ? 'te-IN'
          : language === 'ml'
          ? 'ml-IN'
          : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Browser Text-to-Speech Output (Voice Readout)
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      language === 'hi'
        ? 'hi-IN'
        : language === 'te'
        ? 'te-IN'
        : language === 'ml'
        ? 'ml-IN'
        : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Toggle & Assistant Preview (Clean Minimalism theme) */}
      {!isChatOpen && (
        <div className="fixed bottom-20 md:bottom-8 right-5 sm:right-8 z-40 flex flex-col items-end gap-2.5">
          {/* Subtle Assistant Preview Bubble */}
          {showPreviewBubble && (
            <div className="hidden sm:block bg-white border border-green-100 shadow-xl rounded-2xl p-3.5 w-72 mb-1 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-green-950">AI Farmer Assistant</p>
                </div>
                <button
                  onClick={() => setShowPreviewBubble(false)}
                  className="text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p
                onClick={() => setIsChatOpen(true)}
                className="text-[11px] text-green-800 bg-green-50/80 p-2 rounded-xl border border-green-100 cursor-pointer hover:bg-green-100 transition-colors line-clamp-2"
              >
                "Heavy rain is expected tomorrow. Avoid irrigation today and inspect paddy drainage..."
              </p>
            </div>
          )}

          {/* Floating Action Button */}
          <button
            id="open-ai-chatbot-fab"
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:scale-105 transition-all group cursor-pointer ring-4 ring-emerald-400/20 active:scale-95"
            aria-label="Open AI Farmer Assistant"
            title="Chat with AI Krishi Advisor (Gemini 2.5 Flash)"
          >
            <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform group-hover:rotate-6" />
          </button>
        </div>
      )}

      {/* Chat Window Drawer / Modal */}
      {isChatOpen && (
        <div
          id="ai-chatbot-window"
          className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 z-50 w-full sm:w-[420px] max-w-full bg-white rounded-t-3xl sm:rounded-3xl border border-green-100 shadow-2xl flex flex-col h-[560px] max-h-[92vh] overflow-hidden"
        >
          {/* Top Bar Header */}
          <div className="bg-green-700 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm leading-tight">
                    {t?.chatAssistantTitle || 'AI Krishi Advisor'}
                  </h3>
                  <span className="text-[10px] font-extrabold bg-emerald-800 text-emerald-200 border border-emerald-500/50 px-1.5 py-0.2 rounded-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-300" /> Gemini 2.5 Flash
                  </span>
                </div>
                <p className="text-[11px] text-green-100/90 font-medium">
                  {user?.mainCrop || 'Paddy'} Advisory • Odisha Region
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => clearChat?.()}
                title="Clear conversation"
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 text-xs flex items-center gap-1"
              >
                Clear
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Questions Horizontal Carousel */}
          <div className="p-2.5 bg-green-50/60 border-b border-green-100 overflow-x-auto whitespace-nowrap space-x-1.5 flex items-center">
            <span className="text-[10px] uppercase font-bold text-green-600 pl-1 shrink-0">
              Quick:
            </span>
            {(quickQuestions || []).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] font-semibold bg-white hover:bg-green-100 text-green-800 border border-green-200/80 px-3 py-1 rounded-full shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50">
            {(chatMessages || []).map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-end ${
                    isBot ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isBot
                        ? 'bg-white text-green-950 border border-green-100 shadow-2xs rounded-bl-xs'
                        : 'bg-green-600 text-white shadow-xs rounded-br-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Bot suggested action buttons if any */}
                    {isBot && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-green-50 flex flex-wrap gap-1.5">
                        {msg.suggestedPrompts.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(act)}
                            className="text-[10px] bg-green-50 hover:bg-green-100 text-green-800 px-2 py-1 rounded-lg border border-green-200 font-medium transition-colors text-left"
                          >
                            👉 {act}
                          </button>
                        ))}
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-between text-[10px] mt-1.5 ${
                        isBot ? 'text-stone-400' : 'text-green-100'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {/* Text to Speech trigger for bot messages */}
                      {isBot && (
                        <button
                          onClick={() => handleSpeakText(msg.text)}
                          className="hover:text-green-700 p-0.5 rounded"
                          title="Read out loud in local language"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-xl bg-green-200 text-green-800 flex items-center justify-center shrink-0 text-xs font-bold">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-green-800 bg-white p-3 rounded-2xl border border-green-100 w-fit">
                <Bot className="w-4 h-4 text-green-600 animate-spin" />
                <span>Smart Krishi Assistant is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-green-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice input button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-green-50 hover:bg-green-100 text-green-700'
                }`}
                title="Speak question using microphone"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-green-600" />}
              </button>

              <input
                ref={inputFieldRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t?.chatPlaceholder || 'Ask anything about crops, pests, fertilizer dosage...'}
                className="flex-1 px-3.5 py-2.5 bg-green-50/40 border border-green-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
