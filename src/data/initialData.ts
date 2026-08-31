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
  AuditLog 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    employeeId: 'DOC-001',
    name: 'د. ياسر السعيد',
    phone: '0501234567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'المدير التنفيذي',
    department: 'الإدارة العليا',
    role: 'super_admin',
    status: 'active',
    isOnline: true,
    lastSeen: 'الآن',
    createdAt: '2025-01-01'
  },
  {
    id: 'u-2',
    employeeId: 'DOC-012',
    name: 'أ. محمد علي',
    phone: '0502345678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'مدير التسويق والإعلام',
    department: 'التسويق والإعلام',
    directManagerId: 'u-1',
    role: 'dept_manager',
    status: 'active',
    isOnline: true,
    lastSeen: 'الآن',
    createdAt: '2025-01-15'
  },
  {
    id: 'u-3',
    employeeId: 'DOC-045',
    name: 'أ. أحمد محمد',
    phone: '0503456789',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'مصمم جرافيك أول',
    department: 'التسويق والإعلام',
    section: 'قسم الهوية البصرية',
    directManagerId: 'u-2',
    role: 'employee',
    status: 'active',
    isOnline: true,
    lastSeen: 'منذ دقيقة',
    createdAt: '2025-02-01'
  },
  {
    id: 'u-4',
    employeeId: 'DOC-023',
    name: 'أ. سارة إبراهيم',
    phone: '0504567890',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'مشرفة خدمة العملاء والعمليات',
    department: 'العمليات وخدمة العملاء',
    directManagerId: 'u-1',
    role: 'supervisor',
    status: 'active',
    isOnline: true,
    lastSeen: 'الآن',
    createdAt: '2025-01-20'
  },
  {
    id: 'u-5',
    employeeId: 'DOC-058',
    name: 'أ. ريم خالد',
    phone: '0505678901',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'صانعة محتوى ومسوّقة رقمية',
    department: 'التسويق والإعلام',
    directManagerId: 'u-2',
    role: 'employee',
    status: 'active',
    isOnline: false,
    lastSeen: 'اليوم 10:15 ص',
    createdAt: '2025-02-15'
  },
  {
    id: 'u-6',
    employeeId: 'DOC-005',
    name: 'م. طارق محمود',
    phone: '0506789012',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'مهندس تقنية المعلومات والأنظمة',
    department: 'تقنية المعلومات',
    directManagerId: 'u-1',
    role: 'admin',
    status: 'active',
    isOnline: true,
    lastSeen: 'الآن',
    createdAt: '2025-01-05'
  },
  {
    id: 'u-7',
    employeeId: 'DOC-033',
    name: 'أ. ليلى عبد الرحمن',
    phone: '0507890123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'أخصائية الموارد البشرية',
    department: 'الموارد البشرية',
    directManagerId: 'u-1',
    role: 'supervisor',
    status: 'active',
    isOnline: true,
    lastSeen: 'الآن',
    createdAt: '2025-01-10'
  },
  {
    id: 'u-8',
    employeeId: 'DOC-077',
    name: 'أ. عمر حسني',
    phone: '0508901234',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    jobTitle: 'مسؤول مبيعات أول',
    department: 'المبيعات والتوزيع',
    directManagerId: 'u-1',
    role: 'employee',
    status: 'active',
    isOnline: false,
    lastSeen: 'أمس 8:30 م',
    createdAt: '2025-02-10'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'التسويق والإعلام',
    managerId: 'u-2',
    description: 'إدارة الحملات التسويقية والهوية البصرية والتواصل الرقمي',
    memberCount: 14
  },
  {
    id: 'dept-2',
    name: 'العمليات وخدمة العملاء',
    managerId: 'u-4',
    description: 'إدارة العمليات التشغيلية وتجربة عملاء شركة الدكتور',
    memberCount: 32
  },
  {
    id: 'dept-3',
    name: 'تقنية المعلومات',
    managerId: 'u-6',
    description: 'تطوير وصيانة الأنظمة التقنية ومساحة عمل الدكتور',
    memberCount: 12
  },
  {
    id: 'dept-4',
    name: 'الموارد البشرية',
    managerId: 'u-7',
    description: 'شؤون الموظفين، التدريب، استقطاب الكفاءات واللوائح الداخلية',
    memberCount: 8
  },
  {
    id: 'dept-5',
    name: 'المبيعات والتوزيع',
    managerId: 'u-8',
    description: 'تطوير الأعمال وعلاقات العملاء وتوسيع المبيعات',
    memberCount: 26
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'تصميم بوست العرض الجديد لشركة الدكتور',
    description: 'اعمل تصميم بوست العرض الجديد لشركة الدكتور مع استخدام ألوان الهوية البصرية (البنفسجي والوردي) وتسليمه قبل الساعة 5:00 مساءً.',
    createdBy: 'u-2',
    assigneeIds: ['u-3'],
    priority: 'urgent',
    deadline: 'اليوم 05:00 م',
    status: 'in_progress',
    requireProof: true,
    startedAt: '10:40 ص',
    recurring: 'none',
    conversationId: 'conv-1',
    timeline: [
      {
        id: 'tl-1',
        type: 'created',
        description: 'تم إنشاء المهمة وتحويلها من المحادثة بواسطة أ. محمد علي',
        timestamp: '10:30 ص',
        userId: 'u-2'
      },
      {
        id: 'tl-2',
        type: 'received',
        description: 'تم استلام المهمة وفتحها من قِبل أ. أحمد محمد',
        timestamp: '10:35 ص',
        userId: 'u-3'
      },
      {
        id: 'tl-3',
        type: 'started',
        description: 'بدأ أ. أحمد محمد العمل على تنفيذ المهمة',
        timestamp: '10:40 ص',
        userId: 'u-3'
      }
    ],
    comments: [
      {
        id: 'tc-1',
        userId: 'u-3',
        text: 'جاري تجهيز نسختين بمقاس إنستغرام وسناب شات 👍',
        timestamp: '11:15 ص'
      }
    ],
    createdAt: '2026-08-31 10:30'
  },
  {
    id: 'task-2',
    title: 'تجهيز تقرير الحملة الإعلانية الأسبوعية',
    description: 'تجميع إحصائيات حملات الميتا وجوجل وكتابة ملخص الأداء مع التوصيات لتخفيض تكلفة الاستحواذ.',
    createdBy: 'u-2',
    assigneeIds: ['u-5'],
    priority: 'high',
    deadline: 'اليوم 03:00 م',
    status: 'awaiting_approval',
    requireProof: true,
    startedAt: '09:00 ص',
    completedAt: '01:45 م',
    proof: {
      text: 'تم إرفاق جدول الإحصائيات مع زيادة العائد بنسبة 18% مقارنة بالأسبوع الماضي.',
      fileName: 'Marketing_Weekly_Report_Aug.pdf',
      fileUrl: '#',
      submittedAt: '01:45 م',
      submittedBy: 'u-5'
    },
    recurring: 'weekly',
    conversationId: 'conv-2',
    timeline: [
      {
        id: 'tl-4',
        type: 'created',
        description: 'تم إنشاء المهمة الدورية بواسطة أ. محمد علي',
        timestamp: '08:30 ص',
        userId: 'u-2'
      },
      {
        id: 'tl-5',
        type: 'started',
        description: 'بدأت أ. ريم خالد في جمع الإحصائيات',
        timestamp: '09:00 ص',
        userId: 'u-5'
      },
      {
        id: 'tl-6',
        type: 'proof_submitted',
        description: 'تم رفع التقرير وطلب الاعتماد النهائي',
        timestamp: '01:45 م',
        userId: 'u-5'
      }
    ],
    comments: [],
    createdAt: '2026-08-31 08:30'
  },
  {
    id: 'task-3',
    title: 'تحديث سيرفرات قاعدة البيانات لمساحة العمل',
    description: 'تطبيق أحدث التحديثات الأمنية وعمل نسخة احتياطية لكافة بيانات شركة الدكتور.',
    createdBy: 'u-1',
    assigneeIds: ['u-6'],
    priority: 'high',
    deadline: 'أمس 06:00 م',
    status: 'approved',
    requireProof: true,
    startedAt: 'أمس 02:00 م',
    completedAt: 'أمس 05:30 م',
    approvedAt: 'أمس 05:45 م',
    approvedBy: 'u-1',
    proof: {
      text: 'تم عمل النسخ الاحتياطي بنجاح واختبار استقرار الخوادم بنسبة 100%.',
      fileName: 'DB_Backup_Log_Verified.log',
      submittedAt: 'أمس 05:30 م',
      submittedBy: 'u-6'
    },
    recurring: 'none',
    timeline: [
      {
        id: 'tl-7',
        type: 'created',
        description: 'أنشئت المهمة بواسطة د. ياسر السعيد',
        timestamp: 'أمس 01:00 م',
        userId: 'u-1'
      },
      {
        id: 'tl-8',
        type: 'started',
        description: 'بدأ التنفيذ بواسطة م. طارق محمود',
        timestamp: 'أمس 02:00 م',
        userId: 'u-6'
      },
      {
        id: 'tl-9',
        type: 'completed',
        description: 'اكتمل العمل وتم إرسال الإثبات',
        timestamp: 'أمس 05:30 م',
        userId: 'u-6'
      },
      {
        id: 'tl-10',
        type: 'approved',
        description: 'تم اعتماد المهمة بنجاح بواسطة د. ياسر السعيد ✓',
        timestamp: 'أمس 05:45 م',
        userId: 'u-1'
      }
    ],
    comments: [],
    createdAt: '2026-08-30 13:00'
  },
  {
    id: 'task-4',
    title: 'تعديل بنرات العروض الخاصة في الموقع',
    description: 'تعديل أسعار باقة الدكتور الذهبية وإضافة زر الحجز المباشر.',
    createdBy: 'u-2',
    assigneeIds: ['u-3'],
    priority: 'urgent',
    deadline: 'أمس 04:00 م',
    status: 'revision_required',
    requireProof: true,
    startedAt: 'أمس 11:00 ص',
    completedAt: 'أمس 03:00 م',
    revision: {
      reason: 'يرجى تعديل السعر القديم وشطب السعر وإعادة وضع شعار الدكتور باللون البنفسجي الأساسي.',
      requestedAt: 'أمس 03:30 م',
      requestedBy: 'u-2'
    },
    recurring: 'none',
    conversationId: 'conv-1',
    timeline: [
      {
        id: 'tl-11',
        type: 'created',
        description: 'أنشئت بواسطة أ. محمد علي',
        timestamp: 'أمس 10:00 ص',
        userId: 'u-2'
      },
      {
        id: 'tl-12',
        type: 'started',
        description: 'بدأ أ. أحمد محمد العمل',
        timestamp: 'أمس 11:00 ص',
        userId: 'u-3'
      },
      {
        id: 'tl-13',
        type: 'completed',
        description: 'أنهى الموظف المهمة وطلب الاعتماد',
        timestamp: 'أمس 03:00 م',
        userId: 'u-3'
      },
      {
        id: 'tl-14',
        type: 'revision_requested',
        description: 'طلب تعديل من المدير: يرجى تعديل السعر وشعار الدكتور.',
        timestamp: 'أمس 03:30 م',
        userId: 'u-2'
      }
    ],
    comments: [],
    createdAt: '2026-08-30 10:00'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    title: 'أ. أحمد محمد',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    participantIds: ['u-2', 'u-3'],
    lastMessage: {
      content: 'اعمل تصميم بوست العرض الجديد قبل الساعة 5.',
      senderId: 'u-2',
      timestamp: '10:30 ص',
      type: 'text'
    },
    unreadCounts: { 'u-3': 1, 'u-2': 0 },
    pinnedTaskIds: ['task-1'],
    pinnedMessageIds: ['msg-1'],
    createdAt: '2026-08-30'
  },
  {
    id: 'conv-2',
    type: 'department',
    title: 'فريق التسويق والإعلام 🎯',
    avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
    participantIds: ['u-1', 'u-2', 'u-3', 'u-5'],
    departmentId: 'dept-1',
    lastMessage: {
      content: 'تم رفع التقرير الأسبوعي وبانتظار اعتماد المدير.',
      senderId: 'u-5',
      timestamp: '01:45 م',
      type: 'text'
    },
    unreadCounts: { 'u-2': 1, 'u-3': 0, 'u-1': 0 },
    pinnedTaskIds: ['task-2'],
    pinnedMessageIds: [],
    createdAt: '2026-08-01'
  },
  {
    id: 'conv-3',
    type: 'announcement',
    title: '📢 إعلانات شركة الدكتور الرسمية',
    avatar: '',
    participantIds: ['u-1', 'u-2', 'u-3', 'u-4', 'u-5', 'u-6', 'u-7', 'u-8'],
    lastMessage: {
      content: 'تنبيه: اجتماع عام للشركة غداً الأربعاء الساعة 11:00 صباحاً.',
      senderId: 'u-1',
      timestamp: 'أمس 04:00 م',
      type: 'text'
    },
    unreadCounts: { 'u-3': 0, 'u-2': 0 },
    pinnedTaskIds: [],
    pinnedMessageIds: [],
    createdAt: '2026-01-01'
  },
  {
    id: 'conv-4',
    type: 'direct',
    title: 'أ. سارة إبراهيم',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    participantIds: ['u-2', 'u-4'],
    lastMessage: {
      content: 'صباح الخير أ. محمد، تم مراجعة استفسارات عملاء الحملة الأخيرة.',
      senderId: 'u-4',
      timestamp: '09:15 ص',
      type: 'text'
    },
    unreadCounts: { 'u-2': 0 },
    pinnedTaskIds: [],
    pinnedMessageIds: [],
    createdAt: '2026-08-25'
  },
  {
    id: 'conv-5',
    type: 'direct',
    title: 'م. طارق محمود',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    participantIds: ['u-1', 'u-6'],
    lastMessage: {
      content: 'سيرفرات المنصة تعمل بأعلى كفاءة وسرعة استجابة.',
      senderId: 'u-6',
      timestamp: '08:00 ص',
      type: 'text'
    },
    unreadCounts: { 'u-1': 0 },
    pinnedTaskIds: ['task-3'],
    pinnedMessageIds: [],
    createdAt: '2026-08-20'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'u-2',
    type: 'text',
    content: 'السلام عليكم يا أحمد، نود البدء في الحملة الإعلانية الجديدة اليوم.',
    status: 'read',
    sentAt: '10:25 ص',
    deliveredAt: '10:25 ص',
    readAt: '10:26 ص',
    isPinned: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'u-3',
    type: 'text',
    content: 'وعليكم السلام أ. محمد، جاهز تماماً. ما هي تفاصيل التصميم المطلوبة؟',
    status: 'read',
    sentAt: '10:27 ص',
    deliveredAt: '10:27 ص',
    readAt: '10:28 ص'
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'u-2',
    type: 'text',
    content: 'اعمل تصميم بوست العرض الجديد قبل الساعة 5.',
    status: 'read',
    sentAt: '10:30 ص',
    deliveredAt: '10:30 ص',
    readAt: '10:31 ص',
    taskRefId: 'task-1'
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'u-2',
    type: 'voice',
    content: 'رسالة صوتية تشرح تفاصيل الألوان والشعار المطلوب.',
    voiceNote: {
      durationSeconds: 14,
      waveform: [20, 45, 70, 90, 60, 80, 100, 75, 50, 65, 85, 95, 40, 25]
    },
    status: 'read',
    sentAt: '10:32 ص',
    deliveredAt: '10:32 ص',
    readAt: '10:33 ص'
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: 'u-3',
    type: 'text',
    content: 'استلمت الرسالة وبدأت بالعمل فوراً على البوست وسأرفق النموذج هنا قبل الموعد بإذن الله.',
    status: 'read',
    sentAt: '10:40 ص',
    deliveredAt: '10:40 ص',
    readAt: '10:41 ص'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'توجيهات العمل المرن واستخدام مساحة عمل الدكتور (Doctor Workspace)',
    content: 'تؤكد إدارة شركة الدكتور على اعتماد منصة Doctor Workspace رسمياً لكافة المراسلات والمهام واعتماديات العمل. يُرجى من كافة الموظفين تسجيل الحضور اليومي واستقبال المهام حصرياً عبر المنصة.',
    priority: 'urgent',
    targetType: 'all',
    createdBy: 'u-1',
    createdAt: '2026-08-30 09:00',
    requireAcknowledgment: true,
    acknowledgments: [
      { userId: 'u-2', acknowledgedAt: '2026-08-30 09:15' },
      { userId: 'u-3', acknowledgedAt: '2026-08-30 09:22' },
      { userId: 'u-4', acknowledgedAt: '2026-08-30 09:30' },
      { userId: 'u-6', acknowledgedAt: '2026-08-30 09:35' }
    ]
  },
  {
    id: 'ann-2',
    title: 'مواعيد العمل الرسمية خلال الشهر القادم',
    content: 'ساعات العمل الرسمية تبدأ من الساعة 8:30 صباحاً حتى 4:30 مساءً. ونذكر الجميع بإمكانية العمل عن بُعد بعد التنسيق مع المدير المباشر.',
    priority: 'important',
    targetType: 'all',
    createdBy: 'u-7',
    createdAt: '2026-08-28 11:00',
    requireAcknowledgment: true,
    acknowledgments: [
      { userId: 'u-1', acknowledgedAt: '2026-08-28 11:05' },
      { userId: 'u-2', acknowledgedAt: '2026-08-28 11:10' }
    ]
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    userId: 'u-3',
    date: '2026-08-31',
    checkInTime: '08:45 ص',
    status: 'present',
    notes: 'العمل من المقر الرئيسي'
  },
  {
    id: 'att-2',
    userId: 'u-2',
    date: '2026-08-31',
    checkInTime: '08:30 ص',
    status: 'present',
    notes: 'العمل من المقر الرئيسي'
  },
  {
    id: 'att-3',
    userId: 'u-4',
    date: '2026-08-31',
    checkInTime: '08:25 ص',
    status: 'present'
  },
  {
    id: 'att-4',
    userId: 'u-5',
    date: '2026-08-31',
    checkInTime: '08:55 ص',
    status: 'present',
    notes: 'عمل عن بعد'
  },
  {
    id: 'att-5',
    userId: 'u-6',
    date: '2026-08-31',
    checkInTime: '08:15 ص',
    status: 'present'
  },
  // Yesterday's attendance records
  {
    id: 'att-yesterday-1',
    userId: 'u-3',
    date: '2026-08-30',
    checkInTime: '08:40 ص',
    checkOutTime: '04:45 م',
    totalWorkingMinutes: 485,
    status: 'checked_out'
  },
  {
    id: 'att-yesterday-2',
    userId: 'u-2',
    date: '2026-08-30',
    checkInTime: '08:30 ص',
    checkOutTime: '05:10 م',
    totalWorkingMinutes: 520,
    status: 'checked_out'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-1',
    userId: 'u-5',
    leaveType: 'annual',
    startDate: '2026-09-10',
    endDate: '2026-09-14',
    daysCount: 5,
    reason: 'إجازة سنوية بعد إنجاز حملة إطلاق الهوية الجديدة.',
    status: 'pending',
    createdAt: '2026-08-30 14:00'
  },
  {
    id: 'leave-2',
    userId: 'u-8',
    leaveType: 'emergency',
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    daysCount: 2,
    reason: 'ظرف عائلي طارئ.',
    status: 'approved',
    decidedBy: 'u-1',
    decidedAt: '2026-08-24 16:00',
    createdAt: '2026-08-24 10:00'
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    title: 'اجتماع فريق التسويق الدوري',
    description: 'مراجعة حملات العروض الجديدة، وتوزيع مهام الهوية البصرية، ومتابعة مؤشرات الأداء.',
    createdBy: 'u-2',
    scheduledDate: 'اليوم',
    scheduledTime: '02:00 م',
    durationMinutes: 45,
    status: 'upcoming',
    roomCode: 'DOC-MKT-992',
    participants: [
      { userId: 'u-2', status: 'accepted' },
      { userId: 'u-3', status: 'accepted' },
      { userId: 'u-5', status: 'accepted' }
    ],
    createdAt: '2026-08-31'
  },
  {
    id: 'meet-2',
    title: 'اجتماع مدراء الإدارات الشهري',
    description: 'مناقشة خطة التوسع ومراجعة ميزانية الربع القادم بحضور الإدارة العليا.',
    createdBy: 'u-1',
    scheduledDate: 'غداً',
    scheduledTime: '11:00 ص',
    durationMinutes: 60,
    status: 'upcoming',
    roomCode: 'DOC-EXEC-101',
    participants: [
      { userId: 'u-1', status: 'accepted' },
      { userId: 'u-2', status: 'accepted' },
      { userId: 'u-4', status: 'accepted' },
      { userId: 'u-6', status: 'accepted' },
      { userId: 'u-7', status: 'accepted' }
    ],
    createdAt: '2026-08-30'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'u-3',
    type: 'new_task',
    title: 'لديك مهمة جديدة عاجلة 📌',
    message: 'قام أ. محمد علي بتكليفك بمهمة: "تصميم بوست العرض الجديد لشركة الدكتور"',
    linkType: 'chat',
    linkId: 'conv-1',
    isRead: false,
    createdAt: '10:30 ص'
  },
  {
    id: 'notif-2',
    userId: 'u-2',
    type: 'task_completed',
    title: 'مهمة تنتظر اعتمادك ✓',
    message: 'قامت أ. ريم خالد بإكمال مهمة "تجهيز تقرير الحملة الإعلانية الأسبوعية" بانتظار المراجعة والاعتماد.',
    linkType: 'task',
    linkId: 'task-2',
    isRead: false,
    createdAt: '01:45 م'
  },
  {
    id: 'notif-3',
    userId: 'u-3',
    type: 'meeting_invitation',
    title: 'دعوة لاجتماع فريق التسويق 🎥',
    message: 'تمت دعوتك لحضور اجتماع فريق التسويق الدوري اليوم الساعة 02:00 م',
    linkType: 'meeting',
    linkId: 'meet-1',
    isRead: true,
    createdAt: '09:00 ص'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'u-1',
    action: 'تسجيل دخول ناجح',
    category: 'auth',
    details: 'تم تسجيل دخول د. ياسر السعيد من عنوان IP موثوق.',
    timestamp: '2026-08-31 08:00 ص'
  },
  {
    id: 'log-2',
    userId: 'u-2',
    action: 'إنشاء مهمة جديدة',
    category: 'task',
    details: 'قام أ. محمد علي بتحويل رسالة محادثة إلى مهمة رقم DOC-TASK-1 وتعيينها للموظف أحمد محمد.',
    timestamp: '2026-08-31 10:30 ص'
  },
  {
    id: 'log-3',
    userId: 'u-1',
    action: 'اعتماد مهمة تقنية',
    category: 'task',
    details: 'اعتمد د. ياسر السعيد اكتمال مهمة "تحديث سيرفرات قاعدة البيانات".',
    timestamp: '2026-08-30 05:45 م'
  },
  {
    id: 'log-4',
    userId: 'u-3',
    action: 'تسجيل حضور صباحي',
    category: 'attendance',
    details: 'سجل أ. أحمد محمد حضوره في تمام الساعة 08:45 ص.',
    timestamp: '2026-08-31 08:45 ص'
  }
];
