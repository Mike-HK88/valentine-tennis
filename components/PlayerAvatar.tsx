import React from 'react';
import { User } from 'lucide-react';

interface PlayerAvatarProps {
  url?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ url, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative inline-block rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {url ? (
        <img src={url} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-valentine-100 text-valentine-600 font-bold">
          {initials || <User className="w-1/2 h-1/2" />}
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;