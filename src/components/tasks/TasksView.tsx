import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  Clock, 
  User as UserIcon, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Sparkles, 
  LayoutGrid, 
  List as ListIcon,
  MessageSquare,
  Pin
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { TaskDetailModal } from './TaskDetailModal';

export const TasksView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    tasks, 
    createStandaloneTask,
    setSelectedConversationId,
    setActiveTab
  } = useWorkspace();

  const [activeFilter, setActiveFilter] = useState<'all' | 'my_tasks' | 'awaiting_approval' | 'in_progress' | 'urgent' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [selectedModalTaskId, setSelectedModalTaskId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating standalone task
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState(users[2]?.id || users[0].id);
  const [newPriority, setNewPriority] = useState<TaskPriority>('urgent');
  const [newDeadline, setNewDeadline] = useState('اليوم 05:00 م');
  const [newRequireProof, setNewRequireProof] = useState(true);

  if (!currentUser) return null;

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'my_tasks' && !(t.assigneeIds || []).includes(currentUser.id)) return false;
    if (activeFilter === 'awaiting_approval' && t.status !== 'awaiting_approval') return false;
    if (activeFilter === 'in_progress' && t.status !== 'in_progress') return false;
    if (activeFilter === 'urgent' && t.priority !== 'urgent') return false;
    if (activeFilter === 'approved' && t.status !== 'approved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (t.title || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  const statusBadges: Record<TaskStatus, { label: string; bg: string; text: string }> = {
    new: { label: 'جديدة', bg: 'bg-blue-100', text: 'text-blue-800' },
    in_progress: { label: 'قيد التنفيذ ⏳', bg: 'bg-amber-100', text: 'text-amber-800' },
    awaiting_approval: { label: 'بانتظار الاعتماد 📋', bg: 'bg-[#efc1d4]', text: 'text-[#514088]' },
    approved: { label: 'معتمدة ✓', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    revision_required: { label: 'مطلوب تعديل ⚠️', bg: 'bg-rose-100', text: 'text-rose-800' },
    overdue: { label: 'متأخرة 🔴', bg: 'bg-red-100', text: 'text-red-800' },
    cancelled: { label: 'ملغاة', bg: 'bg-gray-100', text: 'text-gray-700' }
  };

  const handleCreateTaskSubmit = () => {
    if (!newTitle.trim()) return;
    createStandaloneTask(
      newTitle,
      newDesc,
      [newAssigneeId],
      newPriority,
      newDeadline,
      newRequireProof
    );
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto p-4 sm:p-6 select-none" id="tasks-management-view">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-900 text-white">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">إدارة ومتابعة المهام</h1>
              <p className="text-xs text-slate-500">متابعة تنفيذ مهام فريق شركة الدكتور ومراحل الاعتماد الإداري</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
              title="عرض الشبكة"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
              title="عرض القائمة"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
            id="btn-create-new-task"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Professional Polish Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">إجمالي المهام</div>
          <div className="text-2xl font-bold text-slate-900">{tasks.length}</div>
          <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
            <span>+{tasks.filter(t => t.status === 'approved').length} مكتملة ومعتمدة</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">بانتظار الاعتماد</div>
          <div className="text-2xl font-bold text-amber-600">{tasks.filter(t => t.status === 'awaiting_approval').length}</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">تتطلب مراجعة المشرف</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">المهام العاجلة</div>
          <div className="text-2xl font-bold text-rose-600">{tasks.filter(t => t.priority === 'urgent' && t.status !== 'approved').length}</div>
          <div className="text-xs font-semibold text-rose-600 mt-1">أولوية قصوى</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في عنوان أو وصف المهمة..."
              className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 outline-none text-slate-900"
            />
          </div>

          {/* Quick counts */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>المهام المعروضة: <strong className="text-slate-900">{filteredTasks.length}</strong></span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            جميع المهام ({tasks.length})
          </button>

          <button
            onClick={() => setActiveFilter('my_tasks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeFilter === 'my_tasks' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            مهامي المكلف بها ({tasks.filter(t => (t.assigneeIds || []).includes(currentUser.id)).length})
          </button>

          <button
            onClick={() => setActiveFilter('awaiting_approval')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeFilter === 'awaiting_approval' ? 'bg-slate-900 text-white' : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            بانتظار اعتماد المدير ({tasks.filter(t => t.status === 'awaiting_approval').length})
          </button>

          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeFilter === 'in_progress' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            قيد التنفيذ ({tasks.filter(t => t.status === 'in_progress').length})
          </button>

          <button
            onClick={() => setActiveFilter('urgent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeFilter === 'urgent' ? 'bg-slate-900 text-white' : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            عاجلة ({tasks.filter(t => t.priority === 'urgent').length})
          </button>

          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeFilter === 'approved' ? 'bg-slate-900 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            معتمدة ومكتملة ✓ ({tasks.filter(t => t.status === 'approved').length})
          </button>
        </div>
      </div>

      {/* Task Cards Grid or List */}
      {filteredTasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 text-center">
          <CheckSquare className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">لا توجد مهام مطابقة للفلتر المحدد</h3>
          <p className="text-xs text-slate-400 mt-1">يمكنك إنشاء مهمة جديدة أو تغيير معايير البحث.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => {
            const assignees = users.filter(u => (task.assigneeIds || []).includes(u.id));
            const badge = statusBadges[task.status] || statusBadges.new;

            return (
              <div
                key={task.id}
                onClick={() => setSelectedModalTaskId(task.id)}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Status & Priority */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      task.priority === 'urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {task.priority === 'urgent' ? 'عاجلة' : task.priority === 'high' ? 'عالية' : 'عادية'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                    {task.title}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Bottom Assignee & Deadline */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <img 
                      src={assignees[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                      alt={assignees[0]?.name || ''} 
                      className="w-6 h-6 rounded-md object-cover ring-1 ring-slate-200" 
                    />
                    <span className="text-[11px] font-semibold text-slate-800 truncate max-w-[100px]">
                      {assignees.map(a => a.name).join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{task.deadline || 'مفتوح'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {filteredTasks.map(task => {
            const assignees = users.filter(u => (task.assigneeIds || []).includes(u.id));
            const badge = statusBadges[task.status] || statusBadges.new;

            return (
              <div
                key={task.id}
                onClick={() => setSelectedModalTaskId(task.id)}
                className="p-3.5 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded text-[11px] font-semibold ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{task.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate max-w-sm">{task.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="font-semibold text-slate-700">{assignees.map(a => a.name).join(', ')}</span>
                  <span className="text-rose-600 font-medium">{task.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Details Modal */}
      {selectedModalTaskId && (
        <TaskDetailModal
          taskId={selectedModalTaskId}
          onClose={() => setSelectedModalTaskId(null)}
        />
      )}

      {/* Create Standalone Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-right">
            <h3 className="font-bold text-slate-900 text-base mb-1">إنشاء مهمة عمل جديدة</h3>
            <p className="text-xs text-slate-500 mb-4">تكليف أحد موظفي شركة الدكتور بمهمة عمل مع متابعة دورة التنفيذ</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان المهمة:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: مراجعة خطة التسويق للموسم الجديد"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-slate-400 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">تفاصيل ومطلوب المهمة:</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="اكتب التوجيهات والمخرجات المتوقعة بدقة..."
                  rows={3}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-slate-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">المكلف بالتنفيذ:</label>
                  <select
                    value={newAssigneeId}
                    onChange={(e) => setNewAssigneeId(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.jobTitle})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الأولوية:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="urgent">🔴 عاجلة جداً</option>
                    <option value="high">🟠 أولوية عالية</option>
                    <option value="medium">🔵 متوسطة</option>
                    <option value="low">⚪ عادية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">الموعد النهائي (Deadline):</label>
                <input
                  type="text"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  placeholder="مثال: غداً 02:00 م"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateTaskSubmit}
                disabled={!newTitle.trim()}
                className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-xs disabled:opacity-50"
              >
                إنشاء المهمة ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
