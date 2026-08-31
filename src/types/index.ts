export type Role = 'super_admin' | 'admin' | 'dept_manager' | 'supervisor' | 'employee';

export type TaskStatus = 
  | 'new' 
  | 'in_progress' 
  | 'awaiting_approval' 
  | 'approved' 
  | 'revision_required' 
  | 'overdue' 
  | 'cancelled';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export type ConversationType = 'direct' | 'group' | 'department' | 'announcement';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  avatar: string;
  jobTitle: string;
  department: string;
  section?: string;
  directManagerId?: string;
  role: Role;
  status: 'active' | 'inactive';
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'pdf' | 'word' | 'excel' | 'audio' | 'file';
  url: string;
}

export interface VoiceNoteData {
  durationSeconds: number;
  waveform: number[];
  audioUrl?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'task_created';
  content: string;
  attachments?: MessageAttachment[];
  voiceNote?: VoiceNoteData;
  status: MessageStatus;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  isPinned?: boolean;
  isArchivedLocally?: boolean;
  taskRefId?: string; // If converted into task or created as task
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  avatar?: string;
  participantIds: string[];
  departmentId?: string;
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: string;
    type: string;
  };
  unreadCounts: Record<string, number>; // userId -> count
  pinnedTaskIds: string[];
  pinnedMessageIds: string[];
  createdAt: string;
}

export interface TaskProof {
  text?: string;
  fileUrl?: string;
  fileName?: string;
  submittedAt: string;
  submittedBy: string;
}

export interface TaskRevision {
  reason: string;
  requestedAt: string;
  requestedBy: string;
}

export interface TaskTimelineEvent {
  id: string;
  type: 'created' | 'received' | 'started' | 'proof_submitted' | 'completed' | 'revision_requested' | 'approved' | 'comment';
  description: string;
  timestamp: string;
  userId: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  assigneeIds: string[];
  priority: TaskPriority;
  deadline?: string;
  status: TaskStatus;
  requireProof: boolean;
  proof?: TaskProof;
  revision?: TaskRevision;
  startedAt?: string;
  completedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
  timeline: TaskTimelineEvent[];
  comments: TaskComment[];
  conversationId?: string;
  originalMessageId?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM AM/PM
  checkOutTime?: string;
  totalWorkingMinutes?: number;
  status: 'present' | 'late' | 'checked_out' | 'absent';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  leaveType: 'annual' | 'sick' | 'emergency' | 'unpaid';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  attachmentName?: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  decidedBy?: string;
  decidedAt?: string;
  createdAt: string;
}

export interface MeetingParticipant {
  userId: string;
  status: 'invited' | 'accepted' | 'declined' | 'in_call';
  isMuted?: boolean;
  isVideoOff?: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  hostId?: string;
  scheduledDate: string;
  scheduledTime: string;
  scheduledAt?: string;
  durationMinutes: number;
  status: 'upcoming' | 'live' | 'ended';
  participants: MeetingParticipant[];
  roomCode: string;
  roomUrl?: string;
  createdAt: string;
}

export interface AnnouncementAcknowledgment {
  userId: string;
  acknowledgedAt: string;
}

export interface AnnouncementAttachment {
  id: string;
  name: string;
  size: string;
  url?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'important' | 'normal' | 'high';
  targetType: 'all' | 'department' | 'team';
  targetDepartmentId?: string;
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  requireAcknowledgment?: boolean;
  acknowledgments?: AnnouncementAcknowledgment[];
  readByUserIds?: string[];
  isPinned?: boolean;
  attachments?: AnnouncementAttachment[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 
    | 'new_message' 
    | 'new_task' 
    | 'task_reminder' 
    | 'task_overdue' 
    | 'task_completed' 
    | 'task_awaiting_approval' 
    | 'task_approved'
    | 'task_revision' 
    | 'announcement' 
    | 'leave_request' 
    | 'leave_approved' 
    | 'leave_rejected' 
    | 'incoming_call' 
    | 'meeting_invitation';
  title: string;
  message: string;
  linkType?: 'chat' | 'task' | 'leave' | 'meeting' | 'announcement';
  linkId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  category: 'auth' | 'employee' | 'task' | 'leave' | 'attendance' | 'permission' | 'system';
  details: string;
  timestamp: string;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  description?: string;
  memberCount?: number;
}
