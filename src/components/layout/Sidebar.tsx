import React from 'react';
import { 
  MessageSquare, 
  CheckSquare, 
  Clock, 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  Megaphone,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { useWorkspace, NavigationTab } from '../../context/WorkspaceContext';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    conversations, 
    tasks, 
    logout 
  } = useWorkspace();

  if (!currentUser) return null;

  // Calculate badge counts
  const totalUnreadChats = conversations.reduce((acc, c) => acc + (c.unreadCounts?.[currentUser.id] || 0), 0);
  
  // Pending tasks for manager (awaiting approval) or for employee (in progress)
  const pendingTasksCount = currentUser.role === 'super_admin' || currentUser.role === 'dept_manager'
    ? tasks.filter(t => t.status === 'awaiting_approval').length
    : tasks.filter(t => (t.assigneeIds || []).includes(currentUser.id) && (t.status === 'new' || t.status === 'in_progress' || t.status === 'revision_required')).length;

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'chats', label: 'المحادثات', icon: MessageSquare, badge: totalUnreadChats },
    { id: 'tasks', label: 'المهام', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'attendance', label: 'الحضور والانصراف', icon: Clock },
    { id: 'leaves', label: 'الإجازات', icon: FileText },
    { id: 'meetings', label: 'الاجتماعات', icon: Calendar },
    { id: 'announcements', label: 'تعليمات الإدارة', icon: Megaphone },
    { id: 'directory', label: 'دليل الموظفين', icon: Users },
    { id: 'reports', label: 'التقارير والأداء', icon: BarChart3 },
    { id: 'admin', label: 'لوحة التحكم', icon: ShieldCheck, adminOnly: true }
  ];

  return (
    <aside 
      className="hidden md:flex flex-col justify-between w-64 bg-white border-l border-slate-200 h-full select-none" 
      id="app-sidebar"
    >
      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          مساحة العمل
        </div>

        {navItems.map(item => {
          if (item.adminOnly && currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
            return null;
          }

          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              id={`nav-item-${item.id}`}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span 
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                    isActive 
                      ? 'bg-emerald-500 text-slate-950 font-extrabold' 
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Profile Summary */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-md object-cover ring-1 ring-slate-200" 
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex flex-col text-right overflow-hidden">
              <span className="text-xs font-bold text-slate-900 truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium truncate">
                {currentUser.jobTitle}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
