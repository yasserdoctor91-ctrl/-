import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Smile, 
  Camera, 
  Square, 
  Trash2, 
  Image as ImageIcon, 
  FileText,
  X
} from 'lucide-react';
import { MessageAttachment, VoiceNoteData } from '../../types';
import { soundManager } from '../../utils/sound';

interface MessageComposerProps {
  onSendMessage: (
    content: string, 
    type?: 'text' | 'image' | 'file' | 'voice', 
    attachments?: MessageAttachment[], 
    voiceNote?: VoiceNoteData
  ) => void;
  disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recordTimerRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['👍', '👌', '❤️', '🙏', '🔥', '✅', '👏', '🎯', '📌', '💼', '🚀', '⭐', '🤝', '⚡'];

  // Handle voice recording duration
  useEffect(() => {
    if (isRecording) {
      soundManager.playMessageTone();
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
    }
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [isRecording]);

  const handleSend = () => {
    if (isRecording) {
      // Send recorded voice note
      const simulatedWaveform = Array.from({ length: 14 }, () => Math.floor(20 + Math.random() * 80));
      onSendMessage(
        'رسالة صوتية',
        'voice',
        undefined,
        {
          durationSeconds: Math.max(1, recordSeconds),
          waveform: simulatedWaveform
        }
      );
      setIsRecording(false);
      setRecordSeconds(0);
      return;
    }

    if (!text.trim() && attachments.length === 0) return;

    if (attachments.length > 0 && !text.trim()) {
      const first = attachments[0];
      onSendMessage(first.name, first.type === 'image' ? 'image' : 'file', attachments);
    } else {
      onSendMessage(text, 'text', attachments.length > 0 ? attachments : undefined);
    }

    setText('');
    setAttachments([]);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'file' | 'image') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt: MessageAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: fileType === 'image' ? 'image' : 'file',
        url: URL.createObjectURL(file)
      };
      setAttachments(prev => [...prev, newAtt]);
      setShowAttachmentMenu(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative bg-white border-t border-slate-200 p-2 sm:p-3" id="message-composer-container">
      {/* Attachments preview strip */}
      {attachments.length > 0 && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-lg border border-slate-200 overflow-x-auto">
          {attachments.map(att => (
            <div key={att.id} className="relative flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-xs text-slate-800 shrink-0">
              <Paperclip className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-semibold max-w-[140px] truncate">{att.name}</span>
              <span className="text-[10px] text-slate-400">({att.size})</span>
              <button 
                onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                className="text-slate-400 hover:text-rose-600 p-0.5 rounded-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-4 z-30 bg-white p-3 rounded-xl shadow-xl border border-slate-200 flex flex-wrap gap-2 max-w-xs animate-in fade-in zoom-in-95">
          {emojis.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => setText(prev => prev + emoji)}
              className="text-xl hover:scale-125 transition-transform p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Menu Popup */}
      {showAttachmentMenu && (
        <div className="absolute bottom-16 right-12 z-30 bg-white p-2 rounded-xl shadow-xl border border-slate-200 flex flex-col gap-1 w-48 animate-in fade-in zoom-in-95 text-right">
          <button
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>صورة أو فيديو</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-700" />
            <span>مستند (PDF/Word/Excel)</span>
          </button>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => handleFileUpload(e, 'file')} 
      />
      <input 
        type="file" 
        ref={imageInputRef} 
        accept="image/*,video/*" 
        className="hidden" 
        onChange={(e) => handleFileUpload(e, 'image')} 
      />

      {/* Main Composer Bar */}
      <div className="flex items-center gap-2">
        {isRecording ? (
          /* Live Recording View */
          <div className="flex-1 flex items-center justify-between px-4 py-2 bg-rose-50 border border-rose-200 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
              <span className="text-xs font-bold text-rose-800">
                جاري تسجيل رسالة صوتية... {formatSeconds(recordSeconds)}
              </span>
            </div>
            <button
              onClick={() => {
                setIsRecording(false);
                setRecordSeconds(0);
              }}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-100 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>إلغاء</span>
            </button>
          </div>
        ) : (
          /* Regular Input View */
          <>
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="إيموجي"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="إرفاق ملف أو صورة"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالة أو توجيه عمل..."
                disabled={disabled}
                className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-slate-400 outline-none transition-all placeholder:text-slate-400"
                id="input-chat-message"
              />
            </div>
          </>
        )}

        {/* Send / Mic Action Button */}
        {text.trim() || attachments.length > 0 || isRecording ? (
          <button
            type="button"
            onClick={handleSend}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
            id="btn-send-message"
            title="إرسال"
          >
            {isRecording ? <Square className="w-5 h-5 fill-current text-emerald-400" /> : <Send className="w-5 h-5 rotate-180 text-emerald-400" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsRecording(true)}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
            id="btn-voice-recorder"
            title="تسجيل رسالة صوتية (Voice Note)"
          >
            <Mic className="w-5 h-5 text-emerald-400" />
          </button>
        )}
      </div>
    </div>
  );
};
