import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { VoiceNoteData } from '../../types';

interface VoiceNotePlayerProps {
  voiceNote: VoiceNoteData;
  isSender: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ voiceNote, isSender }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const duration = voiceNote.durationSeconds || 12;
  const waveform = voiceNote.waveform || [30, 60, 40, 90, 80, 50, 70, 95, 60, 40, 80, 50, 30];

  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (1 / (duration * 10));
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentProgress >= 1) setCurrentProgress(0);
      setIsPlaying(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const elapsedSec = duration * currentProgress;

  return (
    <div className="flex items-center gap-2.5 p-1 min-w-[200px] sm:min-w-[240px]">
      {/* Play/Pause round button */}
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0 ${
          isSender 
            ? 'bg-white text-[#514088]' 
            : 'bg-[#514088] text-white'
        }`}
        aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
      >
        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      {/* Waveform Visualization */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-1 h-7">
          {waveform.map((val, idx) => {
            const barProgress = idx / waveform.length;
            const isPassed = barProgress <= currentProgress;
            const heightPx = Math.max(6, Math.min(24, Math.round((val / 100) * 24)));

            return (
              <span
                key={idx}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSender
                    ? isPassed ? 'bg-white' : 'bg-white/40'
                    : isPassed ? 'bg-[#514088]' : 'bg-[#d4c9d4]'
                }`}
                style={{ height: `${heightPx}px` }}
              />
            );
          })}
        </div>

        {/* Time duration */}
        <div className="flex justify-between items-center text-[10px] mt-0.5 opacity-80">
          <span>{isPlaying ? formatSeconds(elapsedSec) : formatSeconds(duration)}</span>
          <Volume2 className="w-3 h-3 opacity-60" />
        </div>
      </div>
    </div>
  );
};
