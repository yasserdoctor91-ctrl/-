import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  CheckCheck, 
  Clock, 
  Pin, 
  Paperclip, 
  Send, 
  ShieldCheck, 
  Eye, 
  BellRing,
  Users
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Announcement } from '../../types';

export const AnnouncementsView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    announcements, 
    createAnnouncement, 
    acknowledgeAnnouncement 
  } = useWorkspace();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncementForStats, setSelectedAnnouncementForStats] = useState<Announcement | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'urgent' | 'important' | 'normal'>('important');
  const [isPinned, setIsPinned] = useState(true);
  const [attachmentName, setAttachmentName] = useState('');

  if (!currentUser) return null;

  const isSuperAdminOrManager = currentUser.role === 'super_admin' || currentUser.role === 'dept_manager';

  const handleCreateSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    createAnnouncement(title, content, priority, 'all', undefined, true);
    setShowCreateModal(false);
    setTitle('');
    setContent('');
    setAttachmentName('');
  };

  const isUserAcknowledged = (item: Announcement, userId: string) => {
    if (item.acknowledgments && Array.isArray(item.acknowledgments)) {
      if (item.acknowledgments.some(a => a.userId === userId)) return true;
    }
    if (item.readByUserIds && Array.isArray(item.readByUserIds)) {
      if (item.readByUserIds.includes(userId)) return true;
    }
    return false;
  };

  const getReadCount = (item: Announcement) => {
    if (item.acknowledgments && Array.isArray(item.acknowledgments)) {
      return item.acknowledgments.length;
    }
    if (item.readByUserIds && Array.isArray(item.readByUserIds)) {
      return item.readByUserIds.length;
    }
    return 0;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto p-3 sm:p-6 select-none" id="announcements-management-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-lg bg-slate-900 text-white">
            <Megaphone className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">التعاميم والإعلانات الإدارية</h1>
            <p className="text-xs text-slate-500">القناة الرسمية لنشر القرارات والسياسات مع إثبات الاطلاع والقراءة</p>
          </div>
        </div>

        {isSuperAdminOrManager && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-transform active:scale-95 cursor-pointer"
            id="btn-publish-announcement"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>نشر تعميم رسمي جديد</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map(item => {
          const author = users.find(u => u.id === item.createdBy);
          const hasRead = isUserAcknowledged(item, currentUser.id);
          const readCount = getReadCount(item);
          const totalUsers = users.length;
          const readPercentage = totalUsers > 0 ? Math.round((readCount / totalUsers) * 100) : 0;
          const publishedDate = item.publishedAt || item.createdAt || 'اليوم';

          return (
            <div 
              key={item.id}
              className={`bg-white rounded-xl p-6 border transition-all shadow-xs ${
                item.isPinned ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
              }`}
            >
              {/* Top Meta */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {item.isPinned && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                      <Pin className="w-3 h-3 fill-current" />
                      <span>تعميم مثبت</span>
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                    item.priority === 'urgent' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {item.priority === 'urgent' ? '🔴 هام وعاجل جداً' : 'توجيه إداري'}
                  </span>
                </div>

                <span className="text-xs text-slate-400 font-mono">{publishedDate}</span>
              </div>

              {/* Title & Body */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                {item.title}
              </h2>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {item.content}
              </div>

              {/* Attachments */}
              {item.attachments && item.attachments.length > 0 && (
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">المرفقات الرسمية:</span>
                  <div className="flex flex-wrap gap-2">
                    {item.attachments.map(att => (
                      <div key={att.id} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs">
                        <Paperclip className="w-3.5 h-3.5 text-slate-700" />
                        <span className="font-semibold text-slate-900">{att.name}</span>
                        <span className="text-[10px] text-slate-400">({att.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer: Read status & Acknowledgement button */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Author info */}
                <div className="flex items-center gap-2">
                  <img src={author?.avatar} alt={author?.name} className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-200" />
                  <span className="font-semibold text-slate-700">صادر عن: {author?.name} ({author?.jobTitle})</span>
                </div>

                {/* Read receipts and Acknowledgement action */}
                <div className="flex items-center gap-3">
                  {/* Read statistics */}
                  <button
                    onClick={() => setSelectedAnnouncementForStats(item)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 cursor-pointer font-medium"
                  >
                    <Eye className="w-4 h-4 text-slate-700" />
                    <span className="font-semibold">قرأه {readCount} من {totalUsers} ({readPercentage}%)</span>
                  </button>

                  {/* Mark as read button */}
                  {!hasRead ? (
                    <button
                      onClick={() => acknowledgeAnnouncement(item.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
                    >
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span>تأكيد الاطلاع والقراءة ✓</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCheck className="w-4 h-4" />
                      <span>تم تأكيد اطلاعك على هذا التعميم</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Read Statistics Modal */}
      {selectedAnnouncementForStats && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-right">
            <h3 className="font-bold text-slate-900 text-base mb-1">تقرير قراءة التعميم</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedAnnouncementForStats.title}</p>

            <div className="space-y-2 max-h-72 overflow-y-auto text-xs pr-1">
              <h4 className="font-semibold text-slate-700">الموظفون الذين اطلعوا على التعميم:</h4>
              {users.map(u => {
                const isRead = isUserAcknowledged(selectedAnnouncementForStats, u.id);
                return (
                  <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-md object-cover" />
                      <div>
                        <span className="font-semibold text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400">{u.jobTitle}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                      isRead ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {isRead ? 'تم الاطلاع ✓' : 'لم يقرأ بعد ⏳'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncementForStats(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-right">
            <h3 className="font-bold text-slate-900 text-base mb-1">نشر تعميم إداري رسمي</h3>
            <p className="text-xs text-slate-500 mb-4">سيتم إشعار كافة موظفي شركة الدكتور وإلزامهم بتأكيد القراءة</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان التعميم:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: تعليمات الدوام وإطلاق الهوية الجديدة"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-slate-400 outline-none font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">نص التعميم والقرارات:</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب تفاصيل القرار الإداري والتعليمات بدقة..."
                  rows={4}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-slate-400 outline-none text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الأهمية:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  >
                    <option value="urgent">🔴 هام وعاجل</option>
                    <option value="important">🟠 عالي الأهمية</option>
                    <option value="normal">🔵 عادي</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>تثبيت في أعلى الشاشة 📌</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">مرفق رسمي (PDF / وثيقة):</label>
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && setAttachmentName(e.target.files[0].name)}
                  className="text-xs text-slate-500"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={!title.trim() || !content.trim()}
                className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm disabled:opacity-50"
              >
                نشر التعميم للجميع ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
