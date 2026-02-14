import React, { useRef } from 'react';
import { User, Settings, Upload } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language, Player } from '../types';
import PlayerAvatar from './PlayerAvatar';

interface SettingsTabProps {
  lang: Language;
  players: Player[];
  onUpdatePlayer: (id: string, field: 'name' | 'nameCn' | 'avatar', value: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ lang, players, onUpdatePlayer }) => {
  const t = TRANSLATIONS[lang].settings;
  const men = players.filter((p) => p.gender === 'M');
  const women = players.filter((p) => p.gender === 'F');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadId = useRef<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUploadId.current) {
        // Resize image to max 300x300 to save localStorage space
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxSize = 300;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                onUpdatePlayer(currentUploadId.current!, 'avatar', dataUrl);
                currentUploadId.current = null;
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
    // Reset value so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = (id: string) => {
      currentUploadId.current = id;
      fileInputRef.current?.click();
  };

  const renderPlayerInputs = (player: Player) => (
    <div key={player.id} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="relative group cursor-pointer" onClick={() => triggerUpload(player.id)}>
          <PlayerAvatar url={player.avatar} name={player.name} size="md" />
          <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-4 h-4 text-white" />
          </div>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-2">
        <input
          type="text"
          value={player.name}
          onChange={(e) => onUpdatePlayer(player.id, 'name', e.target.value)}
          placeholder={t.enName}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-valentine-400 focus:ring-1 focus:ring-valentine-200 outline-none"
        />
        <input
          type="text"
          value={player.nameCn || ''}
          onChange={(e) => onUpdatePlayer(player.id, 'nameCn', e.target.value)}
          placeholder={t.cnName}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-valentine-400 focus:ring-1 focus:ring-valentine-200 outline-none"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-valentine-400">
        <div className="space-y-6">
          {/* Ladies First */}
          <div>
            <h4 className="font-semibold text-valentine-600 mb-2 flex items-center">
               <User className="w-4 h-4 mr-1"/> Ladies
            </h4>
            <div className="flex flex-col">
              {women.map(renderPlayerInputs)}
            </div>
          </div>

          {/* Gentlemen Second */}
          <div>
            <h4 className="font-semibold text-valentine-600 mb-2 flex items-center">
              <User className="w-4 h-4 mr-1"/> Gentlemen
            </h4>
            <div className="flex flex-col">
              {men.map(renderPlayerInputs)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;