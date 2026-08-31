import React, { useState } from 'react';
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
    <WorkspaceProvider>
      <WorkspaceMainLayout />
    </WorkspaceProvider>
  );
}
