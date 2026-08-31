import React, { useState } from 'react';
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  Play
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Meeting } from '../../types';

export const MeetingsView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    meetings, 
    createMeeting, 
    joinMeetingRoom 
  } = useWorkspace();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('اليوم 10:00 ص');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(users.map(u => u.id));

  if (!currentUser) return null;

  const handleCopyLink = (meeting: Meeting) => {
    navigator.clipboard.writeText(`https://doctor-workspace.internal/meet/${meeting.roomUrl || meeting.roomCode}`);
    setCopiedId(meeting.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateMeetingSubmit = () => {
    if (!title.trim()) return;
    createMeeting(title, description, scheduledAt, selectedUserIds);
    setShowScheduleModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto p-3 sm:p-6 select-none" id="meetings-management-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-lg bg-slate-900 text-white">
            <Video className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">غرف واجتماعات الفيديو</h1>
            <p className="text-xs text-slate-500">منظومة مؤتمرات واجتماعات فيديو مشفرة لفريق شركة الدكتور</p>
          </div>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-transform active:scale-95 cursor-pointer"
          id="btn-schedule-meeting"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>جدولة اجتماع جديد</span>
        </button>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {meetings.map(m => {
          const host = users.find(u => u.id === (m.hostId || m.createdBy));
          const isUpcoming = m.status === 'upcoming' || m.status === 'live';

          return (
            <div 
              key={m.id} 
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3 text-xs">
                {/* Status & Room Code */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                    isUpcoming ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {isUpcoming ? 'اجتماع نشط وجاهز 🟢' : 'مكتمل'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">#{m.roomUrl || m.roomCode}</span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{m.title}</h3>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">{m.description}</p>
                </div>

                {/* Host info & Time */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-700" />
                    <span className="font-semibold text-slate-900">{m.scheduledAt || `${m.scheduledDate} ${m.scheduledTime}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600">المضيف: {host?.name} ({host?.jobTitle})</span>
                  </div>
                </div>

                {/* Participants Avatars */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center -space-x-2 space-x-reverse overflow-hidden">
                    {m.participants.slice(0, 4).map((p, i) => {
                      const u = users.find(user => user.id === p.userId);
                      return (
                        <img 
                          key={i} 
                          src={u?.avatar} 
                          alt={p.name} 
                          title={p.name}
                          className="w-7 h-7 rounded-full border-2 border-white object-cover ring-1 ring-slate-200" 
                        />
                      );
                    })}
                    {m.participants.length > 4 && (
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center border-2 border-white ring-1 ring-slate-200">
                        +{m.participants.length - 4}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopyLink(m)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                    title="نسخ رابط الغرفة"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === m.id ? 'تم النسخ' : 'نسخ الرابط'}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Join Action */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => joinMeetingRoom(m.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
                  id={`btn-join-meeting-${m.id}`}
                >
                  <Play className="w-4 h-4 fill-current text-emerald-400" />
                  <span>دخول غرفة الاجتماع الآن</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-right">
            <h3 className="font-bold text-slate-900 text-base mb-1">جدولة اجتماع فيديو جديد</h3>
            <p className="text-xs text-slate-500 mb-4">إنشاء غرفة اجتماع مشفرة وتوجيه الدعوات لموظفي شركة الدكتور</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان الاجتماع:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: ورشة عمل إطلاق الهوية البصرية"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-slate-400 outline-none font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">وصف وأجندة الاجتماع:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب المحاور الرئيسية والنقاط المطلوب مناقشتها..."
                  rows={2}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-slate-400 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">موعد الاجتماع:</label>
                <input
                  type="text"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  placeholder="اليوم 02:00 م أو غداً 11:00 ص"
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">المشاركون المدعوون:</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {users.map(u => {
                    const isSelected = (selectedUserIds || []).includes(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          setSelectedUserIds(prev => 
                            isSelected ? prev.filter(id => id !== u.id) : [...prev, u.id]
                          );
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                          isSelected ? 'border-slate-900 bg-slate-100 font-semibold text-slate-900' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-md object-cover" />
                        <span className="text-[11px] truncate">{u.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateMeetingSubmit}
                disabled={!title.trim()}
                className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm disabled:opacity-50"
              >
                إنشاء وجدولة الاجتماع ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
