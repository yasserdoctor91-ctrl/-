import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Pin, 
  Check, 
  CheckCheck, 
  Calendar, 
  Sparkles, 
  Search, 
  AlertCircle,
  FileText,
  Clock,
  ArrowLeft,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Message, Conversation, User } from '../../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { TaskCardInChat } from './TaskCardInChat';
import { MessageComposer } from './MessageComposer';
import { ConvertMessageModal } from './ConvertMessageModal';

interface ChatWindowProps {
  onOpenTaskDetails: (taskId: string) => void;
  onBackMobile?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onOpenTaskDetails, onBackMobile }) => {
  const { 
    currentUser, 
    users, 
    conversations, 
    messages, 
    tasks, 
    selectedConversationId, 
    sendMessage, 
    markConversationAsRead, 
    pinMessage, 
    startCall, 
    joinMeetingRoom,
    meetings
  } = useWorkspace();

  const [convertingMessage, setConvertingMessage] = useState<Message | null>(null);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === selectedConversationId);

  // Auto scroll to bottom & mark read
  useEffect(() => {
    if (selectedConversationId) {
      markConversationAsRead(selectedConversationId);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversationId, messages.length, markConversationAsRead]);

  if (!currentUser || !activeConv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#f8fafc] text-center">
        <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
          <Sparkles className="w-7 h-7 text-emerald-500" />
        </div>
        <h3 className="font-bold text-slate-900 text-base mb-1">مرحباً بك في مساحة عمل الدكتور</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          اختر محادثة من القائمة للبدء في التواصل، أو إرسال المهام، أو إجراء المكالمات الفورية.
        </p>
      </div>
    );
  }

  // Get active participant info
  const isDirect = activeConv.type === 'direct';
  const otherUserId = isDirect ? (activeConv.participantIds || []).find(id => id !== currentUser.id) : null;
  const targetUser = otherUserId ? users.find(u => u.id === otherUserId) : null;

  const convMessages = messages.filter(m => m.conversationId === activeConv.id);
  const pinnedTasks = tasks.filter(t => (activeConv.pinnedTaskIds || []).includes(t.id));

  // Find if there is an active meeting for this conversation
  const relatedMeeting = meetings.find(m => (m.participants || []).some(p => p.userId === otherUserId) && m.status === 'upcoming');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden" id="chat-window-pane">
      {/* WhatsApp-Style Chat Header */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2.5 bg-white border-b border-slate-200 shadow-xs z-10">
        <div className="flex items-center gap-3">
          {onBackMobile && (
            <button 
              onClick={onBackMobile} 
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          )}

          <div className="relative">
            {targetUser?.avatar ? (
              <img 
                src={targetUser.avatar} 
                alt={targetUser.name} 
                className="w-10 h-10 rounded-md object-cover ring-1 ring-slate-200" 
              />
            ) : (
              <div className="w-10 h-10 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                {(activeConv.title || 'محادثة').substring(0, 2)}
              </div>
            )}
            {targetUser?.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {targetUser ? targetUser.name : activeConv.title}
              </span>
              {targetUser && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {targetUser.jobTitle}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              {targetUser 
                ? (targetUser.isOnline ? 'متصل الآن' : `آخر ظهور: ${targetUser.lastSeen}`) 
                : `${activeConv.participantIds.length} مشاركين في المجموعة`}
            </span>
          </div>
        </div>

        {/* Action icons (Voice Call, Video Call, Meeting) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {targetUser && (
            <>
              {/* Voice Call Button */}
              <button
                onClick={() => startCall(targetUser.id, false)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                title="مكالمة صوتية فردية"
                id="btn-voice-call"
              >
                <Phone className="w-4 h-4" />
              </button>

              {/* Video Call Button */}
              <button
                onClick={() => startCall(targetUser.id, true)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                title="مكالمة فيديو فردية"
                id="btn-video-call"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Group Meeting button */}
          <button
            onClick={() => {
              if (relatedMeeting) {
                joinMeetingRoom(relatedMeeting.id);
              } else {
                // Open first meeting
                joinMeetingRoom('meet-1');
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="غرفة اجتماع جماعي"
            id="btn-group-meeting"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>اجتماع</span>
          </button>
        </div>
      </div>

      {/* Pinned Tasks Banner at Top of Chat */}
      {pinnedTasks.length > 0 && (
        <div className="bg-emerald-50/70 border-b border-emerald-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-1 rounded bg-slate-900 text-emerald-400 shrink-0">
              <Pin className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="text-xs truncate">
              <span className="font-bold text-slate-900">المهمة المثبتة بالمحادثة: </span>
              <span className="text-slate-800 font-semibold">{pinnedTasks[0].title}</span>
              <span className="text-slate-500 mr-2">({pinnedTasks[0].status === 'in_progress' ? 'قيد التنفيذ' : pinnedTasks[0].status === 'awaiting_approval' ? 'بانتظار الاعتماد' : 'جديدة'})</span>
            </div>
          </div>
          <button
            onClick={() => onOpenTaskDetails(pinnedTasks[0].id)}
            className="text-xs font-bold text-slate-900 hover:text-emerald-700 underline shrink-0 cursor-pointer"
          >
            متابعة المهمة
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Date banner */}
        <div className="flex justify-center my-2">
          <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
            اليوم • سجل المراسلات محمي وغير قابل للحذف
          </span>
        </div>

        {convMessages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          const sender = users.find(u => u.id === msg.senderId);
          const linkedTask = msg.taskRefId ? tasks.find(t => t.id === msg.taskRefId) : null;

          return (
            <div 
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
            >
              {/* Sender Name in group */}
              {!isMe && !isDirect && sender && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 mb-1 px-1">
                  <span>{sender.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({sender.jobTitle})</span>
                </div>
              )}

              {/* Message Bubble Container */}
              <div className="flex items-start gap-1 max-w-[85%] sm:max-w-[75%]">
                {/* Context Action: Convert to Task Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 self-center">
                  <button
                    onClick={() => setConvertingMessage(msg)}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-400 text-slate-800 rounded-lg shadow-xs text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="تحويل هذه الرسالة إلى مهمة عمل"
                    id={`btn-convert-task-${msg.id}`}
                  >
                    <Pin className="w-3.5 h-3.5 fill-current text-emerald-600" />
                    <span className="hidden sm:inline text-[10px]">تحويل لمهمة</span>
                  </button>

                  <button
                    onClick={() => pinMessage(activeConv.id, msg.id)}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg shadow-xs text-xs cursor-pointer"
                    title="تثبيت الرسالة"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bubble Body */}
                <div
                  className={`rounded-xl px-4 py-2.5 shadow-2xs text-xs sm:text-sm text-right leading-relaxed ${
                    isMe 
                      ? 'bg-slate-900 text-white rounded-bl-xs' 
                      : 'bg-white text-slate-900 border border-slate-200 rounded-br-xs'
                  }`}
                >
                  {/* Pinned label inside bubble */}
                  {msg.isPinned && (
                    <div className={`flex items-center gap-1 text-[10px] font-semibold mb-1 ${isMe ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      <Pin className="w-3 h-3 fill-current" />
                      <span>رسالة مثبتة</span>
                    </div>
                  )}

                  {/* Voice Note View */}
                  {msg.type === 'voice' && msg.voiceNote ? (
                    <VoiceNotePlayer voiceNote={msg.voiceNote} isSender={isMe} />
                  ) : msg.type === 'image' && msg.attachments?.[0] ? (
                    /* Image preview */
                    <div className="space-y-1.5">
                      <img 
                        src={msg.attachments[0].url} 
                        alt="attachment" 
                        className="max-h-48 rounded-lg object-cover w-full" 
                      />
                      <p>{msg.content}</p>
                    </div>
                  ) : msg.type === 'file' && msg.attachments?.[0] ? (
                    /* File preview */
                    <div className={`flex items-center gap-2 p-2 rounded-lg mb-1 ${isMe ? 'bg-white/10' : 'bg-slate-50 border border-slate-200'}`}>
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <div className="truncate text-right">
                        <span className="font-semibold block truncate">{msg.attachments[0].name}</span>
                        <span className="text-[10px] opacity-75">{msg.attachments[0].size}</span>
                      </div>
                    </div>
                  ) : (
                    /* Regular text */
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}

                  {/* Timestamp & Read Status (WhatsApp Double Checks) */}
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                    <span className="font-mono">{msg.sentAt}</span>
                    {isMe && (
                      <span title={msg.status === 'read' ? `تمت القراءة: ${msg.readAt || ''}` : 'تم التسليم'}>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 opacity-70" />
                        ) : (
                          <Check className="w-3.5 h-3.5 opacity-70" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Embedded Task Card if this message created/refers to a task */}
              {linkedTask && (
                <div className="w-full max-w-lg mt-1">
                  <TaskCardInChat 
                    task={linkedTask} 
                    onOpenDetails={onOpenTaskDetails} 
                  />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Composer */}
      <MessageComposer onSendMessage={(content, type, attachments, voiceNote) => sendMessage(activeConv.id, content, type, attachments, voiceNote)} />

      {/* Convert Message Modal */}
      {convertingMessage && (
        <ConvertMessageModal 
          message={convertingMessage} 
          onClose={() => setConvertingMessage(null)} 
        />
      )}
    </div>
  );
};
