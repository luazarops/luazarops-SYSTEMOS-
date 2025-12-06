import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';
import { Header, Card } from './Shared';
import { useLanguage } from './LanguageContext';

interface ClockProps {
  onBack: () => void;
}

export const Clock: React.FC<ClockProps> = ({ onBack }) => {
  const [time, setTime] = useState(new Date());
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour12: false });
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Header title={t('clock.title')} onBack={onBack} icon={<ClockIcon />} />
      
      <div className="grid gap-6">
        <Card className="text-center py-12 border-yellow-500/50">
            <h2 className="text-slate-400 text-sm uppercase tracking-[0.2em] mb-4">{t('clock.current')}</h2>
            <div className="text-6xl md:text-8xl font-black text-white tracking-widest tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {formatTime(time)}
            </div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
            <Card className="text-center py-8">
                <h3 className="text-yellow-500 text-xs uppercase tracking-widest mb-2">{t('clock.date')}</h3>
                <div className="text-3xl font-bold">{formatDate(time)}</div>
            </Card>
            <Card className="text-center py-8">
                <h3 className="text-yellow-500 text-xs uppercase tracking-widest mb-2">{t('clock.year')}</h3>
                <div className="text-3xl font-bold">{time.getFullYear()}</div>
            </Card>
        </div>
      </div>
    </div>
  );
};