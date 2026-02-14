import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { TRANSLATIONS, SCHEDULE } from '../constants';
import { Language, ScoreState, Player, PlayoffScores, PlayerStats } from '../types';
import PlayerAvatar from './PlayerAvatar';

const getLocalizedName = (lang: Language, p?: Player | PlayerStats) => {
  if (!p) return '';
  return lang === 'cn' && p.nameCn ? p.nameCn : p.name;
};

const sortPlayers = (p1?: Player | PlayerStats, p2?: Player | PlayerStats) => {
  // Default to passed order if undefined
  const list = [p1, p2];
  // Find lady
  const lady = list.find(p => p?.gender === 'F');
  const man = list.find(p => p?.gender === 'M');
  // If specific gender not found, fallback to original order or remaining
  const first = lady || p1;
  const second = man || (first === p1 ? p2 : p1);
  return [first, second];
};

interface MatchCardProps {
  title: React.ReactNode;
  t1Players: (Player | PlayerStats | undefined)[];
  t2Players: (Player | PlayerStats | undefined)[];
  score1: number | undefined;
  score2: number | undefined;
  onScore1: (v: string) => void;
  onScore2: (v: string) => void;
  isFinal?: boolean;
  subtitle?: string | null;
  lang: Language;
}

const MatchCard: React.FC<MatchCardProps> = ({
  title,
  t1Players,
  t2Players,
  score1,
  score2,
  onScore1,
  onScore2,
  isFinal = false,
  subtitle = null,
  lang
}) => {
   const [t1p1, t1p2] = sortPlayers(t1Players[0], t1Players[1]);
   const [t2p1, t2p2] = sortPlayers(t2Players[0], t2Players[1]);

   return (
    <div className={`rounded-xl shadow-sm p-3 mb-3 border-2 ${isFinal ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400' : 'bg-white border-valentine-200'}`}>
        <div className="text-center font-bold text-valentine-800 mb-2 text-xs uppercase tracking-wider flex justify-center items-center gap-2">
          {isFinal && <Trophy className="w-3 h-3 text-yellow-500"/>}
          {title}
        </div>
        <div className="flex items-center justify-between">
            {/* Team 1 */}
            <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="flex -space-x-2 mb-1">
                    <PlayerAvatar url={t1p1?.avatar} name={getLocalizedName(lang, t1p1)} size="sm" className="ring-2 ring-white z-10"/>
                    <PlayerAvatar url={t1p2?.avatar} name={getLocalizedName(lang, t1p2)} size="sm" className="ring-2 ring-white z-0"/>
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-800 text-center leading-tight truncate w-full px-1">
                  {getLocalizedName(lang, t1p1)}<br/>{getLocalizedName(lang, t1p2)}
                </div>
            </div>

            {/* Score Inputs */}
            <div className="flex items-center gap-1 mx-1 sm:mx-2 shrink-0">
                <input 
                  type="number" 
                  inputMode="numeric"
                  className={`w-9 h-9 sm:w-10 sm:h-10 text-center border rounded bg-white font-bold text-lg focus:ring-2 focus:ring-valentine-300 outline-none ${isFinal ? 'border-yellow-300' : 'border-slate-300'}`}
                  value={score1 === undefined ? '' : score1}
                  onChange={(e) => onScore1(e.target.value)}
                  placeholder="-"
                />
                <span className="text-slate-300 font-bold text-xs">:</span>
                 <input 
                  type="number" 
                  inputMode="numeric"
                  className={`w-9 h-9 sm:w-10 sm:h-10 text-center border rounded bg-white font-bold text-lg focus:ring-2 focus:ring-valentine-300 outline-none ${isFinal ? 'border-yellow-300' : 'border-slate-300'}`}
                  value={score2 === undefined ? '' : score2}
                  onChange={(e) => onScore2(e.target.value)}
                  placeholder="-"
                />
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center flex-1 min-w-0">
                 <div className="flex -space-x-2 mb-1">
                    <PlayerAvatar url={t2p1?.avatar} name={getLocalizedName(lang, t2p1)} size="sm" className="ring-2 ring-white z-10"/>
                    <PlayerAvatar url={t2p2?.avatar} name={getLocalizedName(lang, t2p2)} size="sm" className="ring-2 ring-white z-0"/>
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-slate-800 text-center leading-tight truncate w-full px-1">
                  {getLocalizedName(lang, t2p1)}<br/>{getLocalizedName(lang, t2p2)}
                </div>
            </div>
        </div>
        {subtitle && <div className="text-center text-[10px] text-slate-400 mt-1">{subtitle}</div>}
    </div>
   );
};

interface ScoreTabProps {
  lang: Language;
  scores: ScoreState;
  players: Player[];
  playoffScores: PlayoffScores;
  onUpdateScore: (matchId: string, team: 'team1' | 'team2', value: string) => void;
  onUpdatePlayoffScore: (key: keyof PlayoffScores, value: string) => void;
}

const ScoreTab: React.FC<ScoreTabProps> = ({ lang, scores, players, playoffScores, onUpdateScore, onUpdatePlayoffScore }) => {
  const [subTab, setSubTab] = useState<'rounds' | 'finals'>('rounds');
  const t = TRANSLATIONS[lang].scores;
  const tResults = TRANSLATIONS[lang].results;
  const tSched = TRANSLATIONS[lang].schedule;
  const tSub = TRANSLATIONS[lang].subTabs;

  const getPlayer = (id: string) => players.find(p => p.id === id);

  // Stats Calculation for Finals Brackets
  const calculateStats = (): PlayerStats[] => {
    const stats: Record<string, PlayerStats> = {};
    players.forEach(p => { stats[p.id] = { ...p, gamesWon: 0, matchesPlayed: 0 }; });
    SCHEDULE.forEach(round => {
        round.matches.forEach(match => {
            const matchScore = scores[match.id];
            if (matchScore) {
                const t1Score = Number(matchScore.team1Games) || 0;
                const t2Score = Number(matchScore.team2Games) || 0;
                [match.team1.player1, match.team1.player2].forEach(pid => {
                    stats[pid].gamesWon += t1Score;
                    stats[pid].matchesPlayed += 1;
                });
                [match.team2.player1, match.team2.player2].forEach(pid => {
                    stats[pid].gamesWon += t2Score;
                    stats[pid].matchesPlayed += 1;
                });
            }
        });
    });
    return Object.values(stats);
  };

  const allStats = calculateStats();
  const menStats = allStats.filter(p => p.gender === 'M').sort((a, b) => b.gamesWon - a.gamesWon);
  const womenStats = allStats.filter(p => p.gender === 'F').sort((a, b) => b.gamesWon - a.gamesWon);

  // Bracket Teams
  const s1_team1 = { m: menStats[0], f: womenStats[3] }; 
  const s1_team2 = { m: menStats[2], f: womenStats[1] }; 
  const s2_team1 = { m: menStats[1], f: womenStats[2] }; 
  const s2_team2 = { m: menStats[3], f: womenStats[0] };

  const s1_winner = playoffScores.s1_t1 > playoffScores.s1_t2 ? s1_team1 : s1_team2;
  const s1_loser = playoffScores.s1_t1 > playoffScores.s1_t2 ? s1_team2 : s1_team1;
  const s2_winner = playoffScores.s2_t1 > playoffScores.s2_t2 ? s2_team1 : s2_team2;
  const s2_loser = playoffScores.s2_t1 > playoffScores.s2_t2 ? s2_team2 : s2_team1;

  return (
    <div className="animate-fadeIn">
      {/* Sub Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex shadow-inner">
            <button
                onClick={() => setSubTab('rounds')}
                className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all ${subTab === 'rounds' ? 'bg-white text-valentine-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                {tSub.rounds}
            </button>
            <button
                onClick={() => setSubTab('finals')}
                className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all ${subTab === 'finals' ? 'bg-white text-valentine-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                {tSub.finals}
            </button>
        </div>
      </div>

      {subTab === 'rounds' ? (
        <div className="space-y-6">
            {SCHEDULE.map((round) => (
                <div key={round.id}>
                    <h3 className="font-bold text-valentine-800 mb-3 px-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-valentine-500"></span>
                        {lang === 'en' ? round.nameEn : round.nameCn}
                    </h3>
                    <div className="grid grid-cols-1 gap-1">
                        {round.matches.map((match) => (
                             <MatchCard 
                                key={match.id}
                                lang={lang}
                                title={`${tSched.court} ${match.court}`}
                                t1Players={[getPlayer(match.team1.player1), getPlayer(match.team1.player2)]}
                                t2Players={[getPlayer(match.team2.player1), getPlayer(match.team2.player2)]}
                                score1={scores[match.id]?.team1Games}
                                score2={scores[match.id]?.team2Games}
                                onScore1={(v) => onUpdateScore(match.id, 'team1', v)}
                                onScore2={(v) => onUpdateScore(match.id, 'team2', v)}
                             />
                        ))}
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div>
            <MatchCard
                lang={lang}
                title={tResults.semi1}
                t1Players={[s1_team1.f, s1_team1.m]}
                t2Players={[s1_team2.f, s1_team2.m]}
                score1={playoffScores.s1_t1}
                score2={playoffScores.s1_t2}
                onScore1={(v) => onUpdatePlayoffScore('s1_t1', v)}
                onScore2={(v) => onUpdatePlayoffScore('s1_t2', v)}
            />
            <MatchCard
                lang={lang}
                title={tResults.semi2}
                t1Players={[s2_team1.f, s2_team1.m]}
                t2Players={[s2_team2.f, s2_team2.m]}
                score1={playoffScores.s2_t1}
                score2={playoffScores.s2_t2}
                onScore1={(v) => onUpdatePlayoffScore('s2_t1', v)}
                onScore2={(v) => onUpdatePlayoffScore('s2_t2', v)}
            />
            
            <div className="mt-8">
                <MatchCard
                    lang={lang}
                    title={tResults.gold}
                    t1Players={[s1_winner.f, s1_winner.m]}
                    t2Players={[s2_winner.f, s2_winner.m]}
                    score1={playoffScores.final_t1}
                    score2={playoffScores.final_t2}
                    onScore1={(v) => onUpdatePlayoffScore('final_t1', v)}
                    onScore2={(v) => onUpdatePlayoffScore('final_t2', v)}
                    isFinal={true}
                />
            </div>
            <div className="mt-4 opacity-75 grayscale hover:grayscale-0 transition-all">
                <MatchCard
                    lang={lang}
                    title={tResults.bronze}
                    t1Players={[s1_loser.f, s1_loser.m]}
                    t2Players={[s2_loser.f, s2_loser.m]}
                    score1={playoffScores.bronze_t1}
                    score2={playoffScores.bronze_t2}
                    onScore1={(v) => onUpdatePlayoffScore('bronze_t1', v)}
                    onScore2={(v) => onUpdatePlayoffScore('bronze_t2', v)}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default ScoreTab;