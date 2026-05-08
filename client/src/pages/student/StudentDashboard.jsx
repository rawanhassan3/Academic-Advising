import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const StatusBadge = ({ status }) => {
  const cls = { pending:'bg-yellow-50 text-yellow-700 border-yellow-200', approved:'bg-green-50 text-green-700 border-green-200', rejected:'bg-red-50 text-red-700 border-red-200' }[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${cls}`}>{status}</span>;
};

const StatCard = ({ label, value, emoji, bg }) => (
  <div className={`${bg} rounded-2xl p-5 flex items-center gap-4 shadow-sm`}>
    <span className="text-3xl">{emoji}</span>
    <div><p className="text-2xl font-black text-[#1e3a5f]">{value}</p><p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p></div>
  </div>
);

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tab, setTab]                     = useState('overview');
  const [courses, setCourses]             = useState([]);
  const [allCourses, setAllCourses]       = useState([]);
  const [requests, setRequests]           = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [enrolling, setEnrolling]         = useState(null);
  const [submitting, setSubmitting]       = useState(false);
  const [toast, setToast]                 = useState(null);
  const [reqForm, setReqForm]             = useState({ type:'other', subject:'', description:'' });

  const location = useLocation();

  // Update tab based on URL hash (for Sidebar navigation)
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) {
      setTab('overview');
    } else if (['overview', 'courses', 'requests', 'notifications', 'schedule', 'gpa'].includes(hash)) {
      setTab(hash === 'schedule' || hash === 'gpa' ? 'overview' : hash);
    }
  }, [location.hash]);

  const notify = (msg, type = 'success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  useEffect(() => {
    (async () => {
      try {
        const [c,a,r,n] = await Promise.all([
          API.get('/courses/my'), API.get('/courses'),
          API.get('/requests/my'), API.get('/admin/notifications/my'),
        ]);
        setCourses(c.data); setAllCourses(a.data); setRequests(r.data); setNotifications(n.data);
      } catch(e){ console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  const enroll = async (id) => {
    setEnrolling(id);
    try {
      await API.post(`/courses/${id}/enroll`);
      const [c,a] = await Promise.all([API.get('/courses/my'), API.get('/courses')]);
      setCourses(c.data); setAllCourses(a.data); notify('Enrolled successfully!');
    } catch(e){ notify(e.response?.data?.message||'Failed','error'); } finally { setEnrolling(null); }
  };

  const unenroll = async (id) => {
    try {
      await API.delete(`/courses/${id}/enroll`);
      const [c,a] = await Promise.all([API.get('/courses/my'), API.get('/courses')]);
      setCourses(c.data); setAllCourses(a.data); notify('Unenrolled.');
    } catch(e){ notify('Failed','error'); }
  };

  const submitReq = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/requests', reqForm);
      const r = await API.get('/requests/my');
      setRequests(r.data); setReqForm({type:'other',subject:'',description:''}); notify('Request submitted!');
    } catch(e){ notify(e.response?.data?.message||'Failed','error'); } finally { setSubmitting(false); }
  };

  const markRead = async (id) => {
    await API.put(`/admin/notifications/${id}/read`);
    setNotifications(p=>p.map(n=>n._id===id?{...n,read:true}:n));
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a5f]"/></div>;

  const enrolledIds = new Set(courses.map(c=>c._id));
  const unread = notifications.filter(n=>!n.read).length;
  const tabs = ['overview','courses','requests',`notifications${unread?` (${unread})`:''}`];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm ${toast.type==='error'?'bg-red-500':'bg-green-500'} text-white`}>{toast.msg}</div>}

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5490] text-white p-7 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Student Portal</p>
          <h1 className="text-2xl font-black">Welcome, <span className="text-[#f0b952]">{user?.name?.split(' ')[0]}</span>!</h1>
          <p className="text-blue-200 text-xs mt-1">Faculty of Computer Science • Academic Advising System</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {[['ID', user?.universityId||'—'],['GPA',(user?.gpa||0).toFixed(2)],['Courses',courses.length]].map(([k,v])=>(
            <div key={k} className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-center">
              <p className="text-[9px] text-blue-300 uppercase tracking-widest font-bold">{k}</p>
              <p className="text-white font-black text-sm">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit flex-wrap">
        {tabs.map(t=>{
          const id = t.split(' ')[0].toLowerCase();
          const active = tab===id||(tab==='notifications'&&t.startsWith('notifications'));
          return (
            <button key={t} onClick={()=>setTab(id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${active?'bg-[#1e3a5f] text-white shadow':'text-gray-500 hover:text-[#1e3a5f]'}`}>
              {t}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW */}
      {tab==='overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Enrolled Courses" value={courses.length} emoji="📚" bg="bg-blue-50" />
            <StatCard label="Current GPA"       value={(user?.gpa||0).toFixed(2)} emoji="🎯" bg="bg-amber-50" />
            <StatCard label="My Requests"       value={requests.length} emoji="📋" bg="bg-purple-50" />
            <StatCard label="Unread Notifs"     value={unread} emoji="🔔" bg="bg-green-50" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#1e3a5f] mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[['Register Course','📖','courses','from-blue-500 to-blue-600'],['Submit Request','📝','requests','from-purple-500 to-purple-600'],['Notifications','🔔','notifications','from-amber-500 to-amber-600'],['View Schedule','📅','courses','from-green-500 to-green-600']].map(([l,i,t,g])=>(
                <button key={l} onClick={()=>setTab(t)} className={`bg-gradient-to-br ${g} text-white p-5 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-left`}>
                  <div className="text-2xl mb-2">{i}</div>
                  <p className="text-sm font-bold">{l}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-black text-[#1e3a5f] mb-4">Recent Requests</h2>
            {requests.length===0 ? <p className="text-gray-400 text-sm text-center py-6">No requests yet.</p> : (
              <div className="space-y-3">
                {requests.slice(0,4).map(r=>(
                  <div key={r._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div><p className="font-bold text-sm text-[#1e3a5f]">{r.subject}</p><p className="text-xs text-gray-400 capitalize">{r.type.replace(/_/g,' ')} • {new Date(r.createdAt).toLocaleDateString()}</p></div>
                    <StatusBadge status={r.status}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* COURSES */}
      {tab==='courses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-black text-[#1e3a5f] mb-4">My Enrolled Courses ({courses.length})</h2>
            {courses.length===0 ? <p className="text-gray-400 text-sm text-center py-6">No enrolled courses.</p> : (
              <div className="grid md:grid-cols-2 gap-3">
                {courses.map(c=>(
                  <div key={c._id} className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-start">
                    <div><p className="font-black text-[#1e3a5f] text-sm">{c.code} — {c.name}</p><p className="text-xs text-gray-500 mt-0.5">{c.credits} credits{c.schedule ? ` • ${c.schedule}`:''}</p></div>
                    <button onClick={()=>unenroll(c._id)} className="text-xs text-red-500 hover:text-red-700 font-bold ml-2 flex-shrink-0">Drop</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-black text-[#1e3a5f] mb-4">Available Courses</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">{['Code','Name','Credits','Seats',''].map(h=><th key={h} className="pb-3 pr-4">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {allCourses.map(c=>{
                    const enrolled=enrolledIds.has(c._id), full=c.students.length>=c.capacity;
                    return (
                      <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4 font-black text-[#1e3a5f] text-xs">{c.code}</td>
                        <td className="py-3 pr-4 font-semibold">{c.name}</td>
                        <td className="py-3 pr-4 text-gray-500">{c.credits}</td>
                        <td className="py-3 pr-4 text-gray-500">{c.students.length}/{c.capacity}</td>
                        <td className="py-3">
                          {enrolled ? <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Enrolled ✓</span>
                            : full ? <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs font-bold">Full</span>
                            : <button onClick={()=>enroll(c._id)} disabled={enrolling===c._id} className="px-4 py-1.5 bg-[#1e3a5f] text-white rounded-full text-xs font-bold hover:bg-[#163050] disabled:opacity-50">{enrolling===c._id?'...':'Enroll'}</button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REQUESTS */}
      {tab==='requests' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-black text-[#1e3a5f] mb-4">Submit New Request</h2>
            <form onSubmit={submitReq} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Type</label>
                  <select value={reqForm.type} onChange={e=>setReqForm({...reqForm,type:e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f]">
                    {[['course_registration','Course Registration'],['schedule_change','Schedule Change'],['academic_note','Academic Note'],['grade_dispute','Grade Dispute'],['other','Other']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Subject</label>
                  <input value={reqForm.subject} onChange={e=>setReqForm({...reqForm,subject:e.target.value})} placeholder="Brief subject" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f]" /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Description</label>
                <textarea rows={3} value={reqForm.description} onChange={e=>setReqForm({...reqForm,description:e.target.value})} placeholder="Describe your request..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f] resize-none"/></div>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold hover:bg-[#163050] disabled:opacity-50">{submitting?'Submitting...':'Submit Request'}</button>
            </form>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-black text-[#1e3a5f] mb-4">Request History</h2>
            {requests.length===0 ? <p className="text-gray-400 text-sm text-center py-6">No requests yet.</p> : (
              <div className="space-y-3">
                {requests.map(r=>(
                  <div key={r._id} className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div><div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-sm text-[#1e3a5f]">{r.subject}</p><StatusBadge status={r.status}/></div>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{r.type.replace(/_/g,' ')} • {new Date(r.createdAt).toLocaleDateString()}</p>
                        {r.advisorNote && <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg"><span className="font-bold text-[#1e3a5f]">Note: </span>{r.advisorNote}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {tab==='notifications' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#1e3a5f]">Notifications</h2>
            {unread>0 && <button onClick={async()=>{await API.put('/admin/notifications/read-all');setNotifications(p=>p.map(n=>({...n,read:true})));}} className="text-xs text-[#1e3a5f] font-bold hover:underline">Mark all read</button>}
          </div>
          {notifications.length===0 ? <p className="text-gray-400 text-sm text-center py-6">No notifications.</p> : (
            <div className="space-y-3">
              {notifications.map(n=>(
                <div key={n._id} onClick={()=>!n.read&&markRead(n._id)} className={`p-4 rounded-xl border cursor-pointer transition-all ${n.read?'bg-gray-50 border-gray-100':'bg-blue-50 border-blue-200 hover:border-blue-300'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm font-bold ${n.read?'text-gray-600':'text-[#1e3a5f]'}`}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      {n.advisorNote && (
                        <p className="text-[11px] text-gray-600 mt-2 p-2 bg-white/50 rounded-lg border border-black/5">
                          <span className="font-bold text-[#1e3a5f]">Advisor Note: </span>{n.advisorNote}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1"/>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
