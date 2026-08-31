import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Department, 
  Conversation, 
  Message, 
  Task, 
  AttendanceRecord, 
  LeaveRequest, 
  Meeting, 
  Announcement, 
  NotificationItem, 
  AuditLog,
  TaskPriority,
  TaskStatus,
  MessageAttachment,
  VoiceNoteData
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_TASKS, 
  INITIAL_ATTENDANCE, 
  INITIAL_LEAVES, 
  INITIAL_MEETINGS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';
import { soundManager } from '../utils/sound';

export type NavigationTab = 
  | 'dashboard' 
  | 'chats' 
  | 'tasks' 
  | 'attendance' 
  | 'leaves' 
  | 'meetings' 
  | 'announcements' 
  | 'directory' 
  | 'reports' 
  | 'admin' 
  | 'settings';

export interface ActiveCallState {
  targetUser: User;
  isVideo: boolean;
  isOutgoing: boolean;
  isConnected: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  durationSeconds: number;
}

interface WorkspaceContextType {
  // Current session & auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchUser: (userId: string) => void;
  loginWithPhone: (phone: string, pass: string) => boolean;
  logout: () => void;
  
  // Navigation & View
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;

  // Data Collections
  users: User[];
  departments: Department[];
  conversations: Conversation[];
  messages: Message[];
  tasks: Task[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  meetings: Meeting[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];

  // Chat Actions
  sendMessage: (
    conversationId: string, 
    content: string, 
    type?: 'text' | 'image' | 'file' | 'voice', 
    attachments?: MessageAttachment[], 
    voiceNote?: VoiceNoteData
  ) => void;
  markConversationAsRead: (conversationId: string) => void;
  pinMessage: (conversationId: string, messageId: string) => void;
  createConversation: (type: 'direct' | 'group' | 'department', participantIds: string[], title?: string) => string;

  // Task Actions
  convertMessageToTask: (
    messageId: string, 
    title: string, 
    description: string, 
    assigneeIds: string[], 
    priority: TaskPriority, 
    deadline?: string, 
    requireProof?: boolean,
    recurring?: 'none' | 'daily' | 'weekly' | 'monthly'
  ) => string;
  createStandaloneTask: (
    title: string, 
    description: string, 
    assigneeIds: string[], 
    priority: TaskPriority, 
    deadline?: string, 
    requireProof?: boolean,
    conversationId?: string,
    recurring?: 'none' | 'daily' | 'weekly' | 'monthly'
  ) => string;
  startTask: (taskId: string) => void;
  completeTaskWithProof: (taskId: string, proofText?: string, fileName?: string) => void;
  approveTask: (taskId: string) => void;
  requestTaskRevision: (taskId: string, reason: string) => void;
  addTaskComment: (taskId: string, text: string) => void;

  // Attendance Actions
  clockIn: (notes?: string) => void;
  clockOut: () => void;
  todayAttendance: AttendanceRecord | undefined;

  // Leave Actions
  submitLeaveRequest: (
    leaveType: 'annual' | 'sick' | 'emergency' | 'unpaid', 
    startDate: string, 
    endDate: string, 
    reason: string, 
    attachmentName?: string
  ) => void;
  decideLeaveRequest: (leaveId: string, status: 'approved' | 'rejected', rejectionReason?: string) => void;

  // Meeting & Calling Actions
  activeCall: ActiveCallState | null;
  startCall: (targetUserId: string, isVideo: boolean) => void;
  answerCall: () => void;
  endCall: () => void;
  toggleCallMute: () => void;
  toggleCallVideo: () => void;
  
  activeMeeting: Meeting | null;
  joinMeetingRoom: (meetingId: string) => void;
  leaveMeetingRoom: () => void;
  createMeeting: (
    title: string, 
    description: string, 
    scheduledDate: string, 
    scheduledTime: string, 
    durationMinutes: number, 
    participantIds: string[]
  ) => string;

  // Announcements
  acknowledgeAnnouncement: (announcementId: string) => void;
  createAnnouncement: (
    title: string, 
    content: string, 
    priority: 'urgent' | 'important' | 'normal', 
    targetType: 'all' | 'department' | 'team', 
    targetDepartmentId?: string,
    requireAcknowledgment?: boolean
  ) => void;

  // Admin & Directory
  addEmployee: (employee: Partial<User>) => void;
  updateEmployee: (userId: string, updates: Partial<User>) => void;
  toggleEmployeeStatus: (userId: string) => void;
  
  // Notifications
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

const STORAGE_KEYS = {
  USERS: 'doc_workspace_users_v1',
  CONVERSATIONS: 'doc_workspace_conversations_v1',
  MESSAGES: 'doc_workspace_messages_v1',
  TASKS: 'doc_workspace_tasks_v1',
  ATTENDANCE: 'doc_workspace_attendance_v1',
  LEAVES: 'doc_workspace_leaves_v1',
  MEETINGS: 'doc_workspace_meetings_v1',
  ANNOUNCEMENTS: 'doc_workspace_announcements_v1',
  NOTIFICATIONS: 'doc_workspace_notifs_v1',
  AUDIT: 'doc_workspace_audit_v1',
  CURRENT_USER_ID: 'doc_workspace_curr_user_v2'
};

function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    console.warn(`Storage read error for ${key}:`, e);
    return fallback;
  }
}

function safeSetStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (e) {
    console.warn(`Storage write error for ${key}:`, e);
  }
}

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data with fallback to rich initial data
  const [users, setUsers] = useState<User[]>(() => {
    return safeGetStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  });

  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    return safeGetStorage<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    return safeGetStorage<Message[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    return safeGetStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    return safeGetStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    return safeGetStorage<LeaveRequest[]>(STORAGE_KEYS.LEAVES, INITIAL_LEAVES);
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    return safeGetStorage<Meeting[]>(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    return safeGetStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return safeGetStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    return safeGetStorage<AuditLog[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
  });

  // Current logged in user (Default to Marketing Manager u-2 or CEO u-1 or Designer u-3)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const found = users.find(u => u.id === savedId);
      return found || users[1] || users[0] || null;
    } catch {
      return users[1] || users[0] || null;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('chats');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('conv-1');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Calls & Meeting
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
  }, [conversations]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.ATTENDANCE, attendanceRecords);
  }, [attendanceRecords]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.LEAVES, leaveRequests);
  }, [leaveRequests]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.MEETINGS, meetings);
  }, [meetings]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }, [announcements]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.AUDIT, auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    if (currentUser) {
      safeSetStorage(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    }
  }, [currentUser]);

  // Call timer effect
  useEffect(() => {
    let timer: number | null = null;
    if (activeCall && activeCall.isConnected) {
      timer = window.setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCall?.isConnected]);

  // Helper to append audit log
  const logAudit = useCallback((action: string, category: AuditLog['category'], details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser?.id || 'system',
      action,
      category,
      details,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  // Switch active profile easily for reviewer
  const switchUser = useCallback((userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      logAudit('تبديل الحساب النشط', 'auth', `تم التبديل إلى حساب ${target.name} (${target.jobTitle})`);
    }
  }, [users, logAudit]);

  // Login with phone
  const loginWithPhone = useCallback((phone: string, _pass: string) => {
    const target = users.find(u => u.phone === phone.trim() || u.phone.replace(/[\s-]/g, '') === phone.trim());
    if (target) {
      setCurrentUser(target);
      logAudit('تسجيل دخول ناجح', 'auth', `تم تسجيل الدخول برقم الهاتف ${phone}`);
      return true;
    }
    return false;
  }, [users, logAudit]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    logAudit('تسجيل خروج', 'auth', 'تم تسجيل الخروج من النظام.');
  }, [logAudit]);

  // Today's attendance for current user
  const todayAttendance = useMemo(() => {
    if (!currentUser) return undefined;
    const todayStr = new Date().toISOString().split('T')[0];
    return attendanceRecords.find(r => r.userId === currentUser.id && r.date === todayStr);
  }, [attendanceRecords, currentUser]);

  // Send Message
  const sendMessage = useCallback((
    conversationId: string, 
    content: string, 
    type: 'text' | 'image' | 'file' | 'voice' = 'text',
    attachments?: MessageAttachment[],
    voiceNote?: VoiceNoteData
  ) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId,
      senderId: currentUser.id,
      type,
      content,
      attachments,
      voiceNote,
      status: 'sent',
      sentAt: timeStr,
      deliveredAt: timeStr,
      readAt: undefined
    };

    setMessages(prev => [...prev, newMsg]);

    // Update conversation last message
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        const nextUnread = { ...c.unreadCounts };
        c.participantIds.forEach(pId => {
          if (pId !== currentUser.id) {
            nextUnread[pId] = (nextUnread[pId] || 0) + 1;
          }
        });
        return {
          ...c,
          lastMessage: {
            content: type === 'voice' ? '🎤 رسالة صوتية' : type === 'image' ? '📷 صورة' : type === 'file' ? '📎 ملف' : content,
            senderId: currentUser.id,
            timestamp: timeStr,
            type
          },
          unreadCounts: nextUnread
        };
      }
      return c;
    }));

    soundManager.playMessageTone();

    // Auto mark delivered and read after 1 second for active conversation
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read', readAt: timeStr } : m));
    }, 1500);

  }, [currentUser]);

  // Mark conversation read
  const markConversationAsRead = useCallback((conversationId: string) => {
    if (!currentUser) return;
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          unreadCounts: {
            ...c.unreadCounts,
            [currentUser.id]: 0
          }
        };
      }
      return c;
    }));

    setMessages(prev => prev.map(m => {
      if (m.conversationId === conversationId && m.senderId !== currentUser.id && m.status !== 'read') {
        return { ...m, status: 'read', readAt: 'الآن' };
      }
      return m;
    }));
  }, [currentUser]);

  // Pin message
  const pinMessage = useCallback((conversationId: string, messageId: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        const pinned = c.pinnedMessageIds || [];
        const exists = pinned.includes(messageId);
        return {
          ...c,
          pinnedMessageIds: exists 
            ? pinned.filter(id => id !== messageId)
            : [...pinned, messageId]
        };
      }
      return c;
    }));

    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return { ...m, isPinned: !m.isPinned };
      }
      return m;
    }));
  }, []);

  // Create Conversation
  const createConversation = useCallback((type: 'direct' | 'group' | 'department', participantIds: string[], title?: string) => {
    if (!currentUser) return '';
    const allParticipants = Array.from(new Set([currentUser.id, ...participantIds]));
    
    // Check if direct exists
    if (type === 'direct' && participantIds.length === 1) {
      const existing = conversations.find(c => c.type === 'direct' && (c.participantIds || []).includes(currentUser.id) && (c.participantIds || []).includes(participantIds[0]));
      if (existing) return existing.id;
    }

    const otherUser = users.find(u => u.id === participantIds[0]);
    const finalTitle = title || (type === 'direct' ? otherUser?.name || 'محادثة' : 'مجموعة عمل جديدة');

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      type,
      title: finalTitle,
      avatar: otherUser?.avatar || '',
      participantIds: allParticipants,
      unreadCounts: {},
      pinnedTaskIds: [],
      pinnedMessageIds: [],
      createdAt: new Date().toISOString()
    };

    setConversations(prev => [newConv, ...prev]);
    setSelectedConversationId(newConv.id);
    setActiveTab('chats');
    return newConv.id;
  }, [currentUser, conversations, users]);

  // Convert Message to Task (The Core Magic Feature!)
  const convertMessageToTask = useCallback((
    messageId: string, 
    title: string, 
    description: string, 
    assigneeIds: string[], 
    priority: TaskPriority, 
    deadline?: string, 
    requireProof: boolean = true,
    recurring: 'none' | 'daily' | 'weekly' | 'monthly' = 'none'
  ) => {
    if (!currentUser) return '';
    const originalMsg = messages.find(m => m.id === messageId);
    const convId = originalMsg?.conversationId || selectedConversationId || 'conv-1';
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    const taskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: taskId,
      title,
      description,
      createdBy: currentUser.id,
      assigneeIds,
      priority,
      deadline: deadline || 'اليوم 05:00 م',
      status: 'new',
      requireProof,
      recurring,
      conversationId: convId,
      originalMessageId: messageId,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          type: 'created',
          description: `تم تحويل الرسالة إلى مهمة بواسطة ${currentUser.name}`,
          timestamp: nowTime,
          userId: currentUser.id
        }
      ],
      comments: [],
      createdAt: new Date().toISOString()
    };

    // Add task to state
    setTasks(prev => [newTask, ...prev]);

    // Pin task in the conversation
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          pinnedTaskIds: Array.from(new Set([...c.pinnedTaskIds, taskId]))
        };
      }
      return c;
    }));

    // Update original message to link to task
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return { ...m, taskRefId: taskId };
      }
      return m;
    }));

    // Notify assignees
    assigneeIds.forEach(aId => {
      if (aId !== currentUser.id) {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}-${aId}`,
          userId: aId,
          type: 'new_task',
          title: '📌 مهمة جديدة من المدير',
          message: `تم تكليفك بمهمة: "${title}" - الأولوية: ${priority === 'urgent' ? 'عاجلة' : 'عالية'}`,
          linkType: 'chat',
          linkId: convId,
          isRead: false,
          createdAt: nowTime
        };
        setNotifications(prev => [notif, ...prev]);
      }
    });

    logAudit('تحويل رسالة إلى مهمة', 'task', `تم إنشاء مهمة "${title}" وتعيينها إلى ${assigneeIds.length} موظف.`);
    soundManager.playNotificationTone();

    return taskId;
  }, [currentUser, messages, selectedConversationId, logAudit]);

  // Create Standalone Task
  const createStandaloneTask = useCallback((
    title: string, 
    description: string, 
    assigneeIds: string[], 
    priority: TaskPriority, 
    deadline?: string, 
    requireProof: boolean = true,
    conversationId?: string,
    recurring: 'none' | 'daily' | 'weekly' | 'monthly' = 'none'
  ) => {
    if (!currentUser) return '';
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
    const taskId = `task-${Date.now()}`;

    const newTask: Task = {
      id: taskId,
      title,
      description,
      createdBy: currentUser.id,
      assigneeIds,
      priority,
      deadline: deadline || 'اليوم 05:00 م',
      status: 'new',
      requireProof,
      recurring,
      conversationId,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          type: 'created',
          description: `أنشئت المهمة بواسطة ${currentUser.name}`,
          timestamp: nowTime,
          userId: currentUser.id
        }
      ],
      comments: [],
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);

    if (conversationId) {
      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            pinnedTaskIds: Array.from(new Set([...c.pinnedTaskIds, taskId]))
          };
        }
        return c;
      }));
    }

    logAudit('إنشاء مهمة', 'task', `تم إنشاء مهمة "${title}".`);
    soundManager.playNotificationTone();
    return taskId;
  }, [currentUser, logAudit]);

  // Start Task
  const startTask = useCallback((taskId: string) => {
    if (!currentUser) return;
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'in_progress',
          startedAt: nowTime,
          timeline: [
            ...t.timeline,
            {
              id: `tl-${Date.now()}`,
              type: 'started',
              description: `بدأ ${currentUser.name} العمل على المهمة`,
              timestamp: nowTime,
              userId: currentUser.id
            }
          ]
        };
      }
      return t;
    }));

    logAudit('بدء مهمة', 'task', `بدأ ${currentUser.name} العمل على المهمة رقم ${taskId}.`);
  }, [currentUser, logAudit]);

  // Complete Task With Proof -> becomes awaiting_approval
  const completeTaskWithProof = useCallback((taskId: string, proofText?: string, fileName?: string) => {
    if (!currentUser) return;
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    let creatorId = '';
    let taskTitle = '';

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        creatorId = t.createdBy;
        taskTitle = t.title;
        return {
          ...t,
          status: 'awaiting_approval',
          completedAt: nowTime,
          proof: {
            text: proofText || 'تم إنجاز المطلوب بالكامل وجاهز للاعتماد.',
            fileName: fileName || 'Doctor_Task_Completion_Proof.png',
            fileUrl: '#',
            submittedAt: nowTime,
            submittedBy: currentUser.id
          },
          timeline: [
            ...t.timeline,
            {
              id: `tl-${Date.now()}`,
              type: 'proof_submitted',
              description: `أكمل ${currentUser.name} العمل وقدم إثبات الإنجاز للاعتماد`,
              timestamp: nowTime,
              userId: currentUser.id
            }
          ]
        };
      }
      return t;
    }));

    // Notify creator / manager
    if (creatorId && creatorId !== currentUser.id) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: creatorId,
        type: 'task_awaiting_approval',
        title: 'مهمة جاهزة للاعتماد ✓',
        message: `أنهى ${currentUser.name} مهمة "${taskTitle}" بانتظار مراجعتك واعتمادها.`,
        linkType: 'task',
        linkId: taskId,
        isRead: false,
        createdAt: nowTime
      };
      setNotifications(prev => [notif, ...prev]);
    }

    logAudit('إكمال مهمة وطلب اعتماد', 'task', `أنهى ${currentUser.name} المهمة ${taskId} وقدم إثبات الإنجاز.`);
    soundManager.playMessageTone();
  }, [currentUser, logAudit]);

  // Approve Task (Manager) -> Approved 🎉
  const approveTask = useCallback((taskId: string) => {
    if (!currentUser) return;
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    let assignees: string[] = [];
    let taskTitle = '';
    let convId: string | undefined = undefined;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        assignees = t.assigneeIds;
        taskTitle = t.title;
        convId = t.conversationId;
        return {
          ...t,
          status: 'approved',
          approvedAt: nowTime,
          approvedBy: currentUser.id,
          timeline: [
            ...t.timeline,
            {
              id: `tl-${Date.now()}`,
              type: 'approved',
              description: `تم اعتماد المهمة بنجاح بواسطة ${currentUser.name} ✓`,
              timestamp: nowTime,
              userId: currentUser.id
            }
          ]
        };
      }
      return t;
    }));

    // Remove from pinned tasks once approved
    if (convId) {
      setConversations(prev => prev.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            pinnedTaskIds: c.pinnedTaskIds.filter(id => id !== taskId)
          };
        }
        return c;
      }));
    }

    // Trigger celebratory confetti 🎉
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#514088', '#efc1d4', '#d1c6f0', '#292a29']
      });
    } catch {
      // Ignore
    }

    soundManager.playApprovalTone();

    // Notify assignees
    assignees.forEach(aId => {
      if (aId !== currentUser.id) {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}-${aId}`,
          userId: aId,
          type: 'task_approved',
          title: '🎉 تم اعتماد مهمتك بنجاح',
          message: `اعتمد ${currentUser.name} إنجاز مهمة "${taskTitle}". عمل رائع!`,
          linkType: 'task',
          linkId: taskId,
          isRead: false,
          createdAt: nowTime
        };
        setNotifications(prev => [notif, ...prev]);
      }
    });

    logAudit('اعتماد مهمة', 'task', `اعتمد ${currentUser.name} المهمة ${taskId}.`);
  }, [currentUser, logAudit]);

  // Request Task Revision (Manager)
  const requestTaskRevision = useCallback((taskId: string, reason: string) => {
    if (!currentUser) return;
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    let assignees: string[] = [];
    let taskTitle = '';

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        assignees = t.assigneeIds;
        taskTitle = t.title;
        return {
          ...t,
          status: 'revision_required',
          revision: {
            reason,
            requestedAt: nowTime,
            requestedBy: currentUser.id
          },
          timeline: [
            ...t.timeline,
            {
              id: `tl-${Date.now()}`,
              type: 'revision_requested',
              description: `طلب تعديل من ${currentUser.name}: ${reason}`,
              timestamp: nowTime,
              userId: currentUser.id
            }
          ]
        };
      }
      return t;
    }));

    // Notify assignees
    assignees.forEach(aId => {
      if (aId !== currentUser.id) {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}-${aId}`,
          userId: aId,
          type: 'task_revision',
          title: '⚠️ مطلوب تعديل على المهمة',
          message: `طلب ${currentUser.name} تعديلاً على مهمة "${taskTitle}": "${reason}"`,
          linkType: 'task',
          linkId: taskId,
          isRead: false,
          createdAt: nowTime
        };
        setNotifications(prev => [notif, ...prev]);
      }
    });

    logAudit('طلب تعديل مهمة', 'task', `طلب ${currentUser.name} تعديل على المهمة ${taskId} لسبب: ${reason}`);
    soundManager.playNotificationTone();
  }, [currentUser, logAudit]);

  // Task Comments
  const addTaskComment = useCallback((taskId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [
            ...t.comments,
            {
              id: `tc-${Date.now()}`,
              userId: currentUser.id,
              text,
              timestamp: nowTime
            }
          ]
        };
      }
      return t;
    }));
  }, [currentUser]);

  // Attendance Clock-in
  const clockIn = useCallback((notes?: string) => {
    if (!currentUser) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId: currentUser.id,
      date: todayStr,
      checkInTime: nowTime,
      status: 'present',
      notes: notes || 'حضور عبر تطبيق مساحة عمل الدكتور'
    };

    setAttendanceRecords(prev => [newRecord, ...prev.filter(r => !(r.userId === currentUser.id && r.date === todayStr))]);
    logAudit('تسجيل حضور', 'attendance', `سجل ${currentUser.name} الحضور في تمام الساعة ${nowTime}.`);
    soundManager.playMessageTone();
  }, [currentUser, logAudit]);

  // Attendance Clock-out
  const clockOut = useCallback(() => {
    if (!currentUser) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    setAttendanceRecords(prev => prev.map(r => {
      if (r.userId === currentUser.id && r.date === todayStr) {
        return {
          ...r,
          checkOutTime: nowTime,
          totalWorkingMinutes: 480, // 8 hours calculated
          status: 'checked_out'
        };
      }
      return r;
    }));

    logAudit('تسجيل انصراف', 'attendance', `سجل ${currentUser.name} الانصراف في تمام الساعة ${nowTime}.`);
    soundManager.playMessageTone();
  }, [currentUser, logAudit]);

  // Leave Request
  const submitLeaveRequest = useCallback((
    leaveType: 'annual' | 'sick' | 'emergency' | 'unpaid', 
    startDate: string, 
    endDate: string, 
    reason: string, 
    attachmentName?: string
  ) => {
    if (!currentUser) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 || 1;

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      userId: currentUser.id,
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason,
      attachmentName,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setLeaveRequests(prev => [newLeave, ...prev]);

    // Notify CEO / Manager
    const targetManagerId = currentUser.directManagerId || 'u-1';
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetManagerId,
      type: 'leave_request',
      title: 'طلب إجازة جديد 🏖️',
      message: `قدم ${currentUser.name} طلب إجازة ${leaveType === 'annual' ? 'سنوية' : leaveType === 'sick' ? 'مرضية' : 'طارئة'} لمدة ${daysCount} أيام.`,
      linkType: 'leave',
      linkId: newLeave.id,
      isRead: false,
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
    setNotifications(prev => [notif, ...prev]);

    logAudit('تقديم طلب إجازة', 'leave', `قدم ${currentUser.name} طلب إجازة (${daysCount} أيام).`);
    soundManager.playNotificationTone();
  }, [currentUser, logAudit]);

  // Leave Decision (Manager)
  const decideLeaveRequest = useCallback((leaveId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    if (!currentUser) return;
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

    let requesterId = '';

    setLeaveRequests(prev => prev.map(l => {
      if (l.id === leaveId) {
        requesterId = l.userId;
        return {
          ...l,
          status,
          rejectionReason,
          decidedBy: currentUser.id,
          decidedAt: new Date().toISOString()
        };
      }
      return l;
    }));

    if (requesterId) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: requesterId,
        type: status === 'approved' ? 'leave_approved' : 'leave_rejected',
        title: status === 'approved' ? 'تمت الموافقة على طلب الإجازة 🎉' : 'تم رفض طلب الإجازة',
        message: status === 'approved' 
          ? `وافق ${currentUser.name} على طلب إجازتك.`
          : `تم رفض طلب الإجازة: "${rejectionReason || 'بحسب متطلبات العمل'}"`,
        linkType: 'leave',
        linkId: leaveId,
        isRead: false,
        createdAt: nowTime
      };
      setNotifications(prev => [notif, ...prev]);
    }

    logAudit('البت في طلب إجازة', 'leave', `قام ${currentUser.name} بـ (${status === 'approved' ? 'قبول' : 'رفض'}) طلب الإجازة ${leaveId}.`);
    soundManager.playApprovalTone();
  }, [currentUser, logAudit]);

  // Calls & WebRTC Simulation
  const startCall = useCallback((targetUserId: string, isVideo: boolean) => {
    const target = users.find(u => u.id === targetUserId);
    if (!target) return;

    setActiveCall({
      targetUser: target,
      isVideo,
      isOutgoing: true,
      isConnected: false,
      isMuted: false,
      isVideoOff: false,
      durationSeconds: 0
    });

    soundManager.startOutgoingRingtone();

    // Auto connect after 2.5 seconds simulation
    setTimeout(() => {
      soundManager.stopRingtone();
      setActiveCall(prev => prev ? { ...prev, isConnected: true } : null);
    }, 2800);

    logAudit('بدء مكالمة', 'system', `بدأ مكالمة ${isVideo ? 'فيديو' : 'صوتية'} مع ${target.name}.`);
  }, [users, logAudit]);

  const answerCall = useCallback(() => {
    soundManager.stopRingtone();
    setActiveCall(prev => prev ? { ...prev, isConnected: true } : null);
  }, []);

  const endCall = useCallback(() => {
    soundManager.stopRingtone();
    setActiveCall(null);
  }, []);

  const toggleCallMute = useCallback(() => {
    setActiveCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
  }, []);

  const toggleCallVideo = useCallback(() => {
    setActiveCall(prev => prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null);
  }, []);

  // Meetings
  const joinMeetingRoom = useCallback((meetingId: string) => {
    const meet = meetings.find(m => m.id === meetingId);
    if (meet) {
      setActiveMeeting(meet);
      logAudit('انضمام لاجتماع', 'system', `انضم إلى اجتماع "${meet.title}".`);
    }
  }, [meetings, logAudit]);

  const leaveMeetingRoom = useCallback(() => {
    setActiveMeeting(null);
  }, []);

  const createMeeting = useCallback((
    title: string, 
    description: string, 
    scheduledDate: string, 
    scheduledTime: string, 
    durationMinutes: number, 
    participantIds: string[]
  ) => {
    if (!currentUser) return '';
    const newMeet: Meeting = {
      id: `meet-${Date.now()}`,
      title,
      description,
      createdBy: currentUser.id,
      scheduledDate,
      scheduledTime,
      durationMinutes,
      status: 'upcoming',
      roomCode: `DOC-ROOM-${Math.floor(100 + Math.random() * 900)}`,
      participants: [
        { userId: currentUser.id, status: 'accepted' },
        ...participantIds.map(pId => ({ userId: pId, status: 'invited' as const }))
      ],
      createdAt: new Date().toISOString()
    };

    setMeetings(prev => [newMeet, ...prev]);

    // Send invitations
    participantIds.forEach(pId => {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}-${pId}`,
        userId: pId,
        type: 'meeting_invitation',
        title: 'دعوة لاجتماع فيديو 🎥',
        message: `تمت دعوتك لحضور اجتماع "${title}" موعد: ${scheduledDate} ${scheduledTime}`,
        linkType: 'meeting',
        linkId: newMeet.id,
        isRead: false,
        createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      setNotifications(prev => [notif, ...prev]);
    });

    logAudit('إنشاء اجتماع', 'system', `تم إنشاء اجتماع "${title}" ودعوة ${participantIds.length} مشارك.`);
    soundManager.playNotificationTone();
    return newMeet.id;
  }, [currentUser, logAudit]);

  // Announcements
  const acknowledgeAnnouncement = useCallback((announcementId: string) => {
    if (!currentUser) return;
    const nowTime = new Date().toISOString();

    setAnnouncements(prev => prev.map(a => {
      if (a.id === announcementId) {
        const already = a.acknowledgments.some(ack => ack.userId === currentUser.id);
        if (already) return a;
        return {
          ...a,
          acknowledgments: [...a.acknowledgments, { userId: currentUser.id, acknowledgedAt: nowTime }]
        };
      }
      return a;
    }));

    logAudit('تأكيد الاطلاع على تعليمات', 'system', `أكد ${currentUser.name} الاطلاع على الإعلان ${announcementId}.`);
    soundManager.playMessageTone();
  }, [currentUser, logAudit]);

  const createAnnouncement = useCallback((
    title: string, 
    content: string, 
    priority: 'urgent' | 'important' | 'normal', 
    targetType: 'all' | 'department' | 'team', 
    targetDepartmentId?: string,
    requireAcknowledgment: boolean = true
  ) => {
    if (!currentUser) return;
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      priority,
      targetType,
      targetDepartmentId,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      requireAcknowledgment,
      acknowledgments: [{ userId: currentUser.id, acknowledgedAt: new Date().toISOString() }]
    };

    setAnnouncements(prev => [newAnn, ...prev]);

    // Send notification to all employees
    users.forEach(u => {
      if (u.id !== currentUser.id) {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}-${u.id}`,
          userId: u.id,
          type: 'announcement',
          title: priority === 'urgent' ? '🚨 تعليمات إدارية عاجلة' : '📢 إعلان إداري رسمي',
          message: `أصدرت الإدارة توجيهاً جديداً: "${title}"`,
          linkType: 'announcement',
          linkId: newAnn.id,
          isRead: false,
          createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
        setNotifications(prev => [notif, ...prev]);
      }
    });

    logAudit('إصدار تعليمات إدارية', 'system', `أصدر ${currentUser.name} إعلاناً رسمياً بعنوان "${title}".`);
    soundManager.playNotificationTone();
  }, [currentUser, users, logAudit]);

  // Admin Actions
  const addEmployee = useCallback((data: Partial<User>) => {
    const newEmp: User = {
      id: `u-${Date.now()}`,
      employeeId: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || 'موظف جديد',
      phone: data.phone || '0500000000',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      jobTitle: data.jobTitle || 'موظف',
      department: data.department || 'العمليات وخدمة العملاء',
      role: data.role || 'employee',
      status: 'active',
      isOnline: false,
      lastSeen: 'لم يسجل دخول بعد',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newEmp]);
    logAudit('إضافة موظف', 'employee', `تمت إضافة الموظف ${newEmp.name} (${newEmp.jobTitle}).`);
  }, [logAudit]);

  const updateEmployee = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    logAudit('تحديث بيانات موظف', 'employee', `تم تحديث بيانات الموظف رقم ${userId}.`);
  }, [logAudit]);

  const toggleEmployeeStatus = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        logAudit('تعديل حالة حساب موظف', 'employee', `تم تحويل حساب ${u.name} إلى ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  }, [logAudit]);

  // Notifications
  const markNotificationRead = useCallback((notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
  }, [currentUser]);

  const unreadNotificationsCount = useMemo(() => {
    if (!currentUser) return 0;
    return notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;
  }, [notifications, currentUser]);

  return (
    <WorkspaceContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchUser,
      loginWithPhone,
      logout,
      activeTab,
      setActiveTab,
      selectedConversationId,
      setSelectedConversationId,
      selectedTaskId,
      setSelectedTaskId,
      users,
      departments,
      conversations,
      messages,
      tasks,
      attendanceRecords,
      leaveRequests,
      meetings,
      announcements,
      notifications,
      auditLogs,
      sendMessage,
      markConversationAsRead,
      pinMessage,
      createConversation,
      convertMessageToTask,
      createStandaloneTask,
      startTask,
      completeTaskWithProof,
      approveTask,
      requestTaskRevision,
      addTaskComment,
      clockIn,
      clockOut,
      todayAttendance,
      submitLeaveRequest,
      decideLeaveRequest,
      activeCall,
      startCall,
      answerCall,
      endCall,
      toggleCallMute,
      toggleCallVideo,
      activeMeeting,
      joinMeetingRoom,
      leaveMeetingRoom,
      createMeeting,
      acknowledgeAnnouncement,
      createAnnouncement,
      addEmployee,
      updateEmployee,
      toggleEmployeeStatus,
      markNotificationRead,
      markAllNotificationsRead,
      unreadNotificationsCount,
      searchQuery,
      setSearchQuery,
      isSearchOpen,
      setIsSearchOpen
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
