import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const StatusBadge = ({ status }) => {
  const cls = { pending:'bg-yellow-50 text-yellow-700 border-yellow-200', approved:'bg-green-50 text-green-700 border-green-200', rejected:'bg-red-50 text-red-700 border-red-200' }[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${cls}`}>{status}</span>;
};

export default function AdvisorDashboard() {
  const { user } = useAuth();
  const [tab, setTab]           = useState('overview');
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState(null);
  const [noteForm, setNoteForm] = useState({ requestId:'', note:'' });
  const [processing, setProcessing] = useState(null);

  const location = useLocation();

  // Sync tab with URL hash for Sidebar navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) {
      setTab('overview');
    } else if (['overview', 'students', 'requests', 'notes', 'progress'].includes(hash)) {
      setTab(hash === 'notes' || hash === 'progress' ? 'overview' : hash);
    }
  }, [location.hash]);

  const notify = (msg, type = 'success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  useEffect(()=>{
    (async()=>{
      try {
        const [s,r] = await Promise.all([API.get('/users/students'), API.get('/requests/advisor')]);
        setStudents(s.data); setRequests(r.data);
      } catch(e){ console.error(e); } finally { setLoading(false); }
    })();
  },[]);

  const handleDecision = async (id, action, note='') => {
    setProcessing(id);
    try {
      await API.put(`/requests/${id}/${action}`, { advisorNote: note });
      const r = await API.get('/requests/advisor');
      setRequests(r.data);
      setNoteForm({ requestId:'', note:'' });
      notify(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
    } catch(e){ notify('Action failed','error'); } finally { setProcessing(null); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a5f]"/></div>;

  const pending  = requests.filter(r=>r.status==='pending');
  const approved = requests.filter(r=>r.status==='approved');
  const rejected = requests.filter(r=>r.status==='rejected');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm ${toast.type==='error'?'bg-red-500':'bg-green-500'} text-white`}>{toast.msg}</div>}

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#14532d] to-[#166534] text-white p-7 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-green-200 text-[10px] font-bold uppercase tracking-widest mb-1">Advisor Portal</p>
          <h1 className="text-2xl font-black">Welcome, <span className="text-[#f0b952]">{user?.name?.split(' ')[0]}</span>!</h1>
          <p className="text-green-200 text-xs mt-1">Academic Advising System — Advisor Panel</p>
        </div>
        <div className="flex gap-3">
          {[['Students',students.length],['Pending',pending.length],['Approved',approved.length]].map(([k,v])=>(
            <div key={k} className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-center">
              <p className="text-[9px] text-green-200 uppercase tracking-widest font-bold">{k}</p>
              <p className="text-white font-black text-sm">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {['overview','students','requests'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${tab===t?'bg-[#1e3a5f] text-white shadow':'text-gray-500 hover:text-[#1e3a5f]'}`}>
            {t}{t==='requests'&&pending.length>0?` (${pending.length})`:''}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==='overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[['My Students',students.length,'👥','bg-blue-50'],['Pending',pending.length,'⏳','bg-yellow-50'],['Approved',approved.length,'✅','bg-green-50'],['Rejected',rejected.length,'❌','bg-red-50']].map(([l,v,e,b])=>(
              <div key={l} className={`${b} rounded-2xl p-5 flex items-center gap-4 shadow-sm`}>
                <span className="text-3xl">{e}</span>
                <div><p className="text-2xl font-black text-[#1e3a5f]">{v}</p><p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{l}</p></div>
              </div>
            ))}
          </div>

          {/* Pending requests quick view */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black text-[#1e3a5f]">Pending Requests</h2>
              <button onClick={()=>setTab('requests')} className="text-xs text-[#1e3a5f] font-bold hover:underline">View all →</button>
            </div>
            {pending.length===0 ? <p className="text-gray-400 text-sm text-center py-6">No pending requests. 🎉</p> : (
              <div className="space-y-3">
                {pending.slice(0,5).map(r=>(
                  <div key={r._id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-100 rounded-xl gap-4">
                    <div>
                      <p className="font-bold text-sm text-[#1e3a5f]">{r.subject}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{r.student?.name} • {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={()=>handleDecision(r._id,'approve')} disabled={processing===r._id}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 disabled:opacity-50">Approve</button>
                      <button onClick={()=>handleDecision(r._id,'reject')} disabled={processing===r._id}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 disabled:opacity-50">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STUDENTS */}
      {tab==='students' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-black text-[#1e3a5f] mb-4">My Assigned Students ({students.length})</h2>
          {students.length===0 ? <p className="text-gray-400 text-sm text-center py-8">No students assigned yet.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  {['Name','University ID','Email','GPA','Semester',''].map(h=><th key={h} className="pb-3 pr-4">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map(s=>(
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-[#1e3a5f] text-xs font-black">{s.name?.charAt(0)}</div><span className="font-semibold text-[#1e3a5f]">{s.name}</span></div></td>
                      <td className="py-3 pr-4 font-mono text-xs text-gray-500">{s.universityId||'—'}</td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">{s.email}</td>
                      <td className="py-3 pr-4"><span className="font-black text-[#c8922a]">{(s.gpa||0).toFixed(2)}</span></td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">{s.semester||'—'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${(s.gpa||0)>=3?'bg-green-100 text-green-700':(s.gpa||0)>=2?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>
                          {(s.gpa||0)>=3?'Good Standing':(s.gpa||0)>=2?'Satisfactory':'At Risk'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* REQUESTS */}
      {tab==='requests' && (
        <div className="space-y-4">
          {requests.length===0 ? <p className="text-gray-400 text-sm text-center py-8 bg-white rounded-2xl">No requests found.</p> : requests.map(r=>(
            <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-[#1e3a5f] text-sm">{r.subject}</p>
                    <StatusBadge status={r.status}/>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">👤 {r.student?.name} ({r.student?.universityId||'N/A'}) • {new Date(r.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs capitalize text-gray-400 mt-0.5">{r.type?.replace(/_/g,' ')}</p>
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-xl">{r.description}</p>
                  {r.advisorNote && <p className="text-xs text-gray-600 mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100"><span className="font-bold">Your note:</span> {r.advisorNote}</p>}
                </div>
                {r.status==='pending' && (
                  <div className="flex flex-col gap-2 flex-shrink-0 min-w-[200px]">
                    {noteForm.requestId===r._id ? (
                      <div className="space-y-2">
                        <textarea rows={2} placeholder="Add a note (optional)..." value={noteForm.note}
                          onChange={e=>setNoteForm({requestId:r._id,note:e.target.value})}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#1e3a5f] resize-none"/>
                        <div className="flex gap-2">
                          <button onClick={()=>handleDecision(r._id,'approve',noteForm.note)} disabled={processing===r._id}
                            className="flex-1 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 disabled:opacity-50">Approve</button>
                          <button onClick={()=>handleDecision(r._id,'reject',noteForm.note)} disabled={processing===r._id}
                            className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 disabled:opacity-50">Reject</button>
                        </div>
                        <button onClick={()=>setNoteForm({requestId:'',note:''})} className="w-full text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={()=>setNoteForm({requestId:r._id,note:''})} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-xs font-bold hover:bg-[#163050]">Review Request</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
