import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  UserCheck, 
  AlertCircle, 
  Briefcase, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const AttendanceView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    attendanceRecords, 
    clockIn, 
    clockOut, 
    todayAttendance 
  } = useWorkspace();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceNote, setAttendanceNote] = useState('');
  const [gpsReady, setGpsReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const userRecords = attendanceRecords.filter(r => r.userId === currentUser.id);
  const isPresent = todayAttendance && !todayAttendance.checkOutTime;
  const isCheckedOut = todayAttendance && todayAttendance.checkOutTime;

  // Department attendance for manager / admin
  const isManager = currentUser.role === 'super_admin' || currentUser.role === 'dept_manager' || currentUser.role === 'supervisor';
  const todayAllAttendance = attendanceRecords.filter(r => r.date === todayStr);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-y-auto p-4 sm:p-6 select-none" id="attendance-view-pane">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-lg bg-slate-900 text-white">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">الحضور والانصراف الذكي</h1>
            <p className="text-xs text-slate-500">تسجيل ومتابعة ساعات العمل الرسمية لشركة الدكتور (متاح من أي مكان)</p>
          </div>
        </div>

        {/* Live Digital Clock */}
        <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-400 font-medium block">الوقت الحالي (بتوقيت مكة)</span>
          <span className="text-base font-bold text-slate-900 font-mono">
            {currentTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </span>
        </div>
      </div>

      {/* Main Check-In Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Clock In / Out Action Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">سجل اليوم: {todayStr}</span>
              <span className={`px-3 py-1 rounded-md text-xs font-semibold ${
                isPresent 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : isCheckedOut 
                  ? 'bg-slate-100 text-slate-800 border border-slate-200' 
                  : 'bg-slate-50 text-slate-600 border border-slate-200'
              }`}>
                {isPresent ? 'حاضر الآن 🟢' : isCheckedOut ? 'تم الانصراف لليوم ✓' : 'لم يتم تسجيل الحضور بعد'}
              </span>
            </div>

            {/* Employee status greeting */}
            <div>
              <h2 className="text-base font-bold text-slate-900">
                مرحباً {currentUser.name} ({currentUser.jobTitle})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                سياسة شركة الدكتور تدعم مرونة العمل من المقر أو عن بعد مع الاحتفاظ بساعات العمل الموثقة.
              </p>
            </div>

            {/* Note input for check-in */}
            {!todayAttendance && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ملاحظة الحضور (اختياري - مثلاً: عمل من المقر / عمل عن بعد):</label>
                <input
                  type="text"
                  value={attendanceNote}
                  onChange={(e) => setAttendanceNote(e.target.value)}
                  placeholder="مثال: من المقر الرئيسي - مكتب التسويق"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-slate-400 outline-none text-slate-900"
                />
              </div>
            )}

            {/* Today Summary Times if present */}
            {todayAttendance && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">وقت الحضور:</span>
                  <span className="font-bold text-emerald-700 text-sm">{todayAttendance.checkInTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">وقت الانصراف:</span>
                  <span className="font-bold text-slate-800 text-sm">{todayAttendance.checkOutTime || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5 font-medium">إجمالي ساعات العمل:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {todayAttendance.totalWorkingMinutes ? `${Math.floor(todayAttendance.totalWorkingMinutes / 60)} ساعة` : 'جاري الحساب...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            {!todayAttendance ? (
              <button
                onClick={() => clockIn(attendanceNote || 'حضور نظامي')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
                id="btn-clock-in"
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>تسجيل حضور اليوم</span>
              </button>
            ) : !todayAttendance.checkOutTime ? (
              <button
                onClick={clockOut}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
                id="btn-clock-out"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تسجيل انصراف اليوم</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>تم إتمام ساعات عمل اليوم بنجاح ✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Future GPS / Policy Info Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>جاهزية التحقق المكاني (GPS Geofencing)</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              هيكل النظام مهيأ بالكامل لربط نطاقات المواقع الجغرافية (Geofencing) مستقبلاً. حالياً يعمل النظام بالسياسة المرنة المعتمدة من الإدارة.
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="font-semibold text-slate-900 block mb-1">سياسة الحضور الرسمية:</span>
              <p className="text-slate-600">دوام 8 ساعات يومياً مع إمكانية التنسيق مع المدير المباشر للعمل الخارجي.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>حالة الاتصال بالخادم:</span>
            <span className="text-emerald-600 font-semibold">مستقر وموثق ✓</span>
          </div>
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-900" />
            <h3 className="font-bold text-slate-900 text-sm">
              {isManager ? 'سجل حضور فريق شركة الدكتور' : 'سجل حضوري وانصرافي السابق'}
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                <th className="pb-3 pr-2">الموظف</th>
                <th className="pb-3">التاريخ</th>
                <th className="pb-3">وقت الحضور</th>
                <th className="pb-3">وقت الانصراف</th>
                <th className="pb-3">ساعات العمل</th>
                <th className="pb-3">الحالة والملاحظة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map(record => {
                const u = users.find(user => user.id === record.userId);
                return (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={u?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                          alt={u?.name || ''} 
                          className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-200" 
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{u?.name}</span>
                          <span className="text-[10px] text-slate-400">{u?.jobTitle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-slate-700">{record.date}</td>
                    <td className="py-3 font-mono font-semibold text-emerald-700">{record.checkInTime}</td>
                    <td className="py-3 font-mono text-slate-600">{record.checkOutTime || 'قيد العمل...'}</td>
                    <td className="py-3 font-mono text-slate-900 font-semibold">
                      {record.totalWorkingMinutes ? `${(record.totalWorkingMinutes / 60).toFixed(1)} ساعة` : '—'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        record.status === 'checked_out' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {record.notes || (record.status === 'checked_out' ? 'مكتمل' : 'حاضر')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
