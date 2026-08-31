import React, { useState } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Maximize2, 
  Minimize2,
  Sparkles
} from 'lucide-react';
import { ActiveCallState } from '../../context/WorkspaceContext';

interface VideoCallModalProps {
  call: ActiveCallState;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  call,
  onEndCall,
  onToggleMute,
  onToggleVideo
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 select-none">
      <div 
        className={`relative w-full ${isFullScreen ? 'h-full max-w-full' : 'max-w-4xl h-[85vh]'} bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col justify-between`}
        id="video-call-overlay"
      >
        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 p-4 z-20 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <img 
              src={call.targetUser.avatar} 
              alt={call.targetUser.name} 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/50" 
            />
            <div className="text-right">
              <h3 className="font-bold text-sm text-white">{call.targetUser.name}</h3>
              <p className="text-[11px] text-emerald-400">{call.targetUser.jobTitle} • {call.isConnected ? formatSeconds(call.durationSeconds) : 'جاري الاتصال...'}</p>
            </div>
          </div>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Remote Video Stream Area */}
        <div className="flex-1 relative flex items-center justify-center bg-slate-950">
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <img 
                src={call.targetUser.avatar} 
                alt={call.targetUser.name} 
                className="w-32 h-32 rounded-2xl object-cover ring-4 ring-slate-700 shadow-2xl" 
              />
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-slate-800 text-emerald-400 text-[10px] font-semibold rounded-md border border-slate-600">
                بث فيديو HD
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200">مكالمة فيديو مشفرة مع {call.targetUser.name}</p>
          </div>

          {/* Picture-in-Picture Local Stream Box */}
          <div className="absolute bottom-24 right-4 w-32 sm:w-44 h-44 sm:h-56 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-2 text-center text-white">
            {call.isVideoOff ? (
              <div className="space-y-1">
                <VideoOff className="w-6 h-6 mx-auto text-rose-400" />
                <span className="text-[10px] text-slate-400">كاميرتك مغلقة</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-xs font-bold text-emerald-400 ring-1 ring-slate-700">
                  أنت
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block">كاميرتك نشطة</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 z-20 bg-gradient-to-t from-slate-950/90 to-transparent flex items-center justify-center gap-4 sm:gap-6">
          {/* Mute */}
          <button
            onClick={onToggleMute}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
              call.isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={call.isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {call.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={onToggleVideo}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
              call.isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={call.isVideoOff ? 'تشغيل الكاميرا' : 'إيقاف الكاميرا'}
          >
            {call.isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="px-6 h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 font-semibold shadow-lg transition-transform active:scale-90 cursor-pointer"
            id="btn-end-video-call"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-xs">إنهاء المكالمة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
