import React from 'react';
import { Character } from '../types';

interface CharacterListProps {
  characters: Character[];
  activeId: string;
  onSelect: (char: Character) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, activeId, onSelect }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-stone-400 text-sm tracking-[0.3em] mb-4 border-b border-stone-800 pb-2">
        ARCHIVES
      </h2>
      {characters.map((char) => (
        <button
          key={char.id}
          onClick={() => onSelect(char)}
          className={`
            group relative flex items-center gap-4 p-3 transition-all duration-300 border-r-2 text-left
            ${activeId === char.id 
              ? 'border-orange-600 bg-gradient-to-l from-orange-900/20 to-transparent' 
              : 'border-transparent hover:border-stone-600 hover:bg-white/5'}
          `}
        >
            <div className={`
                font-['Noto_Serif_JP'] text-2xl font-bold w-8
                ${activeId === char.id ? 'text-orange-500' : 'text-stone-600 group-hover:text-stone-400'}
            `}>
                {char.kanji.charAt(0)}
            </div>
          <div className="flex flex-col">
            <span className={`
                uppercase tracking-widest text-sm font-['Cinzel']
                ${activeId === char.id ? 'text-white' : 'text-stone-500 group-hover:text-stone-300'}
            `}>
              {char.name}
            </span>
            <span className="text-xs text-stone-600 group-hover:text-stone-500">
                {char.role}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CharacterList;
