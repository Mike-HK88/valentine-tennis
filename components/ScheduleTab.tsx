import React from 'react';
import { Clock } from 'lucide-react';
import { TRANSLATIONS, SCHEDULE } from '../constants';
import { Language, Round, Player } from '../types';
import PlayerAvatar from './PlayerAvatar';

interface ScheduleTabProps {
  lang: Language;
  players: Player[];
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ lang, players }) => {
  const t = TRANSLATIONS[lang].schedule;

  const getPlayer = (id: string) => {
     return players.find((p) => p.id === id);
  };

  const getPlayerName = (p?: Player) => {
    if (!p) return '';
    return lang === 'cn' && p.nameCn ? p.nameCn : p.name;
  };

  const sortPlayersByGender = (p1?: Player, p2?: Player) => {
    // Return [Lady, Gentleman]
    if (!p1 || !p2) return [p1, p2];
    return p1.gender === 'F' ? [p1, p2] : [p2, p1];
  };

  const renderRound = (round: Round) => (
    <div key={round.id} className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-valentine-100">
      <div className="bg-valentine-50 px-4 py-2 flex justify-between items-center border-b border-valentine-200">
        <span className="font-bold text-valentine-800">
            {lang === 'en' ? round.nameEn : round.nameCn}
        </span>
        <div className="flex items-center text-sm text-valentine-600 font-medium">
          <Clock className="w-4 h-4 mr-1" />
          {round.time}
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {round.matches.map((match) => {
          const t1p1 = getPlayer(match.team1.player1);
          const t1p2 = getPlayer(match.team1.player2);
          const [t1Lady, t1Man] = sortPlayersByGender(t1p1, t1p2);

          const t2p1 = getPlayer(match.team2.player1);
          const t2p2 = getPlayer(match.team2.player2);
          const [t2Lady, t2Man] = sortPlayersByGender(t2p1, t2p2);

          return (
            <div key={match.id} className="p-3 flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">
                {t.court} {match.court}
              </div>
              <div className="flex items-center justify-between text-sm">
                
                {/* Team 1 (Left Side) - Right Aligned Text */}
                <div className="flex flex-col gap-1 w-[42%] items-end">
                    {/* Lady First */}
                   <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800 text-xs sm:text-sm text-right leading-tight">{getPlayerName(t1Lady)}</span>
                        <PlayerAvatar size="xs" url={t1Lady?.avatar} name={getPlayerName(t1Lady)} />
                   </div>
                   {/* Man Second */}
                   <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800 text-xs sm:text-sm text-right leading-tight">{getPlayerName(t1Man)}</span>
                        <PlayerAvatar size="xs" url={t1Man?.avatar} name={getPlayerName(t1Man)} />
                   </div>
                </div>

                <div className="text-valentine-400 font-bold px-1 text-xs">VS</div>

                {/* Team 2 (Right Side) - Left Aligned Text */}
                <div className="flex flex-col gap-1 w-[42%] items-start">
                   {/* Lady First */}
                   <div className="flex items-center gap-2">
                       <PlayerAvatar size="xs" url={t2Lady?.avatar} name={getPlayerName(t2Lady)} />
                       <span className="font-medium text-slate-800 text-xs sm:text-sm text-left leading-tight">{getPlayerName(t2Lady)}</span>
                   </div>
                   {/* Man Second */}
                   <div className="flex items-center gap-2">
                       <PlayerAvatar size="xs" url={t2Man?.avatar} name={getPlayerName(t2Man)} />
                       <span className="font-medium text-slate-800 text-xs sm:text-sm text-left leading-tight">{getPlayerName(t2Man)}</span>
                   </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-2 animate-fadeIn">
        {SCHEDULE.map(renderRound)}
        
        {/* Timeline Extras */}
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-valentine-600 flex justify-between items-center">
             <span className="font-bold text-slate-700">4:10 PM</span>
             <span className="font-bold text-valentine-700">{t.semis}</span>
        </div>
        <div className="bg-gradient-to-r from-valentine-500 to-valentine-600 rounded-xl shadow-md p-4 flex justify-between items-center text-white">
             <span className="font-bold">4:40 PM</span>
             <span className="font-bold flex items-center">{t.final} 🏆</span>
        </div>
    </div>
  );
};

export default ScheduleTab;