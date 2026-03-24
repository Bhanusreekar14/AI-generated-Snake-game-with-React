import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_01", artist: "UNKNOWN_ENTITY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "CORRUPTED_SECTOR", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "VOID_RESONANCE", artist: "NULL_PTR", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="bg-black border-4 border-[#00ffff] p-6 w-full max-w-md mx-auto flex flex-col items-center gap-6 relative shadow-[8px_8px_0px_#ff00ff]">
      {/* Glitchy decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] animate-pulse" />
      <div className="absolute bottom-2 right-2 text-[#ff00ff] font-pixel text-[10px]">AUDIO_MOD_V1.0</div>
      
      <audio ref={audioRef} src={currentTrack.url} onEnded={handleEnded} />
      
      <div className="text-center space-y-2 w-full border-b-2 border-[#00ffff] pb-4">
        <h2 className="text-xl font-pixel uppercase text-white glitch" data-text={currentTrack.title}>
          {currentTrack.title}
        </h2>
        <p className="text-[#ff00ff] font-terminal text-2xl tracking-widest">&gt; {currentTrack.artist}</p>
      </div>

      {/* Audio Visualizer Mockup */}
      <div className="flex items-end gap-1 h-16 w-full justify-center opacity-90">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className={`w-4 ${isPlaying ? 'bg-[#00ffff]' : 'bg-[#ff00ff]'}`}
            style={{
              height: isPlaying ? `${Math.max(10, Math.random() * 100)}%` : '10%',
              transition: 'height 0.1s steps(3)',
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-6">
        <button onClick={skipBack} className="p-2 border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-none">
          <SkipBack size={24} />
        </button>
        
        <button onClick={togglePlay} className="p-4 border-4 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none shadow-[4px_4px_0px_#ff00ff]">
          {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>

        <button onClick={skipForward} className="p-2 border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-none">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full px-4 border-t-2 border-[#00ffff] pt-4">
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#00ffff] hover:text-[#ff00ff]">
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-full h-4 bg-black border-2 border-[#ff00ff] appearance-none cursor-pointer accent-[#00ffff]"
        />
      </div>
    </div>
  );
}
