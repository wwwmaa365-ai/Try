import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_INDIAN_LANGUAGES, LANGUAGE_QUICK_PROMPTS } from '../data/indianLanguages';
import { IndianLanguageCode } from '../types';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Ticket,
  HelpCircle,
  FileCheck,
  PhoneCall,
  Loader2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  time: string;
}

export const AISupportChat: React.FC = () => {
  const {
    isSupportModalOpen,
    setIsSupportModalOpen,
    userProfile,
    addTicket,
    language,
    aiSupportLanguage,
    setAiSupportLanguage,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const selectedLangObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === aiSupportLanguage) || ALL_INDIAN_LANGUAGES[0];
    return [
      {
        id: 'init-1',
        role: 'model',
        content: selectedLangObj.greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'AEPS' | 'Recharge' | 'BBPS' | 'Commission' | 'Account' | 'Other'>('AEPS');
  const [ticketTxnRef, setTicketTxnRef] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentLangObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === aiSupportLanguage) || ALL_INDIAN_LANGUAGES[0];
  const activeQuickPrompts = LANGUAGE_QUICK_PROMPTS[aiSupportLanguage] || LANGUAGE_QUICK_PROMPTS['hi'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle switching language
  const handleSelectLanguage = (newLang: IndianLanguageCode) => {
    setAiSupportLanguage(newLang);
    const targetObj = ALL_INDIAN_LANGUAGES.find((l) => l.code === newLang) || ALL_INDIAN_LANGUAGES[0];
    setMessages((prev) => [
      ...prev,
      {
        id: 'lang-switch-' + Date.now(),
        role: 'model',
        content: targetObj.greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Web Speech API - Voice Input (Speech-to-Text)
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Your browser does not support Speech Recognition. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLangObj.speechCode || 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  // Text to Speech playback
  const handleSpeakText = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#`_\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLangObj.speechCode || 'hi-IN';
    utterance.rate = 1.0;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const payloadMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          selectedLanguage: aiSupportLanguage,
          userContext: {
            retailerName: userProfile.retailerName,
            shopName: userProfile.shopName,
            agentCode: userProfile.agentCode,
            language,
            preferredLanguage: aiSupportLanguage,
          },
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'मुझे क्षमा करें, तकनीकी कारणों से जवाब नहीं मिल सका। कृपया पुनः प्रयास करें।';

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          role: 'model',
          content: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'model',
          content: 'नेटवर्क समस्या या सर्वर विलंब। कृपया पुनः प्रयास करें या सीधे सपोर्ट टिकट दर्ज करें।',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;

    const newId = addTicket({
      category: ticketCategory,
      subject: ticketSubject,
      status: 'OPEN',
      priority: 'High',
      transactionRef: ticketTxnRef || undefined,
      messages: [
        {
          sender: 'user',
          text: ticketSubject,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          sender: 'system',
          text: 'Ticket created and routed to Priority Fintech Desk. Estimated resolution: 2-4 hours.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });

    setCreatedTicketId(newId);
    setShowTicketForm(false);
    setTicketSubject('');
    setTicketTxnRef('');

    setMessages((prev) => [
      ...prev,
      {
        id: 'tkt-msg-' + Date.now(),
        role: 'model',
        content: `✅ **सपोर्ट टिकट दर्ज कर लिया गया है!**\n\n📌 **टिकट संख्या:** \`${newId}\`\n📂 **श्रेणी:** ${ticketCategory}\n⏱️ **समाधान समय:** 2 से 4 घंटे\n\nहमारी तकनीकी सहायता टीम आपके रजिस्टर्ड मोबाइल पर तत्काल संपर्क करेगी।`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isSupportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg h-[88vh] max-h-[680px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header with Title and Mode */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-3.5 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md ring-2 ring-blue-400/40">
              <Bot className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">Sahayak AI (सहायक)</h3>
                <span className="text-[9px] bg-blue-500/30 text-blue-200 font-bold px-1.5 py-0.5 rounded-full border border-blue-400/30">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                24x7 All Indian Languages • सभी भारतीय भाषाएं
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTicketForm((prev) => !prev)}
              className="text-xs bg-blue-600/70 hover:bg-blue-600 text-white px-2 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              title="Raise Formal Dispute Ticket"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ticket</span>
            </button>
            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsSupportModalOpen(false);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Indian Language Switcher Bar */}
        <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-semibold pr-1">
            <Languages className="w-3.5 h-3.5 text-blue-400" />
            भाषा:
          </span>
          {ALL_INDIAN_LANGUAGES.map((langItem) => {
            const isSel = aiSupportLanguage === langItem.code;
            return (
              <button
                key={langItem.code}
                onClick={() => handleSelectLanguage(langItem.code)}
                className={`px-2.5 py-0.8 rounded-full font-bold whitespace-nowrap transition-all text-[11px] ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {langItem.nativeName}
              </button>
            );
          })}
        </div>

        {/* Optional Raise Ticket Form Panel */}
        {showTicketForm ? (
          <div className="p-3.5 bg-blue-50/80 border-b border-blue-200 overflow-y-auto max-h-[280px]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                File Formal Grievance / Dispute Ticket
              </h4>
              <button
                onClick={() => setShowTicketForm(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e: any) => setTicketCategory(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="AEPS">AEPS Withdrawal / Bank Error</option>
                    <option value="Recharge">Mobile / DTH Recharge</option>
                    <option value="BBPS">BBPS Bill Payment</option>
                    <option value="Commission">Commission Payout</option>
                    <option value="Account">Retailer Account / KYC</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">RRN / Transaction Ref (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. RRN-63162094..."
                    value={ticketTxnRef}
                    onChange={(e) => setTicketTxnRef(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Describe Issue</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. ₹2,000 debited from customer account on 11 Nov but failed on terminal..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
                >
                  Generate Ticket ID
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Chat Messages */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            const isSpeaking = speakingMessageId === m.id;
            return (
              <div
                key={m.id}
                className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {m.content}
                  </div>
                  <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100 text-[10px]">
                    {!isUser ? (
                      <button
                        onClick={() => handleSpeakText(m.content, m.id)}
                        className={`flex items-center gap-1 font-semibold transition-colors ${
                          isSpeaking ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-blue-600'
                        }`}
                        title="Read Aloud / सुनें"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-500" />
                            <span className="text-rose-500">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>सुनें / Listen</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span></span>
                    )}
                    <span className={isUser ? 'text-blue-100' : 'text-slate-400'}>{m.time}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-bounce">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white text-slate-600 border border-slate-200 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2 shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Sahayak AI सोच रहा है ({currentLangObj.nativeName})...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200/80 flex gap-1.5 overflow-x-auto scrollbar-none">
          {activeQuickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Voice Listening Bar if Active */}
        {isListening && (
          <div className="bg-rose-50 border-t border-rose-200 px-3 py-1.5 text-xs text-rose-700 flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-2 font-bold">
              <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
              Listening in {currentLangObj.nativeName}... कृपया बोलें
            </span>
            <button
              onClick={toggleSpeechRecognition}
              className="text-[11px] font-bold text-rose-800 underline"
            >
              Done / Stop
            </button>
          </div>
        )}

        {/* Input Field with Mic & Send */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl transition-colors shadow-xs ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200'
            }`}
            title={`Speak in ${currentLangObj.nativeName} (माइक से बोलें)`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              aiSupportLanguage === 'hi'
                ? 'अपनी समस्या या सवाल यहाँ लिखें...'
                : aiSupportLanguage === 'bn'
                ? 'আপনার প্রশ্ন এখানে লিখুন...'
                : aiSupportLanguage === 'te'
                ? 'మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...'
                : aiSupportLanguage === 'ta'
                ? 'உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...'
                : aiSupportLanguage === 'mr'
                ? 'तुमचा प्रश्न येथे लिहा...'
                : 'Type or speak your fintech query in any Indian language...'
            }
            className="flex-1 p-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors shadow-sm shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
