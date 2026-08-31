import React from 'react';
import { 
  X, 
  User as UserIcon, 
  Shield, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  Check,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, users, setCurrentUser } = useWorkspace();

  if (!currentUser) return null;

  const roleLabels = {
    super_admin: 'المدير العام (Super Admin)',
    dept_manager: 'مدير قسم (Department Manager)',
    supervisor: 'مشرف (Supervisor)',
    employee: 'موظف (Employee)'
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div 
        className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-right animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">الملف التعريفي وتبديل الموظف</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Card */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6 flex items-center gap-4">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-200 shadow-xs" 
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-bold text-slate-900 text-base truncate">{currentUser.name}</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {roleLabels[currentUser.role]}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700">{currentUser.jobTitle}</p>
            <p className="text-[11px] text-slate-500">{currentUser.department} • شركة الدكتور</p>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <Mail className="w-4 h-4 text-slate-600" />
            <div>
              <span className="text-slate-400 block text-[10px]">البريد الإلكتروني:</span>
              <span className="font-mono font-medium text-slate-800">{currentUser.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <Phone className="w-4 h-4 text-slate-600" />
            <div>
              <span className="text-slate-400 block text-[10px]">رقم الهاتف:</span>
              <span className="font-mono font-medium text-slate-800" dir="ltr">{currentUser.phone}</span>
            </div>
          </div>
        </div>

        {/* Switch User Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-slate-700" />
              <h4 className="font-semibold text-slate-900 text-sm">تبديل الحساب (لتجربة الصلاحيات وتدفق المهام):</h4>
            </div>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {users.map(u => {
              const isSelected = u.id === currentUser.id;
              return (
                <div
                  key={u.id}
                  onClick={() => {
                    setCurrentUser(u);
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[11px] text-slate-500">{u.jobTitle} • {roleLabels[u.role]}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md">
                      <Check className="w-3.5 h-3.5" />
                      <span>الحساب الحالي</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
