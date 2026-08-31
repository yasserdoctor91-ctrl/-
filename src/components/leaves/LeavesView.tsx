import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Paperclip,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { LeaveRequest } from '../../types';

export const LeavesView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    leaveRequests, 
    submitLeaveRequest, 
    decideLeaveRequest 
  } = useWorkspace();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Form inputs
  const [leaveType, setLeaveType] = useState<'annual' | 'sick' | 'emergency' | 'unpaid'>('annual');
  const [startDate, setStartDate] = useState('2026-09-05');
  const [endDate, setEndDate] = useState('2026-09-08');
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  if (!currentUser) return null;

  const isManager = currentUser.role === 'super_admin' || currentUser.role === 'dept_manager' || currentUser.role === 'supervisor';

  const handleCreateSubmit = () => {
    if (!reason.trim()) return;
    submitLeaveRequest(leaveType, startDate, endDate, reason, attachmentName);
    setShowRequestModal(false);
    setReason('');
    setAttachmentName('');
  };

  const statusBadges: Record<LeaveRequest['status'], { label: string; bg: string; text: string }> = {
    pending: { label: 'قيد المراجعة والاعتماد ⏳', bg: 'bg-amber-100', text: 'text-amber-800' },
    approved: { label: 'تمت الموافقة ✓', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    rejected: { label: 'مرفوض ✕', bg: 'bg-rose-100', text: 'text-rose-800' }
  };

  const typeNames = {
    annual: 'إجازة سنوية',
    sick: 'إجازة مرضية',
    emergency: 'إجازة طارئة',
    unpaid: 'إجازة بدون راتب'
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto p-3 sm:p-6 select-none" id="leaves-management-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-lg bg-slate-900 text-white">
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">إدارة طلبات الإجازات</h1>
            <p className="text-xs text-slate-500">تقديم ومتابعة طلبات الإجازات واعتمادها من الإدارة</p>
          </div>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-transform active:scale-95 cursor-pointer"
          id="btn-request-leave"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>تقديم طلب إجازة جديد</span>
        </button>
      </div>

      {/* Leaves List */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          {isManager ? 'سجل طلبات الإجازات لشركة الدكتور' : 'طلبات الإجازة الخاصة بي'}
        </h3>

        {leaveRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            لا توجد طلبات إجازة مسجلة حالياً
          </div>
        ) : (
          <div className="space-y-3">
            {leaveRequests.map(req => {
              const user = users.find(u => u.id === req.userId);
              const badge = statusBadges[req.status];
              const isOwner = req.userId === currentUser.id;

              return (
                <div 
                  key={req.id} 
                  className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                        alt={user?.name || ''} 
                        className="w-9 h-9 rounded-md object-cover ring-1 ring-slate-200" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{user?.name}</span>
                          <span className="text-[10px] text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-semibold">
                            {user?.jobTitle}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{user?.department}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">نوع الإجازة:</span>
                        <span className="font-semibold text-slate-900">{typeNames[req.leaveType]}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">الفترة:</span>
                        <span className="font-semibold text-slate-800">{req.startDate} إلى {req.endDate} ({req.daysCount} أيام)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">تاريخ التقديم:</span>
                        <span className="text-slate-500 font-mono">{req.createdAt.substring(0, 10)}</span>
                      </div>
                    </div>

                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong className="text-slate-900">السبب: </strong>{req.reason}
                    </p>

                    {req.rejectionReason && (
                      <p className="text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                        <strong>سبب الرفض: </strong>{req.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 shrink-0">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>

                    {/* Manager Approval Actions */}
                    {isManager && req.status === 'pending' && !isOwner && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decideLeaveRequest(req.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          موافقة ✓
                        </button>
                        <button
                          onClick={() => setShowRejectModal(req.id)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          رفض
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Leave Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-right">
            <h3 className="font-bold text-slate-900 text-base mb-1">تقديم طلب إجازة</h3>
            <p className="text-xs text-slate-500 mb-4">سيتم إرسال الطلب لمديرك المباشر للمراجعة والاعتماد</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">نوع الإجازة:</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-900"
                >
                  <option value="annual">🏖️ إجازة سنوية</option>
                  <option value="sick">🩺 إجازة مرضية</option>
                  <option value="emergency">⚡ إجازة طارئة</option>
                  <option value="unpaid">📄 إجازة بدون راتب</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">تاريخ البدء:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">تاريخ النهاية:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">سبب الإجازة:</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="اكتب سبب طلب الإجازة بالتفصيل..."
                  rows={3}
                  className="w-full p-2.5 border border-slate-200 rounded-lg outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">إرفاق مستند (تقرير طبي / إثبات):</label>
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && setAttachmentName(e.target.files[0].name)}
                  className="text-xs text-slate-500"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={!reason.trim()}
                className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm disabled:opacity-50"
              >
                إرسال الطلب ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 text-right">
            <h3 className="font-bold text-rose-700 text-base mb-1">رفض طلب الإجازة</h3>
            <p className="text-xs text-slate-500 mb-3">اكتب سبب الرفض لتوضيحه للموظف:</p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="مثال: تعارض الموعد مع إطلاق الحملة الرئيسية..."
              rows={3}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none text-slate-900"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  decideLeaveRequest(showRejectModal, 'rejected', rejectionReason);
                  setShowRejectModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-lg"
              >
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
