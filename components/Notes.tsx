import React, { useState, useEffect } from 'react';
import { Notebook, Trash2, Plus, Calendar, Download, FileText, Printer, Filter, X, AlertTriangle, Eraser } from 'lucide-react';
import { Header, Button, Card } from './Shared';
import { Note } from '../types';
import { useLanguage } from './LanguageContext';

interface NotesProps {
  onBack: () => void;
}

export const Notes: React.FC<NotesProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputText, setInputText] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('app_notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse notes");
      }
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('app_notes', JSON.stringify(newNotes));
  };

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newNote: Note = {
      // Ensure ID is unique even if clicked rapidly by adding random suffix
      id: Date.now() + Math.random(),
      text: inputText.trim(),
      createdAt: new Date().toLocaleString(),
      scheduledAt: scheduledDate ? new Date(scheduledDate).toISOString() : undefined
    };

    saveNotes([newNote, ...notes]);
    setInputText('');
    setScheduledDate('');
  };

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    saveNotes(updatedNotes);
  };

  const clearAllNotes = () => {
    if (notes.length === 0) return;
    if (window.confirm(t('notes.confirm_delete_all'))) {
        saveNotes([]);
    }
  };

  // Filter Logic
  const filteredNotes = notes.filter(note => {
    if (!filterStart && !filterEnd) return true;
    const noteTime = note.id; 
    const startTime = filterStart ? new Date(filterStart).getTime() : 0;
    const endTime = filterEnd ? new Date(filterEnd).getTime() + 86400000 : Infinity; 
    return noteTime >= startTime && noteTime <= endTime;
  });

  // Export Tools
  const downloadTxt = () => {
    const textContent = filteredNotes.map(n => 
      `------------------------------------------------\nDATE: ${n.createdAt}\n${n.scheduledAt ? `SCHEDULED: ${new Date(n.scheduledAt).toLocaleString()}\n` : ''}CONTENT:\n${n.text}\n`
    ).join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_export_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printNotes = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
      <Header title={t('notes.title')} onBack={onBack} icon={<Notebook />} />

      {/* Tools Section */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Button 
            variant="secondary" 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 text-xs py-2 ${showFilters ? 'border-yellow-500 text-yellow-500' : ''}`}
        >
            <Filter size={16} /> {t('notes.filter')}
        </Button>
        
        <Button 
            variant="danger" 
            onClick={clearAllNotes}
            disabled={notes.length === 0}
            className="flex items-center gap-2 text-xs py-2"
        >
            <Trash2 size={16} /> {t('notes.delete_all')}
        </Button>

        <div className="flex-1"></div>
        
        <div className="flex gap-2">
            <Button variant="secondary" onClick={downloadTxt} className="flex items-center gap-2 text-xs py-2" title="Save as File">
                <Download size={16} /> <span className="hidden sm:inline">{t('notes.save')}</span>
            </Button>
            <Button variant="secondary" onClick={printNotes} className="flex items-center gap-2 text-xs py-2" title="Print View">
                <Printer size={16} />
            </Button>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <Card className="mb-4 py-3 px-4 bg-slate-800/50 border-yellow-500/30 flex flex-wrap gap-4 items-end animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">{t('notes.from')}</label>
                <input 
                    type="date" 
                    value={filterStart}
                    onChange={(e) => setFilterStart(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm focus:border-yellow-500 outline-none"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-slate-500">{t('notes.to')}</label>
                <input 
                    type="date" 
                    value={filterEnd}
                    onChange={(e) => setFilterEnd(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm focus:border-yellow-500 outline-none"
                />
            </div>
            <Button 
                variant="ghost" 
                onClick={() => { setFilterStart(''); setFilterEnd(''); }}
                className="h-8 py-1 px-2 text-xs text-red-400"
                disabled={!filterStart && !filterEnd}
            >
                <X size={14} className="mr-1"/> {t('notes.clear')}
            </Button>
        </Card>
      )}

      {/* Create Form */}
      <Card className="mb-6 bg-slate-900/50 border-slate-700 p-4">
        <form onSubmit={addNote} className="flex flex-col gap-3">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('notes.placeholder')}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none"
            />
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 flex-1">
                    <Calendar size={16} className="text-yellow-500/70" />
                    <input 
                        type="datetime-local" 
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="bg-transparent border-none text-xs text-slate-300 focus:outline-none w-full"
                    />
                </div>
                {inputText && (
                    <button 
                        type="button" 
                        onClick={() => setInputText('')}
                        className="p-2 text-slate-500 hover:text-white"
                        title="Clear Input"
                    >
                        <Eraser size={18} />
                    </button>
                )}
                <Button type="submit" disabled={!inputText.trim()} className="py-2">
                    <div className="flex items-center gap-2"><Plus size={18}/> {t('notes.add')}</div>
                </Button>
            </div>
        </form>
      </Card>

      {/* Notes List */}
      <div id="printable-section" className="grid gap-4 overflow-y-auto pb-4 custom-scrollbar flex-1">
        {filteredNotes.length === 0 ? (
          <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-800 rounded-lg">
            <Notebook size={48} className="mx-auto mb-4 opacity-50"/>
            <p>{t('notes.empty')}</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <Card key={note.id} className="group hover:border-yellow-500/30 transition-colors note-card">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-lg text-slate-200 whitespace-pre-wrap">{note.text}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        {t('notes.created')}: {note.createdAt}
                    </p>
                    {note.scheduledAt && (
                        <p className="text-xs text-yellow-400/80 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Calendar size={12} /> {t('notes.scheduled')}: {new Date(note.scheduledAt).toLocaleString()}
                        </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="no-print-in-section p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  title="Delete This Note"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};