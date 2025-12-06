import React from 'react';
import { Clock, Gamepad2, Notebook, Calculator as CalcIcon, Bot, HelpCircle, Power, Globe, Terminal } from 'lucide-react';
import { View } from '../types';
import { useLanguage } from './LanguageContext';

interface MenuProps {
  onNavigate: (view: View) => void;
}

export const Menu: React.FC<MenuProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();

  const menuItems = [
    { view: View.CLOCK, label: t('menu.clock'), icon: <Clock size={32} />, desc: t('menu.clock.desc') },
    { view: View.TICTACTOE, label: t('menu.tictactoe'), icon: <Gamepad2 size={32} />, desc: t('menu.tictactoe.desc') },
    { view: View.NOTES, label: t('menu.notes'), icon: <Notebook size={32} />, desc: t('menu.notes.desc') },
    { view: View.CALCULATOR, label: t('menu.calc'), icon: <CalcIcon size={32} />, desc: t('menu.calc.desc') },
    { view: View.ASSISTANT, label: t('menu.ai'), icon: <Bot size={32} />, desc: t('menu.ai.desc') },
    { view: View.HELP, label: t('menu.help'), icon: <HelpCircle size={32} />, desc: t('menu.help.desc') },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter flex flex-col md:block items-center justify-center gap-x-4">
          <div className="flex items-center justify-center gap-3">
            <span className="luazarops-effect block md:inline">luazarops</span>
          </div>
          
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mt-2 md:mt-0">
            SYSTEM<span className="text-white">OS</span>
          </span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-500 tracking-[0.3em] text-sm uppercase mt-2">
            <Terminal size={12} />
            <span>{t('menu.title')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full px-4 mb-8">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.view)}
            className="group flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all duration-300"
          >
            <div className="mb-4 text-slate-400 group-hover:text-yellow-400 transition-colors transform group-hover:scale-110 duration-300">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-1">{item.label}</h3>
            <p className="text-xs text-slate-500 group-hover:text-slate-400">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Language Selection Tool */}
      <div className="w-full px-4 mb-8">
        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-slate-400">
                <Globe size={18} />
                <span className="text-xs uppercase font-bold tracking-wider">Language / Idioma</span>
             </div>
             <div className="flex gap-2">
                <button 
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 ${language === 'en' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-600'}`}
                >
                    🇺🇸 English
                </button>
                <button 
                    onClick={() => setLanguage('pt-br')}
                    className={`px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 ${language === 'pt-br' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-600'}`}
                >
                    🇧🇷 Português
                </button>
             </div>
        </div>
      </div>

      <div className="">
        <button 
            className="flex items-center gap-2 px-6 py-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all text-sm font-bold uppercase tracking-widest"
            onClick={() => alert(t('menu.shutdown.alert'))}
        >
            <Power size={16} /> {t('menu.shutdown')}
        </button>
      </div>
    </div>
  );
};