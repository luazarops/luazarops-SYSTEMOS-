import React, { useState, useEffect, useCallback } from 'react';
import { Gamepad2, RefreshCw, User, Cpu } from 'lucide-react';
import { Header, Button, Card } from './Shared';
import { TicTacToeMode, TicTacToePlayer } from '../types';
import { useLanguage } from './LanguageContext';

interface TicTacToeProps {
  onBack: () => void;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const TicTacToe: React.FC<TicTacToeProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [board, setBoard] = useState<(TicTacToePlayer | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<TicTacToePlayer | 'Draw' | null>(null);
  const [mode, setMode] = useState<TicTacToeMode | null>(null);

  const checkWinner = useCallback((squares: (TicTacToePlayer | null)[]) => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(square => square !== null) ? 'Draw' : null;
  }, []);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const handleSquareClick = (index: number) => {
    if (board[index] || winner || (mode === 'HvAI' && !isXNext)) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsXNext(!isXNext);
    }
  };

  // AI Logic
  useEffect(() => {
    if (mode === 'HvAI' && !isXNext && !winner) {
      const timer = setTimeout(() => {
        const makeAIMove = () => {
          // 1. Check if AI can win
          for (let i = 0; i < 9; i++) {
            if (!board[i]) {
              const testBoard = [...board];
              testBoard[i] = 'O';
              if (checkWinner(testBoard) === 'O') return i;
            }
          }
          // 2. Block Human
          for (let i = 0; i < 9; i++) {
            if (!board[i]) {
              const testBoard = [...board];
              testBoard[i] = 'X';
              if (checkWinner(testBoard) === 'X') return i;
            }
          }
          // 3. Center
          if (!board[4]) return 4;
          // 4. Random Corner/Side
          const available = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
          return available[Math.floor(Math.random() * available.length)];
        };

        const aiMove = makeAIMove();
        if (aiMove !== undefined) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          const gameWinner = checkWinner(newBoard);
          if (gameWinner) setWinner(gameWinner);
          else setIsXNext(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, mode, winner, checkWinner]);

  if (!mode) {
    return (
      <div className="max-w-md mx-auto w-full">
        <Header title={t('ttt.title')} onBack={onBack} icon={<Gamepad2 />} />
        <Card className="flex flex-col gap-4">
          <h3 className="text-center text-lg mb-2">{t('ttt.select')}</h3>
          <Button onClick={() => setMode('HvH')}>
             <div className="flex items-center justify-center gap-2"><User size={20}/> VS <User size={20}/> {t('ttt.hvh')}</div>
          </Button>
          <Button onClick={() => setMode('HvAI')}>
            <div className="flex items-center justify-center gap-2"><User size={20}/> VS <Cpu size={20}/> {t('ttt.hvai')}</div>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <Header title={t('ttt.title')} onBack={() => setMode(null)} icon={<Gamepad2 />} />
      
      <div className="mb-6 flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div className={`flex items-center gap-2 ${isXNext && !winner ? 'text-yellow-400 font-bold' : 'text-slate-500'}`}>
            <span className="text-2xl">X</span>
            <span className="text-xs uppercase">{mode === 'HvH' ? t('ttt.p1') : t('ttt.you')}</span>
        </div>
        <div className={`flex items-center gap-2 ${!isXNext && !winner ? 'text-yellow-400 font-bold' : 'text-slate-500'}`}>
            <span className="text-xs uppercase">{mode === 'HvH' ? t('ttt.p2') : t('ttt.ai')}</span>
            <span className="text-2xl">O</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-800 p-3 rounded-xl">
        {board.map((square, i) => (
          <button
            key={i}
            className={`
              h-24 rounded-lg text-5xl font-black flex items-center justify-center transition-all duration-200
              ${square === 'X' ? 'text-cyan-400 bg-slate-900' : square === 'O' ? 'text-purple-400 bg-slate-900' : 'bg-slate-700 hover:bg-slate-600'}
              ${!square && !winner && ((mode === 'HvAI' && isXNext) || mode === 'HvH') ? 'cursor-pointer' : 'cursor-default'}
            `}
            onClick={() => handleSquareClick(i)}
            disabled={!!square || !!winner || (mode === 'HvAI' && !isXNext)}
          >
            {square}
          </button>
        ))}
      </div>

      {winner && (
        <Card className="text-center animate-in fade-in zoom-in duration-300 border-green-500/50">
          <h3 className="text-2xl font-bold text-white mb-2">
            {winner === 'Draw' ? t('ttt.draw') : `🏆 ${winner} ${t('ttt.wins')}`}
          </h3>
          <Button onClick={resetGame} variant="primary" className="mt-4 flex items-center gap-2 mx-auto">
            <RefreshCw size={18} /> {t('ttt.playagain')}
          </Button>
        </Card>
      )}
    </div>
  );
};