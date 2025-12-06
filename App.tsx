import React, { useState } from 'react';
import { View } from './types';
import { Menu } from './components/Menu';
import { Clock } from './components/Clock';
import { TicTacToe } from './components/TicTacToe';
import { Notes } from './components/Notes';
import { Calculator } from './components/Calculator';
import { Assistant } from './components/Assistant';
import { Help } from './components/Help';
import { LanguageProvider } from './components/LanguageContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.MENU);

  const renderView = () => {
    switch (currentView) {
      case View.MENU:
        return <Menu onNavigate={setCurrentView} />;
      case View.CLOCK:
        return <Clock onBack={() => setCurrentView(View.MENU)} />;
      case View.TICTACTOE:
        return <TicTacToe onBack={() => setCurrentView(View.MENU)} />;
      case View.NOTES:
        return <Notes onBack={() => setCurrentView(View.MENU)} />;
      case View.CALCULATOR:
        return <Calculator onBack={() => setCurrentView(View.MENU)} />;
      case View.ASSISTANT:
        return <Assistant onBack={() => setCurrentView(View.MENU)} onNavigate={setCurrentView} />;
      case View.HELP:
        return <Help onBack={() => setCurrentView(View.MENU)} />;
      default:
        return <Menu onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden selection:bg-yellow-500/30 selection:text-yellow-200">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex items-center justify-center z-10">
        {renderView()}
      </main>

      {/* Footer / Status Bar */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 p-2 px-4 flex justify-between items-center text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-bold z-20">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> SYSTEM ONLINE</span>
          <span>v1.0.0</span>
        </div>
        <div className="hidden md:block">
            MEMORY: LOCAL STORAGE
        </div>
        <div>
          {currentView === View.MENU ? 'MAIN MENU' : currentView}
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;