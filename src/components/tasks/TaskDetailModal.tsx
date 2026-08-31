import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  User as UserIcon, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  MessageSquare, 
  Paperclip, 
  AlertCircle,
  FileCheck,
  Send
} from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';

interface TaskDetailModalProps {
  taskId: string;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, onClose }) => {
  const { 
    currentUser, 
    users, 
    tasks, 
    startTask, 
    completeTaskWithProof, 
    approveTask, 
    requestTaskRevision,
    addTaskComment 
  } = useWorkspace();

  const task = tasks.find(t => t.id === taskId);

  const [newComment, setNewComment] = useState('');
  const [showProofForm, setShowProofForm] = useState(false);
  const [proofText, setProofText] = useState('');
  const [proofFileName, setProofFileName] = useState('');

  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');

  if (!task || !currentUser) return null;

  const creator = users.find(u => u.id === task.createdBy);
  const assignees = users.filter(u => (task.assigneeIds || []).includes(u.id));
  const isAssignee = (task.assigneeIds || []).includes(currentUser.id);
  const isManagerOrCreator = currentUser.id === task.createdBy || currentUser.role === 'super_admin' || currentUser.role === 'dept_manager';

  const statusConfig: Record<TaskStatus, { label: string; bg: string }> = {
    new: { label: 'جديدة', bg: 'bg-blue-50 text-blue-700 border border-blue-200' },
    in_progress: { label: 'قيد التنفيذ ⏳', bg: 'bg-amber-50 text-amber-700 border border-amber-200' },
    awaiting_approval: { label: 'بانتظار اعتماد المدير 📋', bg: 'bg-slate-100 text-slate-800 border border-slate-300' },
    approved: { label: 'معتمدة ومكتملة ✓', bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    revision_required: { label: 'مطلوب تعديل ⚠️', bg: 'bg-rose-50 text-rose-700 border border-rose-200' },
    overdue: { label: 'متأخرة 🔴', bg: 'bg-red-50 text-red-700 border border-red-200' },
    cancelled: { label: 'ملغاة', bg: 'bg-slate-100 text-slate-600 border border-slate-200' }
  };

  const currentStatus = statusConfig[task.status] || statusConfig.new;

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    addTaskComment(task.id, newComment);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 text-right max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${currentStatus.bg}`}>
              {currentStatus.label}
            </span>
            <span className="text-xs text-slate-400 font-mono">#{task.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs">
          {/* Title & Description */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">
              {task.title}
            </h2>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">المطلوب تنفيذه:</span>
              <p className="text-slate-800 leading-relaxed text-sm whitespace-pre-wrap">{task.description}</p>
            </div>
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Created By */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block mb-1">أنشئت بواسطة:</span>
              <span className="font-semibold text-slate-900">{creator?.name || 'المدير'}</span>
              <span className="text-[10px] text-slate-500 block">{creator?.jobTitle}</span>
            </div>

            {/* Assignees */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block mb-1">المكلف بالتنفيذ:</span>
              <span className="font-semibold text-slate-900">{assignees.map(a => a.name).join(', ')}</span>
              <span className="text-[10px] text-slate-500 block">{assignees[0]?.jobTitle}</span>
            </div>

            {/* Deadline */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block mb-1">الموعد النهائي (Deadline):</span>
              <span className="font-semibold text-rose-600">{task.deadline || 'مفتوح'}</span>
              <span className="text-[10px] text-slate-400 block">
                {task.recurring && task.recurring !== 'none' ? `تكرار: ${task.recurring}` : 'مرة واحدة'}
              </span>
            </div>
          </div>

          {/* Proof Section (If submitted or in progress) */}
          {task.proof && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>إثبات الإنجاز المرفوع للاعتماد</span>
                <span className="text-[10px] text-slate-500 font-normal mr-auto">{task.proof.submittedAt}</span>
              </div>
              <p className="text-slate-700">{task.proof.text}</p>
              {task.proof.fileName && (
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
                  <Paperclip className="w-4 h-4 text-slate-700" />
                  <span className="font-mono text-slate-800 text-xs">{task.proof.fileName}</span>
                </div>
              )}
            </div>
          )}

          {/* Revision Section (If requested) */}
          {task.status === 'revision_required' && task.revision && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-1 text-rose-800">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>ملاحظات المدير للتعديل:</span>
                <span className="text-[10px] text-slate-500 font-normal mr-auto">{task.revision.requestedAt}</span>
              </div>
              <p className="text-sm">{task.revision.reason}</p>
            </div>
          )}

          {/* Proof submission form */}
          {showProofForm && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
              <h4 className="font-semibold text-emerald-900 text-sm">رفع إثبات إنجاز المهمة</h4>
              <textarea
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                placeholder="اكتب تفاصيل العمل المنجز والملاحظات..."
                rows={2}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-400"
              />
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && setProofFileName(e.target.files[0].name)}
                className="text-xs text-slate-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowProofForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    completeTaskWithProof(task.id, proofText, proofFileName || 'Doctor_Proof_File.pdf');
                    setShowProofForm(false);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                >
                  إرسال للاعتماد ✓
                </button>
              </div>
            </div>
          )}

          {/* Revision Form */}
          {showRevisionForm && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-3">
              <h4 className="font-semibold text-rose-800 text-sm">طلب تعديل على المهمة</h4>
              <textarea
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                placeholder="حدد التعديل المطلوب بدقة..."
                rows={2}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-slate-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRevisionForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    if (revisionReason.trim()) {
                      requestTaskRevision(task.id, revisionReason);
                      setShowRevisionForm(false);
                    }
                  }}
                  disabled={!revisionReason.trim()}
                  className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
                >
                  إرسال التعديل
                </button>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">الجدول الزمني للنشاط (Activity Timeline)</h4>
            <div className="space-y-3 border-r-2 border-slate-200 pr-4 mr-2">
              {task.timeline.map((item, idx) => {
                const user = users.find(u => u.id === item.userId);
                return (
                  <div key={idx} className="relative">
                    <span className="absolute -right-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 ring-4 ring-white"></span>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{item.description}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                    {user && <span className="text-[10px] text-slate-500">بواسطة: {user.name}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Comments */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-2">النقاش والتعليقات على المهمة</h4>
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {task.comments.length === 0 ? (
                <p className="text-slate-400 italic">لا توجد تعليقات حتى الآن</p>
              ) : (
                task.comments.map(c => {
                  const u = users.find(user => user.id === c.userId);
                  return (
                    <div key={c.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900">{u?.name || 'موظف'}</span>
                        <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-700">{c.text}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="أضف تعليقاً أو استفساراً حول المهمة..."
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 outline-none text-slate-900"
              />
              <button
                onClick={handleSendComment}
                className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <Send className="w-4 h-4 rotate-180 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Start Task */}
            {isAssignee && (task.status === 'new' || task.status === 'revision_required') && (
              <button
                onClick={() => startTask(task.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-semibold shadow-sm cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-emerald-400" />
                <span>بدء المهمة</span>
              </button>
            )}

            {/* Complete Task with Proof */}
            {isAssignee && task.status === 'in_progress' && (
              <button
                onClick={() => setShowProofForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تمت المهمة ✓</span>
              </button>
            )}

            {/* Manager Approval */}
            {isManagerOrCreator && task.status === 'awaiting_approval' && (
              <>
                <button
                  onClick={() => approveTask(task.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>اعتماد المهمة ✓</span>
                </button>
                <button
                  onClick={() => setShowRevisionForm(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>طلب تعديل</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
