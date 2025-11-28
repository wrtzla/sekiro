import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';
import CharacterList from './components/CharacterList';
import { CHARACTERS } from './constants';
import { Character, LoreResponse } from './types';
import { fetchCharacterLore } from './services/geminiService';
import { SparklesIcon, BookOpenIcon, XMarkIcon } from '@heroicons/react/24/outline';

function App() {
  const [activeCharacter, setActiveCharacter] = useState<Character>(CHARACTERS[0]);
  const [lore, setLore] = useState<LoreResponse | null>(null);
  const [loadingLore, setLoadingLore] = useState(false);
  const [showLoreModal, setShowLoreModal] = useState(false);

  // Reset lore when character changes
  useEffect(() => {
    setLore(null);
    setShowLoreModal(false);
  }, [activeCharacter]);

  const handleGenerateLore = async () => {
    if (lore) {
      setShowLoreModal(true);
      return;
    }

    setLoadingLore(true);
    setShowLoreModal(true);
    const data = await fetchCharacterLore(activeCharacter.name);
    setLore(data);
    setLoadingLore(false);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden selection:bg-orange-900 selection:text-white">
      {/* 3D Background */}
      <Scene activeCharacter={activeCharacter} />

      {/* Noise Overlay Texture for Grit */}
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      {/* Main UI Container */}
      <div className="absolute inset-0 z-20 flex flex-col md:flex-row pointer-events-none">
        
        {/* Sidebar (Left) */}
        <div className="w-full md:w-1/3 lg:w-1/4 h-1/3 md:h-full bg-black/40 backdrop-blur-md border-r border-white/5 pointer-events-auto overflow-y-auto">
          <div className="p-8">
            <h1 className="text-4xl md:text-5xl font-['Cinzel'] text-white mb-2 tracking-tighter">
              SEKIRO
            </h1>
            <p className="text-orange-500 text-sm tracking-[0.5em] mb-12 opacity-80">SHADOWS DIE TWICE</p>
            
            <CharacterList 
              characters={CHARACTERS} 
              activeId={activeCharacter.id} 
              onSelect={setActiveCharacter} 
            />
          </div>
        </div>

        {/* Content Area (Right/Bottom) */}
        <div className="flex-1 flex flex-col justify-end p-8 md:p-16 relative">
          
          {/* Character Details */}
          <div className="max-w-2xl pointer-events-auto">
             <div className="flex items-end gap-6 mb-6">
                <h2 className="text-6xl md:text-8xl font-black font-['Noto_Serif_JP'] text-transparent bg-clip-text bg-gradient-to-t from-stone-500 to-white opacity-90">
                    {activeCharacter.kanji}
                </h2>
             </div>
             
             <h3 className="text-3xl md:text-5xl font-['Cinzel'] mb-4 text-orange-50">
                {activeCharacter.name}
             </h3>
             
             <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-transparent mb-6"></div>
             
             <p className="text-lg text-stone-300 font-light leading-relaxed max-w-xl mb-8 drop-shadow-md">
                {activeCharacter.shortDescription}
             </p>

             {/* Action Button */}
             <button
                onClick={handleGenerateLore}
                className="group relative px-8 py-3 bg-transparent overflow-hidden border border-stone-600 hover:border-orange-500 transition-colors duration-300"
             >
                <div className="absolute inset-0 w-0 bg-orange-900/40 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                <div className="relative flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-orange-400" />
                    <span className="font-['Cinzel'] tracking-wider text-stone-200 group-hover:text-white uppercase text-sm">
                        Consult the Spirits (AI Lore)
                    </span>
                </div>
             </button>
          </div>
        </div>
      </div>

      {/* Lore Modal / Overlay */}
      {showLoreModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-500">
           <div className="relative max-w-lg w-full bg-[#111] border border-stone-800 p-8 md:p-12 shadow-2xl shadow-orange-900/20">
              <button 
                onClick={() => setShowLoreModal(false)}
                className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <BookOpenIcon className="w-8 h-8 text-orange-600 mx-auto mb-4" />
                <h3 className="text-2xl font-['Cinzel'] text-stone-200 tracking-widest border-b border-stone-800 pb-4 inline-block">
                    FORGOTTEN MEMORIES
                </h3>
              </div>

              {loadingLore ? (
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="w-12 h-12 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stone-500 font-serif italic animate-pulse">Communing with the Ashina Depths...</p>
                </div>
              ) : lore ? (
                <div className="space-y-6">
                    <p className="text-stone-300 font-serif leading-relaxed text-lg border-l-2 border-orange-900 pl-4">
                        {lore.lore}
                    </p>
                    <div className="mt-8 text-right">
                        <p className="text-orange-500/80 italic font-['Noto_Serif_JP'] text-xl">
                            "{lore.quote}"
                        </p>
                    </div>
                </div>
              ) : (
                <p className="text-red-500 text-center">Connection to the spirit realm failed.</p>
              )}
           </div>
        </div>
      )}
      
      {/* Decorative Corner Elements */}
      <div className="absolute top-8 right-8 z-30 opacity-50 hidden md:block">
         <div className="flex gap-2">
            <div className="w-2 h-16 bg-stone-800"></div>
            <div className="w-2 h-12 bg-stone-800 mt-4"></div>
            <div className="w-2 h-8 bg-orange-900/50 mt-8"></div>
         </div>
      </div>
    </div>
  );
}

export default App;
