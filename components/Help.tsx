import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Header, Card } from './Shared';
import { useLanguage } from './LanguageContext';

export const Help: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto w-full">
      <Header title={t('help.title')} onBack={onBack} icon={<HelpCircle />} />
      <div className="grid gap-4">
        <Card>
          <h3 className="text-yellow-400 font-bold mb-2 text-lg">{t('help.1.title')}</h3>
          <p className="text-slate-300">{t('help.1.desc')}</p>
        </Card>
        <Card>
          <h3 className="text-yellow-400 font-bold mb-2 text-lg">{t('help.2.title')}</h3>
          <p className="text-slate-300">{t('help.2.desc')}</p>
        </Card>
        <Card>
          <h3 className="text-yellow-400 font-bold mb-2 text-lg">{t('help.3.title')}</h3>
          <p className="text-slate-300">{t('help.3.desc')}</p>
        </Card>
        <Card>
          <h3 className="text-yellow-400 font-bold mb-2 text-lg">{t('help.4.title')}</h3>
          <p className="text-slate-300">{t('help.4.desc')}</p>
        </Card>
        <Card>
          <h3 className="text-yellow-400 font-bold mb-2 text-lg">{t('help.5.title')}</h3>
          <p className="text-slate-300">{t('help.5.desc')}</p>
        </Card>
      </div>
    </div>
  );
};