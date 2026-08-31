import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Users, 
  Megaphone, 
  Pin, 
  CheckCheck, 
  Check 
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Conversation, User } from '../../types';

export const ConversationList: React.FC = () => {
  const { 
    currentUser, 
    users, 
    conversations, 
    selectedConversationId, 
    setSelectedConversationId, 
    createConversation 
  } = useWorkspace();

  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'group' | 'announcement'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  if (!currentUser) return null;

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    // Filter by type
    if (activeFilter === 'direct' && c.type !== 'direct') return false;
    if (activeFilter === 'group' && (c.type !== 'group' && c.type !== 'department')) return false;
    if (activeFilter === 'announcement' && c.type !== 'announcement') return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (c.title || '').toLowerCase().includes(q);
      const matchLast = (c.lastMessage?.content || '').toLowerCase().includes(q);
      return matchTitle || matchLast;
    }

    return true;
  });

  const getConversationDetails = (conv: Conversation) => {
    if (conv.type === 'direct') {
      const otherId = conv.participantIds.find(id => id !== currentUser.id) || conv.participantIds[0];
      const otherUser = users.find(u => u.id === otherId);
      return {
        title: otherUser?.name || conv.title,
        jobTitle: otherUser?.jobTitle || '',
        avatar: otherUser?.avatar || conv.avatar,
        isOnline: otherUser?.isOnline || false
      };
    }
    return {
      title: conv.title,
      jobTitle: conv.type === 'department' ? 'مجموعة إدارة' : conv.type === 'announcement' ? 'توجيهات رسمية' : 'مجموعة عمل',
      avatar: conv.avatar,
      isOnline: false
    };
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 select-none" id="conversation-list-pane">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">المحادثات</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold">
              {conversations.length}
            </span>
          </div>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="p-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-transform active:scale-95 cursor-pointer shadow-xs"
            title="محادثة جديدة"
            id="btn-new-chat"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في المحادثات..."
            className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 outline-none text-slate-900"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'all' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveFilter('direct')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'direct' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            مباشر
          </button>
          <button
            onClick={() => setActiveFilter('group')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'group' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            مجموعات الإدارات
          </button>
          <button
            onClick={() => setActiveFilter('announcement')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'announcement' 
                ? 'bg-slate-900 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📢 الإعلانات
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            لا توجد محادثات مطابقة
          </div>
        ) : (
          filteredConversations.map(conv => {
            const isSelected = selectedConversationId === conv.id;
            const details = getConversationDetails(conv);
            const unreadCount = conv.unreadCounts[currentUser.id] || 0;
            const hasPinnedTasks = conv.pinnedTaskIds.length > 0;

            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                id={`conversation-item-${conv.id}`}
                className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-100 border-r-4 border-slate-900' 
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Avatar with online dot */}
                <div className="relative shrink-0">
                  {details.avatar ? (
                    <img 
                      src={details.avatar} 
                      alt={details.title} 
                      className="w-10 h-10 rounded-md object-cover ring-1 ring-slate-200" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                      {conv.type === 'announcement' ? <Megaphone className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                    </div>
                  )}
                  {details.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  )}
                </div>

                {/* Conversation Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`text-xs font-semibold truncate ${isSelected ? 'text-slate-900' : 'text-slate-900'}`}>
                        {details.title}
                      </span>
                      {hasPinnedTasks && (
                        <span title="توجد مهام مثبتة" className="text-emerald-600">
                          <Pin className="w-3 h-3 fill-current inline" />
                        </span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {conv.lastMessage.timestamp}
                      </span>
                    )}
                  </div>

                  {/* Job title & last message preview */}
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-500 truncate max-w-[160px] sm:max-w-[190px]">
                      {conv.lastMessage?.content || details.jobTitle}
                    </p>
                    {unreadCount > 0 && (
                      <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-slate-950 bg-emerald-400 rounded-full shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-base">بدء محادثة جديدة</h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-xs text-slate-500 mb-3">اختر موظفاً من فريق شركة الدكتور للتواصل معه:</p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {users.filter(u => u.id !== currentUser.id).map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    const newId = createConversation('direct', [u.id]);
                    setSelectedConversationId(newId);
                    setShowNewChatModal(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-md object-cover ring-1 ring-slate-200" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{u.jobTitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">{u.department}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
