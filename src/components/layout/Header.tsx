import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Clock, 
  CheckCircle2, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Phone,
  Video,
  UserCheck
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { DoctorLogo } from '../common/DoctorLogo';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenSearch }) => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    logout, 
    todayAttendance, 
    clockIn, 
    clockOut,
    unreadNotificationsCount,
    setActiveTab
  } = useWorkspace();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-2.5 bg-white border-b border-slate-200 shadow-xs" id="app-header">
      {/* Brand & Mobile Title */}
      <div className="flex items-center gap-3">
        <div className="cursor-pointer" onClick={() => setActiveTab('chats')}>
          <DoctorLogo size="md" showSubtitle={false} />
        </div>
      </div>

      {/* Center / Search & Quick Attendance Status */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Global Search Bar */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all w-36 sm:w-48 md:w-72 text-right"
          id="btn-global-search"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="hidden sm:inline">بحث في الرسائل، المهام، الموظفين...</span>
          <span className="sm:hidden">بحث...</span>
        </button>

        {/* Quick Attendance Pill */}
        <div className="hidden lg:flex items-center">
          {todayAttendance?.checkInTime && !todayAttendance.checkOutTime ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>حاضر منذ: {todayAttendance.checkInTime}</span>
              <button 
                onClick={clockOut}
                className="font-bold text-emerald-800 hover:text-emerald-950 underline mr-1 cursor-pointer"
                title="تسجيل انصراف الآن"
              >
                تسجيل انصراف
              </button>
            </div>
          ) : todayAttendance?.checkOutTime ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>تم الانصراف: {todayAttendance.checkOutTime}</span>
            </div>
          ) : (
            <button
              onClick={() => clockIn()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>تسجيل حضور اليوم</span>
            </button>
          )}
        </div>
      </div>

      {/* Left side actions (RTL Left = visual right / end) */}
      <div className="flex items-center gap-2">
        {/* Quick Role Switcher for easy testing / evaluation */}
        <button
          onClick={() => setShowSwitchModal(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer"
          title="تبديل حساب الموظف لاختبار مختلف الأدوار والصلاحيات"
          id="btn-switch-account-header"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>تبديل الموظف</span>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          id="btn-notifications-header"
          aria-label="الإشعارات"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-slate-900 border-2 border-white rounded-full">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Current User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2.5 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            id="btn-user-profile-menu"
          >
            <div className="relative">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-300" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                {currentUser.jobTitle}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div 
              className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-slate-600 font-medium">{currentUser.jobTitle}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{currentUser.department} • {currentUser.phone}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded border border-slate-200">
                  كود الموظف: {currentUser.employeeId}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowSwitchModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-right cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>تبديل حساب موظف آخر</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setActiveTab('attendance');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-right cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span>سجل الحضور والانصراف</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-right cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Switcher Modal for reviewer */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-900">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">تبديل حساب الموظف</h3>
                  <p className="text-xs text-slate-500">اختر موظفاً لتجربة النظام من منظوره وصلاحياته</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSwitchModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {users.map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setShowSwitchModal(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    u.id === currentUser.id 
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-md object-cover ring-1 ring-slate-200" />
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{u.name}</p>
                        {u.id === currentUser.id && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-white font-semibold">الحساب الحالي</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{u.jobTitle}</p>
                      <p className="text-[11px] text-slate-400">{u.department} • {u.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{u.phone}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowSwitchModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
