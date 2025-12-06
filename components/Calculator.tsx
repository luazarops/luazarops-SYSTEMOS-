import React, { useState } from 'react';
import { Calculator as CalcIcon, Delete, Eraser, Equal } from 'lucide-react';
import { Header, Button, Card } from './Shared';
import { useLanguage } from './LanguageContext';

interface CalculatorProps {
  onBack: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handlePress = (val: string) => {
    if (result !== null) {
      setDisplay(val);
      setResult(null);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  const clear = () => {
    setDisplay('');
    setResult(null);
  };

  const backspace = () => {
    if (result !== null) {
        clear();
    } else {
        setDisplay(prev => prev.slice(0, -1));
    }
  };

  const calculate = () => {
    try {
      // Security: Only allow math characters
      if (/[^0-9+\-*/().\s]|(Math\.[a-z]+)/.test(display.replace(/Math\.(sin|cos|sqrt|tan|abs|pow|PI)/g, ''))) {
         throw new Error("Invalid characters");
      }
      
      // Basic evaluation
      // eslint-disable-next-line no-new-func
      const calcFunc = new Function(`return ${display}`);
      const res = calcFunc();
      
      if (!isFinite(res) || isNaN(res)) throw new Error("Error");
      
      setResult(String(res));
    } catch (e) {
      setResult("Error");
    }
  };

  const buttons = [
    { label: 'C', onClick: clear, variant: 'danger' as const },
    { label: '(', onClick: () => handlePress('('), variant: 'secondary' as const },
    { label: ')', onClick: () => handlePress(')'), variant: 'secondary' as const },
    { label: '÷', onClick: () => handlePress('/'), variant: 'secondary' as const },
    { label: '7', onClick: () => handlePress('7'), variant: 'secondary' as const },
    { label: '8', onClick: () => handlePress('8'), variant: 'secondary' as const },
    { label: '9', onClick: () => handlePress('9'), variant: 'secondary' as const },
    { label: '×', onClick: () => handlePress('*'), variant: 'secondary' as const },
    { label: '4', onClick: () => handlePress('4'), variant: 'secondary' as const },
    { label: '5', onClick: () => handlePress('5'), variant: 'secondary' as const },
    { label: '6', onClick: () => handlePress('6'), variant: 'secondary' as const },
    { label: '-', onClick: () => handlePress('-'), variant: 'secondary' as const },
    { label: '1', onClick: () => handlePress('1'), variant: 'secondary' as const },
    { label: '2', onClick: () => handlePress('2'), variant: 'secondary' as const },
    { label: '3', onClick: () => handlePress('3'), variant: 'secondary' as const },
    { label: '+', onClick: () => handlePress('+'), variant: 'secondary' as const },
    { label: '0', onClick: () => handlePress('0'), variant: 'secondary' as const },
    { label: '.', onClick: () => handlePress('.'), variant: 'secondary' as const },
    { label: '⌫', onClick: backspace, variant: 'danger' as const },
    { label: '=', onClick: calculate, variant: 'primary' as const },
  ];

  return (
    <div className="max-w-sm mx-auto w-full">
      <Header title={t('calc.title')} onBack={onBack} icon={<CalcIcon />} />
      
      <Card className="mb-6 p-4 bg-slate-800 border-yellow-500/20">
        <div className="text-right h-8 text-slate-400 text-sm font-mono overflow-hidden">
          {display || '0'}
        </div>
        <div className="text-right h-12 text-3xl font-bold text-white overflow-hidden text-ellipsis">
          {result !== null ? result : ''}
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn, idx) => (
          <Button
            key={idx}
            onClick={btn.onClick}
            variant={btn.variant}
            className={`flex items-center justify-center text-lg h-14 ${btn.label === '0' ? 'col-span-1' : ''}`}
          >
            {btn.label}
          </Button>
        ))}
      </div>
      
      <div className="mt-6 text-center text-xs text-slate-500">
        {t('calc.supports')}
      </div>
    </div>
  );
};