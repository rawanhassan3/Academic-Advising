import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const StatCard = ({ label, value, emoji, bg, sub }) => (
  <div className={`${bg} rounded-2xl p-5 shadow-sm border border-white/60 flex items-start gap-4 hover:shadow-md transition-shadow`}>
    <span className="text-3xl mt-0.5">{emoji}</span>
    <div><p className="text-2xl font-black text-[#1e3a5f]">{value}</p><p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>{sub&&<p className="text-xs text-gray-400 mt-0.5">{sub}</p>}</div>
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    API.get('/admin/stats').then(r=>setStats(r.data)).catch(console.error).finally(()=>setLoading(false));
  },[]);

  const quickLinks = [
    { label:'Manage Students', icon:'👥', path:'/admin/students', color:'from-blue-500 to-blue-600' },
    { label:'Manage Advisors', icon:'🎓', path:'/admin/advisors', color:'from-green-500 to-green-600' },
    { label:'Manage Courses',  icon:'📚', path:'/admin/courses',  color:'from-purple-500 to-purple-600' },
    { label:'View Requests',   icon:'📋', path:'/admin/requests', color:'from-amber-500 to-amber-600' },
    { label:'Add Advisor',     icon:'➕', path:'/admin/add-advisor', color:'from-teal-500 to-teal-600' },
    { label:'Analytics',       icon:'📊', path:'/admin/analytics',  color:'from-rose-500 to-rose-600' },
  ];

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a5f]"/></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5490] text-white p-7 rounded-2xl shadow-lg flex items-center justify-between gap-4">
        <div>
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Admin Control Panel</p>
          <h1 className="text-2xl font-black">Welcome, <span className="text-[#f0b952]">{user?.name?.split(' ')[0]}</span>!</h1>
          <p className="text-blue-200 text-xs mt-1">Full system access • Academic Advising System</p>
        </div>
        <div className="hidden md:flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl border border-white/20 text-3xl">🛡️</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Students"  value={stats?.totalStudents||0}  emoji="👥" bg="bg-blue-50"   sub={`${stats?.recentRegistrations||0} this week`}/>
        <StatCard label="Advisors"        value={stats?.totalAdvisors||0}  emoji="🎓" bg="bg-green-50"/>
        <StatCard label="Courses"         value={stats?.totalCourses||0}   emoji="📚" bg="bg-purple-50"/>
        <StatCard label="Pending Requests"value={stats?.pendingRequests||0}emoji="⏳" bg="bg-amber-50"  sub="Need review"/>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Requests"  value={stats?.totalRequests||0}  emoji="📋" bg="bg-gray-50"/>
        <StatCard label="Approved"        value={stats?.approvedRequests||0}emoji="✅" bg="bg-green-50"/>
        <StatCard label="Rejected"        value={stats?.rejectedRequests||0}emoji="❌" bg="bg-red-50"/>
        <StatCard label="Unassigned Stds" value={stats?.unassignedStudents||0}emoji="⚠️" bg="bg-yellow-50" sub="No advisor"/>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-base font-black text-[#1e3a5f] mb-3">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map(({label,icon,path,color})=>(
            <Link key={path} to={path} className={`bg-gradient-to-br ${color} text-white p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-center`}>
              <div className="text-3xl mb-2">{icon}</div>
              <p className="text-xs font-bold leading-tight">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Course Enrollment */}
      {stats?.courseStats?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-black text-[#1e3a5f] mb-4">Course Enrollment Overview</h2>
          <div className="space-y-3">
            {stats.courseStats.slice(0,6).map(c=>(
              <div key={c.code} className="flex items-center gap-4">
                <div className="w-20 flex-shrink-0"><p className="text-xs font-black text-[#1e3a5f] truncate">{c.code}</p></div>
                <div className="flex-1"><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${c.percentage>=80?'bg-red-400':c.percentage>=50?'bg-amber-400':'bg-green-400'}`} style={{width:`${c.percentage}%`}}/></div></div>
                <div className="w-24 text-right flex-shrink-0"><p className="text-xs text-gray-500">{c.enrolled}/{c.capacity} <span className="font-bold">({c.percentage}%)</span></p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
