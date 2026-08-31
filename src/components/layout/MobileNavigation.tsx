import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckSquare, 
  Clock, 
  LayoutDashboard, 
  Menu, 
  Calendar, 
  FileText, 
  Users, 
  Megaphone, 
  BarChart3, 
  ShieldCheck, 
  X 
} from 'lucide-react';
import { useWorkspace, NavigationTab } from '../../context/WorkspaceContext';

export const MobileNavigation: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    conversations, 
    tasks 
  } = useWorkspace();

  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  if (!currentUser) return null;

  const totalUnreadChats = conversations.reduce((acc, c) => acc + (c.unreadCounts?.[currentUser.id] || 0), 0);
  
  const pendingTasksCount = currentUser.role === 'super_admin' || currentUser.role === 'dept_manager'
    ? tasks.filter(t => t.status === 'awaiting_approval').length
    : tasks.filter(t => (t.assigneeIds || []).includes(currentUser.id) && (t.status === 'new' || t.status === 'in_progress')).length;

  const isMoreActive = ['leaves', 'meetings', 'announcements', 'directory', 'reports', 'admin'].includes(activeTab);

  return (
    <>
      {/* Bottom Floating/Docked Navigation Bar */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-md"
        id="mobile-bottom-nav"
      >
        <div className="flex items-center justify-around">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'dashboard' ? 'text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">الرئيسية</span>
          </button>

          {/* Chats */}
          <button
            onClick={() => setActiveTab('chats')}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'chats' ? 'text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <div className="relative">
              <MessageSquare className={`w-5 h-5 ${activeTab === 'chats' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {totalUnreadChats > 0 && (
                <span className="absolute -top-1 -right-2.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-slate-900 rounded-full">
                  {totalUnreadChats}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">المحادثات</span>
          </button>

          {/* Tasks */}
          <button
            onClick={() => setActiveTab('tasks')}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'tasks' ? 'text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <div className="relative">
              <CheckSquare className={`w-5 h-5 ${activeTab === 'tasks' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {pendingTasksCount > 0 && (
                <span className="absolute -top-1 -right-2.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-slate-950 bg-emerald-400 rounded-full">
                  {pendingTasksCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">المهام</span>
          </button>

          {/* Attendance */}
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'attendance' ? 'text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <Clock className={`w-5 h-5 ${activeTab === 'attendance' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">الحضور</span>
          </button>

          {/* More Drawer Trigger */}
          <button
            onClick={() => setShowMoreDrawer(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isMoreActive ? 'text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <Menu className={`w-5 h-5 ${isMoreActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">المزيد</span>
          </button>
        </div>
      </nav>

      {/* More Services Bottom Sheet */}
      {showMoreDrawer && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex flex-col justify-end">
          <div 
            className="bg-white rounded-t-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 border-t border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-slate-900 rounded-full"></span>
                <h3 className="font-bold text-slate-900 text-base">خدمات شركة الدكتور</h3>
              </div>
              <button 
                onClick={() => setShowMoreDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-6">
              <button
                onClick={() => { setActiveTab('leaves'); setShowMoreDrawer(false); }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-right hover:border-slate-400"
              >
                <div className="p-2 rounded-lg bg-slate-200 text-slate-900">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">الإجازات</p>
                  <p className="text-[10px] text-slate-500">تقديم ومتابعة</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('meetings'); setShowMoreDrawer(false); }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-right hover:border-slate-400"
              >
                <div className="p-2 rounded-lg bg-slate-200 text-slate-900">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">الاجتماعات</p>
                  <p className="text-[10px] text-slate-500">مرئية ومجدولة</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('announcements'); setShowMoreDrawer(false); }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-right hover:border-slate-400"
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">تعليمات الإدارة</p>
                  <p className="text-[10px] text-slate-500">توجيهات رسمية</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('directory'); setShowMoreDrawer(false); }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-right hover:border-slate-400"
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">دليل الموظفين</p>
                  <p className="text-[10px] text-slate-500">100 موظف</p>
                </div>
              </button>

              <button
                onClick={() => { setActiveTab('reports'); setShowMoreDrawer(false); }}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-right hover:border-slate-400"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">التقارير والأداء</p>
                  <p className="text-[10px] text-slate-500">مؤشرات المهام</p>
                </div>
              </button>

              {(currentUser.role === 'super_admin' || currentUser.role === 'admin') && (
                <button
                  onClick={() => { setActiveTab('admin'); setShowMoreDrawer(false); }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 text-white text-right"
                >
                  <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">لوحة التحكم</p>
                    <p className="text-[10px] text-slate-300">إدارة النظام</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
