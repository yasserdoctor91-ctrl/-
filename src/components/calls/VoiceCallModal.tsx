import React, { useState } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Phone
} from 'lucide-react';
import { ActiveCallState } from '../../context/WorkspaceContext';

interface VoiceCallModalProps {
  call: ActiveCallState;
  onEndCall: () => void;
  onToggleMute: () => void;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  call,
  onEndCall,
  onToggleMute
}) => {
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div 
        className="w-full max-w-sm bg-slate-900 rounded-2xl p-8 shadow-2xl text-center text-white flex flex-col items-center justify-between min-h-[480px] border border-slate-700"
        id="voice-call-overlay"
      >
        {/* Top Status */}
        <div className="space-y-1">
          <span className="text-xs text-emerald-400 font-semibold tracking-wider">
            مساحة عمل الدكتور • مكالمة صوتية مشفرة
          </span>
          <p className="text-xs text-slate-300">
            {call.isConnected ? `متصل • ${formatSeconds(call.durationSeconds)}` : 'جاري الاتصال...'}
          </p>
        </div>

        {/* Center Avatar & Pulsing Radar */}
        <div className="relative my-8 flex items-center justify-center">
          <div className={`w-36 h-36 rounded-full flex items-center justify-center ${!call.isConnected ? 'animate-ring-pulse' : ''}`}>
            <img 
              src={call.targetUser.avatar} 
              alt={call.targetUser.name} 
              className="w-28 h-28 rounded-full object-cover ring-4 ring-emerald-500/50 shadow-2xl" 
            />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-1 mb-8">
          <h2 className="text-xl font-bold text-white">{call.targetUser.name}</h2>
          <p className="text-xs text-emerald-400 font-medium">{call.targetUser.jobTitle}</p>
          <p className="text-[11px] text-slate-400">{call.targetUser.department}</p>
          
          {/* Animated sound wave when connected */}
          {call.isConnected && (
            <div className="flex items-center justify-center gap-1 mt-4 h-6">
              {[4, 12, 18, 8, 16, 22, 10, 14, 20, 8, 16, 6].map((h, i) => (
                <span 
                  key={i} 
                  className="w-1 bg-emerald-400 rounded-full animate-soundwave" 
                  style={{ animationDelay: `${i * 0.1}s`, height: `${h}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Call Controls */}
        <div className="flex items-center justify-center gap-6 w-full pt-4 border-t border-slate-800">
          {/* Mute toggle */}
          <button
            onClick={onToggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
              call.isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={call.isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {call.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End call (Red button) */}
          <button
            onClick={onEndCall}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
            title="إنهاء المكالمة"
            id="btn-end-call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Speaker toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
              isSpeakerOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-800/50 text-slate-500'
            }`}
            title={isSpeakerOn ? 'مكبر الصوت يعمل' : 'مكبر الصوت مغلق'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
