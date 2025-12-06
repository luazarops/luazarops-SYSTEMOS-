import React, { createContext, useState, useContext } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  'en': {
    // Menu
    'menu.title': 'Secure Local Environment',
    'menu.shutdown': 'Shut Down',
    'menu.shutdown.alert': 'To close, please close the browser tab.',
    'menu.clock': 'Live Clock',
    'menu.clock.desc': 'Time & Date',
    'menu.tictactoe': 'Tic Tac Toe',
    'menu.tictactoe.desc': 'Play Game',
    'menu.notes': 'Notes DB',
    'menu.notes.desc': 'Manage Data',
    'menu.calc': 'Calculator',
    'menu.calc.desc': 'Math Tools',
    'menu.ai': 'AI Assistant',
    'menu.ai.desc': 'Local Chat',
    'menu.help': 'Help',
    'menu.help.desc': 'Docs',
    
    // Shared
    'common.back': 'BACK',
    
    // Clock
    'clock.title': 'Live Clock',
    'clock.current': 'Current Time',
    'clock.date': 'Date',
    'clock.year': 'Year',

    // TicTacToe
    'ttt.title': 'Tic Tac Toe',
    'ttt.select': 'Select Game Mode',
    'ttt.hvh': 'Human vs Human',
    'ttt.hvai': 'Human vs AI',
    'ttt.p1': 'Player 1',
    'ttt.p2': 'Player 2',
    'ttt.you': 'You',
    'ttt.ai': 'AI',
    'ttt.draw': 'It\'s a Draw!',
    'ttt.wins': 'Wins!',
    'ttt.playagain': 'Play Again',

    // Notes
    'notes.title': 'Notes Database',
    'notes.filter': 'Filter',
    'notes.delete_all': 'Delete All',
    'notes.save': 'Save',
    'notes.from': 'From',
    'notes.to': 'To',
    'notes.clear': 'Clear',
    'notes.placeholder': 'Type your note here...',
    'notes.add': 'Add Note',
    'notes.created': 'CREATED',
    'notes.scheduled': 'SCHEDULED',
    'notes.empty': 'No notes found.',
    'notes.confirm_delete_all': 'WARNING: This will delete ALL notes permanently.\n\nAre you sure you want to clear the database?',
    
    // Calculator
    'calc.title': 'Safe Calc',
    'calc.supports': 'Supports: +, -, *, /, (), Math.sin(), Math.sqrt()',

    // Assistant
    'ai.title': 'AI Core',
    'ai.connected': 'Gemini Connected',
    'ai.local': 'Local Mode',
    'ai.game_active': 'Game Active',
    'ai.welcome': 'SYSTEM ONLINE. I am your enhanced AI Assistant.\nI can control the system, take notes, or play games with you.\n\nHow can I help?',
    'ai.game_start': "🎮 GUESS THE NUMBER started! I'm thinking of a number between 1 and 100. Try to guess it!",
    'ai.game_won': '🎉 CORRECT! The number was {target}. You got it in {attempts} attempts!',
    'ai.game_low': 'Too low! (Attempt {attempts})',
    'ai.game_high': 'Too high! (Attempt {attempts})',
    'ai.game_stop': 'Game stopped.',
    'ai.valid_num': 'Please enter a valid number.',
    'ai.opening': 'Opening {dest}...',
    'ai.local_hello': 'Greetings, user. Ready to process.',
    'ai.local_time': 'TIME: {time}',
    'ai.local_date': 'DATE: {date}',
    'ai.local_note_saved': 'Note saved to database.',
    'ai.local_fallback': "Command not recognized locally. Try 'play guess number', 'open calc', or 'note [text]'.",
    'ai.placeholder': "Ask me anything or say 'play game'...",
    'ai.placeholder_game': "Enter a number...",
    
    // Help
    'help.title': 'System Documentation',
    'help.1.title': '1. Live Clock',
    'help.1.desc': 'Displays current local date and time. Updates every second. Minimalist interface.',
    'help.2.title': '2. Tic Tac Toe',
    'help.2.desc': 'Classic game. Play against a friend locally or challenge the built-in AI. The AI attempts to block your moves and find winning strategies.',
    'help.3.title': '3. Notes Database',
    'help.3.desc': 'A persistent local storage system for your text notes. Create, Read, and Delete. Data survives page refreshes.',
    'help.4.title': '4. Safe Calculator',
    'help.4.desc': 'Evaluate math expressions safely. Supports basic arithmetic and Math functions (sin, cos, sqrt).',
    'help.5.title': '5. AI Assistant',
    'help.5.desc': 'A command-line style chatbot that can perform system actions. Try asking it to "note remember milk" or "game".',
  },
  'pt-br': {
    // Menu
    'menu.title': 'Ambiente Local Seguro',
    'menu.shutdown': 'Desligar',
    'menu.shutdown.alert': 'Para fechar, por favor feche a aba do navegador.',
    'menu.clock': 'Relógio',
    'menu.clock.desc': 'Hora e Data',
    'menu.tictactoe': 'Jogo da Velha',
    'menu.tictactoe.desc': 'Jogar Agora',
    'menu.notes': 'Anotações',
    'menu.notes.desc': 'Gerenciar Dados',
    'menu.calc': 'Calculadora',
    'menu.calc.desc': 'Matemática',
    'menu.ai': 'Assistente IA',
    'menu.ai.desc': 'Chat Local',
    'menu.help': 'Ajuda',
    'menu.help.desc': 'Documentação',

    // Shared
    'common.back': 'VOLTAR',

    // Clock
    'clock.title': 'Relógio Ao Vivo',
    'clock.current': 'Hora Atual',
    'clock.date': 'Data',
    'clock.year': 'Ano',

    // TicTacToe
    'ttt.title': 'Jogo da Velha',
    'ttt.select': 'Selecionar Modo',
    'ttt.hvh': 'Humano vs Humano',
    'ttt.hvai': 'Humano vs IA',
    'ttt.p1': 'Jogador 1',
    'ttt.p2': 'Jogador 2',
    'ttt.you': 'Você',
    'ttt.ai': 'IA',
    'ttt.draw': 'Deu Velha! 😐',
    'ttt.wins': 'Venceu!',
    'ttt.playagain': 'Jogar Novamente',

    // Notes
    'notes.title': 'Banco de Notas',
    'notes.filter': 'Filtrar',
    'notes.delete_all': 'Apagar Tudo',
    'notes.save': 'Salvar',
    'notes.from': 'De',
    'notes.to': 'Até',
    'notes.clear': 'Limpar',
    'notes.placeholder': 'Digite sua nota aqui...',
    'notes.add': 'Adicionar Nota',
    'notes.created': 'CRIADO',
    'notes.scheduled': 'AGENDADO',
    'notes.empty': 'Nenhuma nota encontrada.',
    'notes.confirm_delete_all': 'ATENÇÃO: Isso apagará TODAS as notas permanentemente.\n\nTem certeza que deseja limpar o banco de dados?',

    // Calculator
    'calc.title': 'Calculadora Segura',
    'calc.supports': 'Suporta: +, -, *, /, (), Math.sin(), Math.sqrt()',

    // Assistant
    'ai.title': 'Núcleo IA',
    'ai.connected': 'Gemini Conectado',
    'ai.local': 'Modo Local',
    'ai.game_active': 'Jogo Ativo',
    'ai.welcome': 'SISTEMA ONLINE. Sou seu Assistente IA aprimorado.\nPosso controlar o sistema, anotar coisas ou jogar com você.\n\nComo posso ajudar?',
    'ai.game_start': "🎮 ADIVINHE O NÚMERO! Estou pensando em um número entre 1 e 100. Tente adivinhar!",
    'ai.game_won': '🎉 CORRETO! O número era {target}. Você acertou em {attempts} tentativas!',
    'ai.game_low': 'Muito baixo! (Tentativa {attempts})',
    'ai.game_high': 'Muito alto! (Tentativa {attempts})',
    'ai.game_stop': 'Jogo parado.',
    'ai.valid_num': 'Por favor, insira um número válido.',
    'ai.opening': 'Abrindo {dest}...',
    'ai.local_hello': 'Saudações, usuário. Pronto para processar.',
    'ai.local_time': 'HORA: {time}',
    'ai.local_date': 'DATA: {date}',
    'ai.local_note_saved': 'Nota salva no banco de dados.',
    'ai.local_fallback': "Comando não reconhecido localmente. Tente 'jogar adivinhar', 'abrir calc', ou 'anotar [texto]'.",
    'ai.placeholder': "Pergunte algo ou diga 'jogar'...",
    'ai.placeholder_game': "Digite um número...",

    // Help
    'help.title': 'Documentação do Sistema',
    'help.1.title': '1. Relógio Ao Vivo',
    'help.1.desc': 'Exibe data e hora local. Atualiza a cada segundo. Interface minimalista.',
    'help.2.title': '2. Jogo da Velha',
    'help.2.desc': 'Jogo clássico. Jogue contra um amigo ou desafie a IA. A IA tenta bloquear seus movimentos e vencer.',
    'help.3.title': '3. Banco de Notas',
    'help.3.desc': 'Sistema de armazenamento local persistente. Criar, Ler e Deletar. Os dados sobrevivem à atualização da página.',
    'help.4.title': '4. Calculadora Segura',
    'help.4.desc': 'Avalia expressões matemáticas com segurança. Suporta aritmética básica e funções Math (sin, cos, sqrt).',
    'help.5.title': '5. Assistente IA',
    'help.5.desc': 'Chatbot estilo terminal que pode realizar ações. Tente pedir para "anotar comprar leite" ou "jogar".',
  }
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
