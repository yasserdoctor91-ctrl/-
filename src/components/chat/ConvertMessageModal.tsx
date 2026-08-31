import React, { useState, useEffect } from 'react';
import { 
  Pin, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  AlertCircle, 
  Repeat, 
  ShieldCheck,
  X 
} from 'lucide-react';
import { Message, TaskPriority } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';

interface ConvertMessageModalProps {
  message: Message;
  onClose: () => void;
}

export const ConvertMessageModal: React.FC<ConvertMessageModalProps> = ({ message, onClose }) => {
  const { 
    currentUser, 
    users, 
    conversations, 
    convertMessageToTask 
  } = useWorkspace();

  const conv = conversations.find(c => c.id === message.conversationId);
  const otherParticipants = conv ? conv.participantIds.filter(id => id !== currentUser?.id) : [];
  const defaultAssigneeId = otherParticipants[0] || (users.find(u => u.id === 'u-3')?.id || users[0].id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(message.content);
  const [assigneeId, setAssigneeId] = useState(defaultAssigneeId);
  const [priority, setPriority] = useState<TaskPriority>('urgent');
  const [deadline, setDeadline] = useState('اليوم 05:00 م');
  const [requireProof, setRequireProof] = useState(true);
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');

  useEffect(() => {
    // Generate intelligent default title from message
    if (message.content) {
      const cleanTitle = message.content.length > 40 
        ? message.content.substring(0, 38) + '...' 
        : message.content;
      setTitle(cleanTitle);
    } else {
      setTitle('مهمة جديدة من المحادثة');
    }
  }, [message.content]);

  const handleCreate = () => {
    if (!title.trim()) return;

    convertMessageToTask(
      message.id,
      title,
      description,
      [assigneeId],
      priority,
      deadline,
      requireProof,
      recurring
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#d4c9d4]/60 text-right animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#514088] text-white">
              <Pin className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#514088] text-base">تحويل الرسالة إلى مهمة عمل 📌</h3>
              <p className="text-xs text-gray-500">سيتم تثبيت المهمة داخل المحادثة ومتابعة دورة تنفيذها</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">عنوان المهمة:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تصميم بوست العرض الجديد لشركة الدكتور"
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#514088] focus:bg-white outline-none font-bold text-[#514088]"
            />
          </div>

          {/* Description (Pre-filled from message) */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">المطلوب تنفيذه (من نص الرسالة):</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#514088] focus:bg-white outline-none leading-relaxed"
            />
          </div>

          {/* Assignee Selection */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">الموظف المسؤول عن التنفيذ:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {users.map(u => (
                <div
                  key={u.id}
                  onClick={() => setAssigneeId(u.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                    assigneeId === u.id 
                      ? 'border-[#514088] bg-[#d1c6f0]/30 font-bold text-[#514088]' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                  <div className="truncate text-right">
                    <p className="text-[11px] truncate">{u.name}</p>
                    <p className="text-[9px] text-gray-500 truncate">{u.jobTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority & Deadline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Priority */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">الأولوية:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#514088] outline-none font-semibold text-gray-800"
              >
                <option value="urgent">🔴 عاجلة جداً</option>
                <option value="high">🟠 أولوية عالية</option>
                <option value="medium">🔵 أولوية متوسطة</option>
                <option value="low">⚪ أولوية عادية</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">الموعد النهائي (Deadline):</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="اليوم 05:00 م أو 2026-09-02"
                className="w-full p-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#514088] outline-none font-semibold text-gray-800"
              />
            </div>
          </div>

          {/* Options: Require Proof & Recurring */}
          <div className="p-3 bg-[#f9f9f9] rounded-2xl border border-gray-200 space-y-2.5">
            {/* Require Proof */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#514088]" />
                <span className="font-bold text-gray-800">اشتراط إرفاق إثبات الإنجاز (Proof)</span>
              </div>
              <input
                type="checkbox"
                checked={requireProof}
                onChange={(e) => setRequireProof(e.target.checked)}
                className="w-4 h-4 text-[#514088] rounded-md focus:ring-[#514088] cursor-pointer"
              />
            </label>

            {/* Recurring */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#514088]" />
                <span className="font-semibold text-gray-700">تكرار المهمة:</span>
              </div>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as 'none' | 'daily' | 'weekly' | 'monthly')}
                className="text-[11px] p-1.5 bg-white border border-gray-300 rounded-lg outline-none"
              >
                <option value="none">بدون تكرار (مرة واحدة)</option>
                <option value="daily">يومية (Daily)</option>
                <option value="weekly">أسبوعية (Weekly)</option>
                <option value="monthly">شهرية (Monthly)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-[#514088] hover:bg-[#433470] text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            id="btn-confirm-convert-task"
          >
            <Pin className="w-4 h-4 fill-current" />
            <span>إنشاء وتثبيت المهمة 📌</span>
          </button>
        </div>
      </div>
    </div>
  );
};
