import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Terminal, Sparkles, Gamepad2 } from 'lucide-react';
import { Button } from './Shared';
import { View, Note } from '../types';
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { useLanguage } from './LanguageContext';

interface AssistantProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GameState {
  active: boolean;
  target: number;
  attempts: number;
}

export const Assistant: React.FC<AssistantProps> = ({ onBack, onNavigate }) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('ai.welcome') }
  ]);
  
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
        setMessages([{ role: 'assistant', content: t('ai.welcome') }]);
    }
  }, [language, t]); // eslint-disable-line react-hooks/exhaustive-deps

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [gameState, setGameState] = useState<GameState>({ active: false, target: 0, attempts: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Robust API Key Access
  const apiKey = (() => {
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        // @ts-ignore
        return process.env.API_KEY;
      }
    } catch (e) {
      return undefined;
    }
    return undefined;
  })();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // --- LOCAL GAME LOGIC ---
  const startGuessGame = () => {
    const target = Math.floor(Math.random() * 100) + 1;
    setGameState({ active: true, target, attempts: 0 });
    return t('ai.game_start');
  };

  const processGuessGame = (guessStr: string): string => {
    const guess = parseInt(guessStr);
    if (isNaN(guess)) return t('ai.valid_num');

    const newAttempts = gameState.attempts + 1;
    setGameState(prev => ({ ...prev, attempts: newAttempts }));

    if (guess === gameState.target) {
      setGameState({ active: false, target: 0, attempts: 0 });
      return t('ai.game_won').replace('{target}', gameState.target.toString()).replace('{attempts}', newAttempts.toString());
    } else if (guess < gameState.target) {
      return t('ai.game_low').replace('{attempts}', newAttempts.toString());
    } else {
      return t('ai.game_high').replace('{attempts}', newAttempts.toString());
    }
  };

  // --- GEMINI API LOGIC ---
  const callGemini = async (userPrompt: string) => {
    if (!apiKey) return null;

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const navTool: FunctionDeclaration = {
        name: 'navigate',
        description: 'Navigate to a specific application view',
        parameters: {
          type: Type.OBJECT,
          properties: {
            destination: {
              type: Type.STRING,
              description: 'The view to navigate to: CLOCK, TICTACTOE, NOTES, CALCULATOR, HELP, MENU',
            },
          },
          required: ['destination'],
        },
      };

      const sysInstruction = language === 'pt-br' 
        ? "Você é o SystemOS AI, um assistente de terminal legal. Responda em Português do Brasil. Mantenha as respostas curtas."
        : "You are SystemOS AI, a cool terminal assistant. Keep answers concise.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: sysInstruction,
          tools: [{ functionDeclarations: [navTool] }]
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'navigate') {
            const dest = (call.args as any).destination;
            const viewMap: Record<string, View> = {
                'CLOCK': View.CLOCK,
                'TICTACTOE': View.TICTACTOE,
                'NOTES': View.NOTES,
                'CALCULATOR': View.CALCULATOR,
                'HELP': View.HELP,
                'MENU': View.MENU
            };
            if (viewMap[dest]) {
                onNavigate(viewMap[dest]);
                return t('ai.opening').replace('{dest}', dest);
            }
        }
      }
      return response.text;
    } catch (error) {
      // Silently fail to local mode if API error occurs
      return null;
    }
  };

  // --- MAIN COMMAND PROCESSOR ---
  const processCommand = async (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();

    // 1. Check active local game
    if (gameState.active) {
      if (lowerCmd === 'quit' || lowerCmd === 'exit' || lowerCmd === 'sair') {
        setGameState({ active: false, target: 0, attempts: 0 });
        setMessages(prev => [...prev, { role: 'assistant', content: t('ai.game_stop') }]);
      } else {
        const gameResponse = processGuessGame(cmd);
        setMessages(prev => [...prev, { role: 'assistant', content: gameResponse }]);
      }
      setIsTyping(false);
      return;
    }

    // 2. Try Gemini API first if available
    if (apiKey) {
       const aiResponse = await callGemini(cmd);
       if (aiResponse) {
         setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
         setIsTyping(false);
         return;
       }
    }

    // 3. Local Fallback
    let response = "";

    if (lowerCmd.includes('hello') || lowerCmd.includes('hi') || lowerCmd.includes('olá')) {
        response = t('ai.local_hello');
    } else if (lowerCmd.includes('play') || lowerCmd.includes('game') || lowerCmd.includes('jogo') || lowerCmd.includes('jogar')) {
        if (lowerCmd.includes('guess') || lowerCmd.includes('number') || lowerCmd.includes('adivinhar')) {
            response = startGuessGame();
        } else if (lowerCmd.includes('tic') || lowerCmd.includes('velha')) {
            onNavigate(View.TICTACTOE);
            setIsTyping(false);
            return;
        } else {
            response = language === 'pt-br' 
                ? "Posso jogar 'Adivinhe o Número' aqui ou abrir 'Jogo da Velha'."
                : "I can play 'Guess the Number' right here, or open 'Tic Tac Toe'.";
        }
    } else if (lowerCmd.includes('time') || lowerCmd.includes('hora')) {
        response = t('ai.local_time').replace('{time}', new Date().toLocaleTimeString());
    } else if (lowerCmd.includes('date') || lowerCmd.includes('data')) {
        response = t('ai.local_date').replace('{date}', new Date().toLocaleDateString());
    } else if (lowerCmd.startsWith('note ') || lowerCmd.startsWith('anotar ') || lowerCmd.startsWith('nota ')) {
        const text = lowerCmd.replace(/^(note|anotar|nota)\s+/, '').trim();
        const currentNotes: Note[] = JSON.parse(localStorage.getItem('app_notes') || '[]');
        const newNote = { id: Date.now(), text, createdAt: new Date().toLocaleString() };
        localStorage.setItem('app_notes', JSON.stringify([newNote, ...currentNotes]));
        response = t('ai.local_note_saved');
    } else if (lowerCmd.includes('calc') || lowerCmd.includes('calculadora')) {
        onNavigate(View.CALCULATOR);
        return;
    } else {
        response = t('ai.local_fallback');
    }

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const cmd = input;
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
        processCommand(cmd);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto w-full h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-yellow-500/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Bot size={32} className="rgb-effect" />
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 tracking-wider uppercase">
              {t('ai.title')}
            </h1>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                {apiKey ? <span className="text-green-500">{t('ai.connected')}</span> : <span className="text-yellow-500">{t('ai.local')}</span>}
                {gameState.active && <span className="text-purple-400">• {t('ai.game_active')}</span>}
            </div>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-bold text-slate-900 bg-yellow-500 hover:bg-yellow-400 rounded transition-colors"
        >
          {t('common.back')}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg p-4 overflow-y-auto mb-4 custom-scrollbar space-y-4 shadow-inner">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] rounded-lg p-3 shadow-lg ${
              msg.role === 'user' 
                ? 'bg-yellow-500/10 text-yellow-100 border border-yellow-500/30' 
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 text-xs font-bold mb-2 pb-2 border-b border-white/10">
                    <Terminal size={12} className="text-slate-400"/> 
                    <span className="rgb-effect">SYSTEM AI</span>
                  </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
            <div className="flex justify-start animate-pulse">
                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {!gameState.active && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 custom-scrollbar">
            <button onClick={() => setInput(language === 'pt-br' ? 'Jogar Adivinhar Número' : 'Play Guess the Number')} className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 flex items-center gap-1">
                <Gamepad2 size={12}/> {language === 'pt-br' ? 'Jogar' : 'Play Game'}
            </button>
            <button onClick={() => setInput(language === 'pt-br' ? 'Abrir Jogo da Velha' : 'Open Tic Tac Toe')} className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 flex items-center gap-1">
                <Gamepad2 size={12}/> {t('menu.tictactoe')}
            </button>
            <button onClick={() => setInput(language === 'pt-br' ? 'Abrir Calculadora' : 'Open Calculator')} className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300">
                {t('menu.calc')}
            </button>
            <button onClick={() => setInput(language === 'pt-br' ? 'Me conte uma piada' : 'Tell me a joke')} className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 flex items-center gap-1">
                <Sparkles size={12}/> {language === 'pt-br' ? 'Piada' : 'Joke'}
            </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={gameState.active ? t('ai.placeholder_game') : t('ai.placeholder')}
          className={`flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all ${gameState.active ? 'border-purple-500/50' : ''}`}
        />
        <Button type="submit" variant={gameState.active ? 'primary' : 'secondary'}>
            <Send size={20} />
        </Button>
      </form>
    </div>
  );
};