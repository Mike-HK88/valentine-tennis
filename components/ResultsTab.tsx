import React, { useState } from 'react';
import { Trophy, Medal, User } from 'lucide-react';
import { TRANSLATIONS, SCHEDULE } from '../constants';
import { Language, ScoreState, PlayerStats, Player, PlayoffScores } from '../types';
import PlayerAvatar from './PlayerAvatar';

interface ResultsTabProps {
  lang: Language;
  scores: ScoreState;
  players: Player[];
  playoffScores: PlayoffScores;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ lang, scores, players, playoffScores }) => {
  const [subTab, setSubTab] = useState<'rounds' | 'finals'>('rounds');
  const t = TRANSLATIONS[lang].results;
  const tSub = TRANSLATIONS[lang].subTabs;

  // 1. Calculate Leaderboard
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

  // Playoff Logic (Read-only view)
  const s1_team1 = { m: menStats[0], f: womenStats[3] }; 
  const s1_team2 = { m: menStats[2], f: womenStats[1] }; 
  const s2_team1 = { m: menStats[1], f: womenStats[2] }; 
  const s2_team2 = { m: menStats[3], f: womenStats[0] };

  const s1_winner = playoffScores.s1_t1 > playoffScores.s1_t2 ? s1_team1 : s1_team2;
  const s1_loser = playoffScores.s1_t1 > playoffScores.s1_t2 ? s1_team2 : s1_team1;
  const s2_winner = playoffScores.s2_t1 > playoffScores.s2_t2 ? s2_team1 : s2_team2;
  const s2_loser = playoffScores.s2_t1 > playoffScores.s2_t2 ? s2_team2 : s2_team1;

  const getName = (p: PlayerStats) => (lang === 'cn' && p.nameCn ? p.nameCn : p.name);

  const renderRankingTable = (title: string, data: PlayerStats[]) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-slate-100">
        <div className="bg-valentine-100 px-4 py-2 font-bold text-valentine-800 border-b border-valentine-200 flex items-center">
            <User className="w-4 h-4 mr-2"/>
            {title}
        </div>
        <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
                <tr>
                    <th className="px-4 py-2 text-left w-12">#</th>
                    <th className="px-4 py-2 text-left">{t.winner}</th>
                    <th className="px-4 py-2 text-right">{t.games}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.map((p, idx) => (
                    <tr key={p.id} className={idx < 2 ? "bg-yellow-50/30" : ""}>
                        <td className="px-4 py-3 font-semibold text-slate-400">
                            {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                            <PlayerAvatar url={p.avatar} name={getName(p)} size="sm" />
                            {getName(p)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-valentine-600">
                            {p.gamesWon}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  const renderMatchupView = (
      title: string, 
      t1: {m: PlayerStats, f: PlayerStats}, 
      t2: {m: PlayerStats, f: PlayerStats},
      score1: number,
      score2: number,
      isFinal = false
  ) => (
      <div className={`rounded-xl shadow-sm p-4 mb-4 border-2 ${isFinal ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400' : 'bg-white border-valentine-200'}`}>
          <div className="text-center font-bold text-valentine-800 mb-3 text-sm uppercase tracking-wider flex justify-center items-center gap-2">
            {isFinal && <Trophy className="w-4 h-4 text-yellow-500"/>}
            {title}
          </div>
          <div className="flex items-center justify-between">
              {/* Team 1 - Lady First */}
              <div className="flex flex-col items-center flex-1">
                  <div className="flex -space-x-2 mb-1">
                      <PlayerAvatar url={t1.f.avatar} name={getName(t1.f)} size="sm" className="ring-2 ring-white z-10"/>
                      <PlayerAvatar url={t1.m.avatar} name={getName(t1.m)} size="sm" className="ring-2 ring-white z-0"/>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 leading-tight text-center">
                    {getName(t1.f)}<br/>& {getName(t1.m)}
                  </div>
                  {!isFinal && <div className="text-[10px] text-slate-400 mt-1">({t.seed} {t1.m.gamesWon}/{t1.f.gamesWon})</div>}
              </div>

              {/* Score */}
              <div className="flex items-center gap-2 mx-2">
                  <span className="text-2xl font-bold text-slate-700">{score1}</span>
                  <span className="text-slate-400 text-sm">:</span>
                  <span className="text-2xl font-bold text-slate-700">{score2}</span>
              </div>

              {/* Team 2 - Lady First */}
              <div className="flex flex-col items-center flex-1">
                   <div className="flex -space-x-2 mb-1">
                      <PlayerAvatar url={t2.f.avatar} name={getName(t2.f)} size="sm" className="ring-2 ring-white z-10"/>
                      <PlayerAvatar url={t2.m.avatar} name={getName(t2.m)} size="sm" className="ring-2 ring-white z-0"/>
                  </div>
                  <div className="text-sm font-semibold text-slate-800 leading-tight text-center">
                    {getName(t2.f)}<br/>& {getName(t2.m)}
                  </div>
                  {!isFinal && <div className="text-[10px] text-slate-400 mt-1">({t.seed} {t2.m.gamesWon}/{t2.f.gamesWon})</div>}
              </div>
          </div>
      </div>
  );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex">
            <button
                onClick={() => setSubTab('rounds')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${subTab === 'rounds' ? 'bg-white text-valentine-600 shadow-sm' : 'text-slate-500'}`}
            >
                {tSub.rounds}
            </button>
            <button
                onClick={() => setSubTab('finals')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${subTab === 'finals' ? 'bg-white text-valentine-600 shadow-sm' : 'text-slate-500'}`}
            >
                {tSub.finals}
            </button>
        </div>
      </div>

      {subTab === 'rounds' ? (
        <>
            {/* Ladies First! */}
            {renderRankingTable(TRANSLATIONS[lang].info.ladies, womenStats)}
            {renderRankingTable(TRANSLATIONS[lang].info.gentlemen, menStats)}
        </>
      ) : (
        <>
            {renderMatchupView(t.semi1, s1_team1, s1_team2, playoffScores.s1_t1, playoffScores.s1_t2)}
            {renderMatchupView(t.semi2, s2_team1, s2_team2, playoffScores.s2_t1, playoffScores.s2_t2)}
            <div className="mt-8">
                {renderMatchupView(t.gold, s1_winner, s2_winner, playoffScores.final_t1, playoffScores.final_t2, true)}
            </div>
            <div className="mt-4 opacity-75">
                {renderMatchupView(t.bronze, s1_loser, s2_loser, playoffScores.bronze_t1, playoffScores.bronze_t2)}
            </div>
        </>
      )}
    </div>
  );
};

export default ResultsTab;