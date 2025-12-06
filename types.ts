export enum View {
  MENU = 'MENU',
  CLOCK = 'CLOCK',
  TICTACTOE = 'TICTACTOE',
  NOTES = 'NOTES',
  CALCULATOR = 'CALCULATOR',
  ASSISTANT = 'ASSISTANT',
  HELP = 'HELP'
}

export interface Note {
  id: number;
  text: string;
  createdAt: string;
  scheduledAt?: string;
}

export type TicTacToePlayer = 'X' | 'O';
export type TicTacToeMode = 'HvH' | 'HvAI';

export type Language = 'en' | 'pt-br';