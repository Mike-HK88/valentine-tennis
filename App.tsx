import React, { useState, useEffect } from 'react';
import { Heart, Calendar, ClipboardList, Trophy, Settings } from 'lucide-react';
import { TRANSLATIONS, PLAYERS as DEFAULT_PLAYERS } from './constants';
import { Language, ScoreState, Player, PlayoffScores } from './types';
import InfoTab from './components/InfoTab';
import ScheduleTab from './components/ScheduleTab';
import ScoreTab from './components/ScoreTab';
import ResultsTab from './components/ResultsTab';
import SettingsTab from './components/SettingsTab';

type Tab = 'info' | 'schedule' | 'scores' | 'results' | 'settings';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [scores, setScores] = useState<ScoreState>({});
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  
  const [playoffScores, setPlayoffScores] = useState<PlayoffScores>({
    s1_t1: 0, s1_t2: 0,
    s2_t1: 0, s2_t2: 0,
    final_t1: 0, final_t2: 0,
    bronze_t1: 0, bronze_t2: 0
  });

  // Helper to load all data
  const loadData = () => {
    const savedScores = localStorage.getItem('vmd_scores');
    if (savedScores) {
        try {
            setScores(JSON.parse(savedScores));
        } catch (e) { console.error(e); }
    }
    const savedPlayers = localStorage.getItem('vmd_players');
    if (savedPlayers) {
      try {
        setPlayers(JSON.parse(savedPlayers));
      } catch (e) { console.error(e); }
    }
    const savedPlayoff = localStorage.getItem('vmd_playoff');
    if (savedPlayoff) {
      try {
        setPlayoffScores(JSON.parse(savedPlayoff));
      } catch (e) { console.error(e); }
    }
  };

  // Load state from local storage on mount
  useEffect(() => {
    loadData();

    // Listener for syncing across tabs
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'vmd_scores' || e.key === 'vmd_players' || e.key === 'vmd_playoff') {
            loadData();
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save state when changes occur
  useEffect(() => {
      localStorage.setItem('vmd_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('vmd_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('vmd_playoff', JSON.stringify(playoffScores));
  }, [playoffScores]);

  const handleUpdateScore = (matchId: string, team: 'team1' | 'team2', value: string) => {
      const numVal = parseInt(value);
      if (!isNaN(numVal) || value === '') {
        setScores(prev => ({
            ...prev,
            [matchId]: {
                ...prev[matchId],
                [team === 'team1' ? 'team1Games' : 'team2Games']: value === '' ? undefined : numVal
            }
        }));
      }
  };

  const handleUpdatePlayer = (id: string, field: 'name' | 'nameCn' | 'avatar', value: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleUpdatePlayoffScore = (key: keyof PlayoffScores, value: string) => {
     setPlayoffScores(prev => ({ ...prev, [key]: Number(value) }));
  };

  const t = TRANSLATIONS[lang];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoTab lang={lang} players={players} />;
      case 'schedule':
        return <ScheduleTab lang={lang} players={players} />;
      case 'scores':
        return (
            <ScoreTab 
                lang={lang} 
                scores={scores} 
                players={players} 
                playoffScores={playoffScores}
                onUpdateScore={handleUpdateScore} 
                onUpdatePlayoffScore={handleUpdatePlayoffScore}
            />
        );
      case 'results':
        return (
            <ResultsTab 
                lang={lang} 
                scores={scores} 
                players={players} 
                playoffScores={playoffScores}
            />
        );
      case 'settings':
        return <SettingsTab lang={lang} players={players} onUpdatePlayer={handleUpdatePlayer} />;
      default:
        return <InfoTab lang={lang} players={players} />;
    }
  };

  return (
    <div className="min-h-screen bg-valentine-50 pb-24 md:pb-10 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-valentine-500 p-1.5 rounded-full">
                    <Heart className="w-5 h-5 text-white fill-current" />
                </div>
                <h1 className="font-bold text-valentine-900 truncate max-w-[200px] sm:max-w-none">
                    {t.title}
                </h1>
            </div>
            
            <button
                onClick={() => setLang(l => l === 'en' ? 'cn' : 'en')}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-sm border border-slate-200 active:scale-95 transition-transform"
            >
                {lang === 'en' ? '中文' : 'EN'}
            </button>
        </div>
        
        {/* Mobile Tab Nav (Top sticky style) */}
        <div className="max-w-md mx-auto px-2 pb-2">
            <div className="flex bg-slate-100/50 p-1 rounded-xl overflow-x-auto no-scrollbar">
                {(['info', 'schedule', 'scores', 'results', 'settings'] as Tab[]).map((tab) => {
                     const isActive = activeTab === tab;
                     let Icon = Heart;
                     if (tab === 'schedule') Icon = Calendar;
                     if (tab === 'scores') Icon = ClipboardList;
                     if (tab === 'results') Icon = Trophy;
                     if (tab === 'settings') Icon = Settings;

                     return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 min-w-[60px] flex flex-col items-center justify-center py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                                isActive 
                                ? 'bg-white text-valentine-600 shadow-sm' 
                                : 'text-slate-500 hover:bg-white/50'
                            }`}
                        >
                            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-2' : 'stroke-1.5'}`}/>
                            {t.tabs[tab]}
                        </button>
                     );
                })}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 flex-grow w-full">
        {renderTabContent()}

        {/* Footer at the bottom of content */}
        <div className="mt-4 text-center text-slate-400 text-xs py-4 border-t border-valentine-100">
           {t.footer}
        </div>
      </main>

    </div>
  );
};

export default App;