import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { ChatView } from './components/chat/ChatView';
import { TasksView } from './components/tasks/TasksView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { LeavesView } from './components/leaves/LeavesView';
import { MeetingsView } from './components/meetings/MeetingsView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { VoiceCallModal } from './components/calls/VoiceCallModal';
import { VideoCallModal } from './components/calls/VideoCallModal';
import { GroupMeetingModal } from './components/calls/GroupMeetingModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { UserProfileModal } from './components/common/UserProfileModal';
import { RefreshCw, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class WorkspaceErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Workspace Uncaught Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-[#0f172a] text-white p-6 select-none" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
            <div className="w-20 h-20 mb-5 relative flex items-center justify-center">
              <img src="/logo.svg" alt="Doctor Workspace Logo" className="w-full h-full object-contain" />
            </div>

            <h1 className="text-xl font-bold text-white mb-2">مساحة عمل الدكتور</h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              حدث خطأ غير متوقع أثناء تحميل البيانات. يمكنك إعادة تحميل الصفحة أو إعادة ضبط البيانات الافتراضية.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition-colors cursor-pointer text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة التحميل
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                إعادة ضبط البيانات
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const WorkspaceMainLayout: React.FC = () => {
  const { 
    activeTab, 
    activeCall, 
    activeMeetingId, 
    endCall, 
    toggleMute, 
    toggleVideo, 
    leaveMeetingRoom 
  } = useWorkspace();

  const [selectedTaskIdForModal, setSelectedTaskIdForModal] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f8fafc] text-slate-900 overflow-hidden" dir="rtl" id="doctor-workspace-root">
      {/* Top Application Header */}
      <Header onOpenProfile={() => setShowProfileModal(true)} />

      {/* Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Navigation Sidebar */}
        <Sidebar onOpenProfile={() => setShowProfileModal(true)} />

        {/* Dynamic Content View Based on Active Tab */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          {activeTab === 'chats' && (
            <ChatView onOpenTaskDetails={(taskId) => setSelectedTaskIdForModal(taskId)} />
          )}
          {activeTab === 'tasks' && (
            <TasksView />
          )}
          {activeTab === 'attendance' && (
            <AttendanceView />
          )}
          {activeTab === 'leaves' && (
            <LeavesView />
          )}
          {activeTab === 'meetings' && (
            <MeetingsView />
          )}
          {activeTab === 'announcements' && (
            <AnnouncementsView />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Voice Call Active Modal */}
      {activeCall && !activeCall.isVideo && (
        <VoiceCallModal
          call={activeCall}
          onEndCall={endCall}
          onToggleMute={toggleMute}
        />
      )}

      {/* Video Call Active Modal */}
      {activeCall && activeCall.isVideo && (
        <VideoCallModal
          call={activeCall}
          onEndCall={endCall}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
        />
      )}

      {/* Group Meeting Active Room Modal */}
      {activeMeetingId && (
        <GroupMeetingModal
          meetingId={activeMeetingId}
          onLeave={leaveMeetingRoom}
        />
      )}

      {/* Global Task Details Modal */}
      {selectedTaskIdForModal && (
        <TaskDetailModal
          taskId={selectedTaskIdForModal}
          onClose={() => setSelectedTaskIdForModal(null)}
        />
      )}

      {/* User Profile / Switcher Modal */}
      {showProfileModal && (
        <UserProfileModal
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceErrorBoundary>
      <WorkspaceProvider>
        <WorkspaceMainLayout />
      </WorkspaceProvider>
    </WorkspaceErrorBoundary>
  );
}
