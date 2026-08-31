import React, { useState } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  Users, 
  MessageSquare, 
  Send, 
  X, 
  ShieldCheck,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface GroupMeetingModalProps {
  meetingId: string;
  onLeave: () => void;
}

export const GroupMeetingModal: React.FC<GroupMeetingModalProps> = ({ meetingId, onLeave }) => {
  const { currentUser, users, meetings } = useWorkspace();
  const meeting = meetings.find(m => m.id === meetingId) || meetings[0];

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<'none' | 'chat' | 'participants'>('none');
  const [meetingChatText, setMeetingChatText] = useState('');
  const [meetingMessages, setMeetingMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'د. ياسر الطبيب', text: 'أهلاً بكم جميعاً في اجتماع المتابعة الدوري لشركة الدكتور', time: '10:02 ص' },
    { sender: 'م. أحمد خالد', text: 'وعليكم السلام يا دكتور، العرض التقديمي جاهز للمشاركة', time: '10:03 ص' }
  ]);

  if (!meeting || !currentUser) return null;

  const handleSendMeetingMessage = () => {
    if (!meetingChatText.trim()) return;
    setMeetingMessages(prev => [
      ...prev,
      {
        sender: currentUser.name,
        text: meetingChatText,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setMeetingChatText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      <div 
        className="w-full h-full max-w-7xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col justify-between"
        id="group-meeting-room"
      >
        {/* Top Meeting Header */}
        <div className="p-3 sm:p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h2 className="text-sm sm:text-base font-bold text-white">{meeting.title}</h2>
              <span className="text-xs text-emerald-400">غرفة مشفرة • رمز الاجتماع: {meeting.roomUrl || meeting.roomCode}</span>
            </div>
          </div>

          {/* Quick sidebar buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSidebar(activeSidebar === 'participants' ? 'none' : 'participants')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeSidebar === 'participants' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>المشاركون ({meeting.participants.length})</span>
            </button>

            <button
              onClick={() => setActiveSidebar(activeSidebar === 'chat' ? 'none' : 'chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeSidebar === 'chat' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>الدردشة</span>
            </button>
          </div>
        </div>

        {/* Center Area: Video Grid & Sidebars */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Video Grid */}
          <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto items-center justify-center">
            {/* Screen sharing tile if active */}
            {isScreenSharing && (
              <div className="sm:col-span-2 bg-slate-950 rounded-xl border border-emerald-500/50 p-4 flex flex-col items-center justify-center relative min-h-[220px]">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                  <Monitor className="w-5 h-5 animate-pulse" />
                  <span>أنت تقوم بمشاركة شاشتك الآن</span>
                </div>
                <p className="text-xs text-slate-400">جميع الحاضرين يشاهدون عرض شركة الدكتور المباشر</p>
              </div>
            )}

            {/* Participants Video Tiles */}
            {meeting.participants.map((p, idx) => {
              const u = users.find(user => user.id === p.userId);
              const isCurrentUser = p.userId === currentUser.id;

              return (
                <div 
                  key={idx}
                  className="bg-slate-800/80 rounded-xl border border-slate-700 p-4 relative flex flex-col items-center justify-center min-h-[180px] shadow-sm group"
                >
                  {/* Participant Avatar / Video */}
                  <div className="relative">
                    <img 
                      src={u?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                      alt={p.name} 
                      className="w-20 h-20 rounded-xl object-cover ring-2 ring-slate-600" 
                    />
                    {p.isSpeaking && (
                      <span className="absolute -inset-1 rounded-xl border-2 border-emerald-400 animate-pulse"></span>
                    )}
                  </div>

                  {/* Name Tag */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between bg-slate-900/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg text-white border border-slate-700/50">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-semibold truncate">{p.name} {isCurrentUser && '(أنت)'}</span>
                      <span className="text-[10px] text-emerald-400 truncate">({u?.jobTitle})</span>
                    </div>
                    <div>
                      {p.isMuted ? (
                        <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sidebar (Chat or Participants) */}
          {activeSidebar !== 'none' && (
            <div className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col text-right text-white">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-xs">
                  {activeSidebar === 'chat' ? 'دردشة الاجتماع الفورية' : 'قائمة المشاركين'}
                </span>
                <button onClick={() => setActiveSidebar('none')} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeSidebar === 'chat' ? (
                <div className="flex-1 flex flex-col justify-between p-3">
                  <div className="space-y-3 overflow-y-auto max-h-[420px] text-xs">
                    {meetingMessages.map((m, i) => (
                      <div key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-emerald-400">
                          <span className="font-semibold">{m.sender}</span>
                          <span>{m.time}</span>
                        </div>
                        <p className="text-slate-200">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      value={meetingChatText}
                      onChange={(e) => setMeetingChatText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMeetingMessage()}
                      placeholder="اكتب رسالة للاجتماع..."
                      className="flex-1 p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs outline-none text-white focus:border-slate-500"
                    />
                    <button
                      onClick={handleSendMeetingMessage}
                      className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                    >
                      <Send className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-3 space-y-2 overflow-y-auto text-xs">
                  {meeting.participants.map((p, idx) => {
                    const u = users.find(user => user.id === p.userId);
                    return (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <img src={u?.avatar} alt={p.name} className="w-7 h-7 rounded-md object-cover" />
                          <div>
                            <span className="font-semibold text-slate-200 block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{u?.jobTitle}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold">حاضر</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-center gap-4">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMuted ? 'إلغاء كتم الصوت' : 'كتم المايكروفون'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'تشغيل الكاميرا' : 'إيقاف الكاميرا'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isScreenSharing ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="مشاركة الشاشة"
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* Leave Meeting (Red button) */}
          <button
            onClick={onLeave}
            className="px-6 h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 font-semibold shadow-lg transition-transform active:scale-90 cursor-pointer"
            id="btn-leave-meeting"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-xs">مغادرة الاجتماع</span>
          </button>
        </div>
      </div>
    </div>
  );
};
