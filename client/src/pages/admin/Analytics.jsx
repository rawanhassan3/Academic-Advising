import { useState, useEffect } from 'react';
import API from '../../services/api';

const Bar = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-gray-600 w-28 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-black text-[#1e3a5f] w-8 text-right">{value}</span>
    </div>
  );
};

const KpiCard = ({ label, value, emoji, trend, bg }) => (
  <div className={`${bg} rounded-2xl p-5 shadow-sm border border-white/60`}>
    <div className="flex items-start justify-between">
      <span className="text-3xl">{emoji}</span>
      {trend !== undefined && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-black text-[#1e3a5f] mt-2">{value}</p>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-0.5">{label}</p>
  </div>
);

export default function Analytics() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a5f]" />
    </div>
  );

  const s = stats || {};
  const totalReqs = (s.pendingRequests || 0) + (s.approvedRequests || 0) + (s.rejectedRequests || 0);
  const approvalRate = totalReqs > 0 ? Math.round((s.approvedRequests / totalReqs) * 100) : 0;
  const rejectionRate = totalReqs > 0 ? Math.round((s.rejectedRequests / totalReqs) * 100) : 0;
  const assignedPct = s.totalStudents > 0 ? Math.round(((s.totalStudents - (s.unassignedStudents || 0)) / s.totalStudents) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-[#1e3a5f]">System Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Real-time overview of the Academic Advising System</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Students"   value={s.totalStudents || 0}   emoji="👥" bg="bg-blue-50"   trend={s.recentRegistrations} />
        <KpiCard label="Total Advisors"   value={s.totalAdvisors || 0}   emoji="🎓" bg="bg-green-50" />
        <KpiCard label="Total Courses"    value={s.totalCourses || 0}    emoji="📚" bg="bg-purple-50" />
        <KpiCard label="New This Week"    value={s.recentRegistrations || 0} emoji="🆕" bg="bg-amber-50" />
      </div>

      {/* Request Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-black text-[#1e3a5f] mb-4 uppercase tracking-wide">Request Summary</h2>
          <div className="space-y-3">
            <Bar label="Pending"  value={s.pendingRequests  || 0} max={totalReqs || 1} color="bg-yellow-400" />
            <Bar label="Approved" value={s.approvedRequests || 0} max={totalReqs || 1} color="bg-green-400"  />
            <Bar label="Rejected" value={s.rejectedRequests || 0} max={totalReqs || 1} color="bg-red-400"    />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Total Requests: <span className="font-black text-[#1e3a5f]">{totalReqs}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-black text-[#1e3a5f] mb-4 uppercase tracking-wide">Resolution Rates</h2>
          <div className="space-y-4">
            {[
              { label: 'Approval Rate',  value: approvalRate,  color: 'bg-green-400', sub: `${s.approvedRequests || 0} approved` },
              { label: 'Rejection Rate', value: rejectionRate, color: 'bg-red-400',   sub: `${s.rejectedRequests || 0} rejected` },
              { label: 'Pending Rate',   value: totalReqs > 0 ? 100 - approvalRate - rejectionRate : 0, color: 'bg-yellow-400', sub: `${s.pendingRequests || 0} pending` },
            ].map(({ label, value, color, sub }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-600">{label}</span>
                  <span className="font-black text-[#1e3a5f]">{value}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-black text-[#1e3a5f] mb-4 uppercase tracking-wide">Advisor Assignment</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f4f8" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e3a5f" strokeWidth="3"
                  strokeDasharray={`${assignedPct} ${100 - assignedPct}`} strokeDashoffset="0" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-black text-[#1e3a5f]">{assignedPct}%</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">Assigned</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">Assigned</span><span className="font-black text-[#1e3a5f]">{(s.totalStudents || 0) - (s.unassignedStudents || 0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Unassigned</span><span className="font-black text-red-500">{s.unassignedStudents || 0}</span></div>
            <div className="flex justify-between border-t border-gray-100 pt-2"><span className="font-bold text-gray-600">Total Students</span><span className="font-black text-[#1e3a5f]">{s.totalStudents || 0}</span></div>
          </div>
        </div>
      </div>

      {/* Course Enrollment */}
      {s.courseStats?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-black text-[#1e3a5f] mb-5">Course Enrollment Details</h2>
          <div className="space-y-4">
            {s.courseStats.map(c => (
              <div key={c.code} className="flex items-center gap-4">
                <div className="w-24 flex-shrink-0">
                  <p className="text-xs font-black text-[#1e3a5f]">{c.code}</p>
                  <p className="text-[10px] text-gray-400 truncate">{c.name}</p>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${c.percentage >= 90 ? 'bg-red-400' : c.percentage >= 70 ? 'bg-amber-400' : c.percentage >= 40 ? 'bg-blue-400' : 'bg-green-400'}`}
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-28 text-right flex-shrink-0">
                  <span className="text-xs font-black text-[#1e3a5f]">{c.enrolled}/{c.capacity}</span>
                  <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${c.percentage >= 90 ? 'bg-red-100 text-red-600' : c.percentage >= 70 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    {c.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100">
            {[['bg-red-400','≥90% Full'],['bg-amber-400','70–89%'],['bg-blue-400','40–69%'],['bg-green-400','<40%']].map(([bg,label])=>(
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${bg}`} />
                <span className="text-[10px] text-gray-500 font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-black text-[#1e3a5f] mb-4">System Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Students', s.totalStudents || 0, '👥'],
            ['Advisors', s.totalAdvisors || 0, '🎓'],
            ['Courses',  s.totalCourses  || 0, '📚'],
            ['Requests', totalReqs,            '📋'],
          ].map(([l, v, e]) => (
            <div key={l} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl mb-1">{e}</p>
              <p className="text-xl font-black text-[#1e3a5f]">{v}</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
