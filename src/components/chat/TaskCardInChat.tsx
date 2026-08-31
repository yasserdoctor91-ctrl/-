import React, { useState } from 'react';
import { 
  Pin, 
  Clock, 
  User as UserIcon, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  FileCheck, 
  ArrowUpRight,
  Sparkles,
  RotateCcw,
  Paperclip
} from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';

interface TaskCardInChatProps {
  task: Task;
  onOpenDetails: (taskId: string) => void;
}

export const TaskCardInChat: React.FC<TaskCardInChatProps> = ({ task, onOpenDetails }) => {
  const { 
    currentUser, 
    users, 
    startTask, 
    completeTaskWithProof, 
    approveTask, 
    requestTaskRevision 
  } = useWorkspace();

  const [showProofModal, setShowProofModal] = useState(false);
  const [proofText, setProofText] = useState('');
  const [proofFileName, setProofFileName] = useState('');

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');

  if (!currentUser) return null;

  const assignees = users.filter(u => (task.assigneeIds || []).includes(u.id));
  const isAssignee = (task.assigneeIds || []).includes(currentUser.id);
  const isManagerOrCreator = currentUser.id === task.createdBy || currentUser.role === 'super_admin' || currentUser.role === 'dept_manager';

  const statusConfig: Record<TaskStatus, { label: string; bg: string; text: string; border: string }> = {
    new: { label: 'جديدة', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    in_progress: { label: 'قيد التنفيذ', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    awaiting_approval: { label: 'بانتظار اعتماد المدير', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    approved: { label: 'معتمدة ومكتملة ✓', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    revision_required: { label: 'مطلوب تعديل ⚠️', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    overdue: { label: 'متأخرة 🔴', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    cancelled: { label: 'ملغاة', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' }
  };

  const currentStatus = statusConfig[task.status] || statusConfig.new;

  const priorityBadge = {
    urgent: { label: 'عاجلة جداً', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    high: { label: 'أولوية عالية', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    medium: { label: 'متوسطة', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    low: { label: 'منخفضة', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  }[task.priority];

  return (
    <div 
      className="my-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all overflow-hidden max-w-lg w-full text-right"
      id={`task-card-${task.id}`}
    >
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-slate-800 text-emerald-400">
            <Pin className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold">مهمة عمل مرتبطة بالمحادثة</span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${priorityBadge.color}`}>
          {priorityBadge.label}
        </span>
      </div>

      {/* Card Content Body */}
      <div className="p-4 space-y-3 bg-slate-50/50">
        {/* Title */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 leading-snug">
            {task.title}
          </h4>
        </div>

        {/* Required details */}
        <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 block">المطلوب تنفيذه:</span>
          <p className="leading-relaxed whitespace-pre-wrap">{task.description}</p>
        </div>

        {/* Metadata info grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Assignees */}
          <div className="flex items-center gap-1.5 text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
            <UserIcon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block">المسؤول:</span>
              <span className="font-semibold text-slate-900">
                {assignees.map(a => a.name).join(', ') || 'غير محدد'}
              </span>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block">الموعد النهائي:</span>
              <span className="font-semibold text-rose-600">{task.deadline || 'غير محدد'}</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium">حالة المهمة:</span>
          <span className={`px-2.5 py-0.5 rounded-md font-semibold border text-[11px] ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
            {currentStatus.label}
          </span>
        </div>

        {/* Revision feedback note if exists */}
        {task.status === 'revision_required' && task.revision && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
            <div className="flex items-center gap-1 font-bold mb-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>ملاحظات المدير للتعديل:</span>
            </div>
            <p className="text-[11px] leading-relaxed">{task.revision.reason}</p>
          </div>
        )}

        {/* Proof of completion if submitted */}
        {task.proof && (
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-900">
            <div className="flex items-center gap-1 font-bold mb-0.5 text-emerald-800">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>إثبات الإنجاز المرفوع:</span>
            </div>
            <p className="text-[11px] text-slate-700">{task.proof.text}</p>
            {task.proof.fileName && (
              <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-emerald-800 bg-white p-1 rounded-md border border-emerald-200">
                <Paperclip className="w-3 h-3" />
                <span>{task.proof.fileName}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons Zone */}
        <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {/* Step 1: Start Task */}
            {isAssignee && (task.status === 'new' || task.status === 'revision_required') && (
              <button
                onClick={() => startTask(task.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
                id={`btn-start-task-${task.id}`}
              >
                <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                <span>بدء المهمة</span>
              </button>
            )}

            {/* Step 2: Complete Task with Proof */}
            {isAssignee && task.status === 'in_progress' && (
              <button
                onClick={() => setShowProofModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
                id={`btn-complete-task-${task.id}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تمت المهمة ✓</span>
              </button>
            )}

            {/* Step 3: Manager Approval & Revision */}
            {isManagerOrCreator && task.status === 'awaiting_approval' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => approveTask(task.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
                  id={`btn-approve-task-${task.id}`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>اعتماد المهمة ✓</span>
                </button>
                <button
                  onClick={() => setShowRevisionModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  id={`btn-reject-task-${task.id}`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>طلب تعديل</span>
                </button>
              </div>
            )}
          </div>

          {/* Open full modal / timeline */}
          <button
            onClick={() => onOpenDetails(task.id)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-emerald-700 underline cursor-pointer"
          >
            <span>التفاصيل والجدول</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Proof Submission Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 text-right">
            <h3 className="font-bold text-slate-900 text-base mb-1">تقديم إثبات إكمال المهمة</h3>
            <p className="text-xs text-slate-500 mb-3">
              لن يتم اعتبار المهمة معتمدة إلا بعد مراجعة مديرك لإثبات الإنجاز.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">تفاصيل العمل المنجز / التعليق:</label>
                <textarea
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  placeholder="اكتب وصفاً لما تم تنفيذه والنتائج..."
                  rows={3}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:border-slate-400 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">إرفاق ملف / تصميم / مستند (إثبات الإنجاز):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id={`file-proof-${task.id}`}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProofFileName(e.target.files[0].name);
                      }
                    }}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                  />
                </div>
                {proofFileName && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">الملف المحدد: {proofFileName}</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowProofModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  completeTaskWithProof(task.id, proofText, proofFileName || 'Doctor_Design_Proof.pdf');
                  setShowProofModal(false);
                }}
                className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer"
              >
                إرسال للاعتماد ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 text-right">
            <h3 className="font-bold text-rose-700 text-base mb-1">طلب تعديل على المهمة</h3>
            <p className="text-xs text-slate-500 mb-3">
              حدد بدقة التعديلات المطلوبة من الموظف قبل إعادة إرسالها للاعتماد.
            </p>

            <textarea
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              placeholder="مثال: يرجى مراجعة المواصفات واعتماد الألوان المحددة..."
              rows={4}
              className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:border-rose-400 outline-none text-slate-900"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (revisionReason.trim()) {
                    requestTaskRevision(task.id, revisionReason);
                    setShowRevisionModal(false);
                  }
                }}
                disabled={!revisionReason.trim()}
                className="px-5 py-2 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 rounded-lg shadow-xs cursor-pointer"
              >
                إرسال طلب التعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
