/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-terminal overflow-hidden relative flex flex-col items-center justify-center p-4 scanlines">
      <div className="noise"></div>

      <div className="z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        
        {/* Left Side - Title & Info */}
        <div className="hidden lg:flex flex-col items-start justify-center space-y-8 border-l-8 border-[#ff00ff] pl-6 py-4 bg-black/80">
          <h1 className="text-4xl font-pixel glitch uppercase text-white" data-text="SYS.OP.SNAKE">
            SYS.OP.SNAKE
          </h1>
          <div className="text-[#ff00ff] font-terminal text-3xl max-w-xs leading-none uppercase tracking-widest">
            <p>&gt; INITIALIZING NEURAL LINK...</p>
            <p>&gt; OVERRIDE: ACCEPTED.</p>
            <p>&gt; AESTHETIC: GLITCH_ART.</p>
          </div>
          <div className="flex gap-2 mt-4 w-full">
            <div className="h-4 flex-1 bg-[#00ffff] animate-pulse" />
            <div className="h-4 w-8 bg-[#ff00ff]" />
            <div className="h-4 w-4 bg-white" />
          </div>
        </div>

        {/* Center - Game */}
        <div className="flex justify-center w-full relative z-20">
          <SnakeGame />
        </div>

        {/* Right Side - Music Player */}
        <div className="flex justify-center w-full lg:justify-end relative z-20">
          <MusicPlayer />
        </div>

      </div>
      
      {/* Mobile Title */}
      <div className="lg:hidden absolute top-4 text-center z-10 bg-black px-4 py-2 border-2 border-[#ff00ff]">
        <h1 className="text-xl font-pixel glitch text-white" data-text="SYS.OP.SNAKE">
          SYS.OP.SNAKE
        </h1>
      </div>
    </div>
  );
}
