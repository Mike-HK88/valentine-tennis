import React from 'react';
import { MapPin, Clock, Info as InfoIcon, Car, Users, Heart } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, Player } from '../types';
import PlayerAvatar from './PlayerAvatar';

interface InfoTabProps {
  lang: Language;
  players: Player[];
}

const InfoTab: React.FC<InfoTabProps> = ({ lang, players }) => {
  const t = TRANSLATIONS[lang].info;
  const men = players.filter((p) => p.gender === 'M');
  const women = players.filter((p) => p.gender === 'F');

  const getName = (p: Player) => (lang === 'cn' && p.nameCn ? p.nameCn : p.name);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-valentine-400">
        <h3 className="text-xl font-bold text-valentine-800 mb-4 flex items-center">
          <InfoIcon className="w-6 h-6 mr-2" />
          {lang === 'en' ? 'Event Details' : '活动详情'}
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start">
            <MapPin className="w-5 h-5 text-valentine-500 mr-3 mt-1 shrink-0" />
            <div>
              <span className="font-semibold block">{t.venue.label}</span>
              <span className="text-slate-600">{t.venue.value}</span>
            </div>
          </li>
          <li className="flex items-start">
            <Clock className="w-5 h-5 text-valentine-500 mr-3 mt-1 shrink-0" />
            <div>
              <span className="font-semibold block">{t.time.label}</span>
              <span className="text-slate-600">{t.time.value}</span>
            </div>
          </li>
          <li className="flex items-start">
            <Heart className="w-5 h-5 text-valentine-500 mr-3 mt-1 shrink-0" />
            <div>
              <span className="font-semibold block">{t.logistics.label}</span>
              <span className="text-slate-600">{t.logistics.value}</span>
            </div>
          </li>
          <li className="flex items-start">
            <Car className="w-5 h-5 text-valentine-500 mr-3 mt-1 shrink-0" />
            <div>
              <span className="font-semibold block">{t.parking.label}</span>
              <span className="text-slate-600">{t.parking.value}</span>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-valentine-400">
        <h3 className="text-xl font-bold text-valentine-800 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          {t.players.label}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-valentine-600 mb-3 border-b border-valentine-100 pb-2">{t.ladies}</h4>
            <ul className="space-y-3">
              {women.map((p) => (
                <li key={p.id} className="flex items-center space-x-2">
                   <PlayerAvatar url={p.avatar} name={getName(p)} size="sm" />
                   <span className="text-slate-700 font-medium">{getName(p)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-valentine-600 mb-3 border-b border-valentine-100 pb-2">{t.gentlemen}</h4>
            <ul className="space-y-3">
              {men.map((p) => (
                <li key={p.id} className="flex items-center space-x-2">
                   <PlayerAvatar url={p.avatar} name={getName(p)} size="sm" />
                   <span className="text-slate-700 font-medium">{getName(p)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoTab;