import { useState, useEffect } from 'react';
import API from '../../services/api';

const StatusBadge = ({ status }) => {
  const cls = { pending:'bg-yellow-50 text-yellow-700 border-yellow-200', approved:'bg-green-50 text-green-700 border-green-200', rejected:'bg-red-50 text-red-700 border-red-200' }[status]||'bg-gray-50 text-gray-600 border-gray-200';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${cls}`}>{status}</span>;
};

export default function AdminRequests() {
  const [requests,   setRequests]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');
  const [search,     setSearch]     = useState('');
  const [toast,      setToast]      = useState(null);
  const [processing, setProcessing] = useState(null);
  const [noteMap,    setNoteMap]    = useState({});

  const notify = (msg,type='success')=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  const load   = ()=>API.get('/requests').then(r=>setRequests(r.data));

  useEffect(()=>{ load().catch(console.error).finally(()=>setLoading(false)); },[]);

  const decide = async (id, action) => {
    setProcessing(id);
    try {
      await API.put(`/requests/${id}/${action}`, { advisorNote: noteMap[id]||'' });
      await load(); notify(`Request ${action==='approve'?'approved':'rejected'}.`);
    } catch(e){ notify('Failed','error'); } finally { setProcessing(null); }
  };

  const filtered = requests.filter(r=>{
    const matchStatus = filter==='all' || r.status===filter;
    const matchSearch = !search ||
      r.subject?.toLowerCase().includes(search.toLowerCase()) ||
      r.student?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = { all:requests.length, pending:requests.filter(r=>r.status==='pending').length, approved:requests.filter(r=>r.status==='approved').length, rejected:requests.filter(r=>r.status==='rejected').length };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a5f]"/></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm ${toast.type==='error'?'bg-red-500':'bg-green-500'} text-white`}>{toast.msg}</div>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="text-2xl font-black text-[#1e3a5f]">All Requests</h1><p className="text-sm text-gray-500">{requests.length} total requests</p></div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by student or subject…"
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f] w-72"/>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(counts).map(([k,v])=>(
          <button key={k} onClick={()=>setFilter(k)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${filter===k?'bg-[#1e3a5f] text-white shadow':'bg-white text-gray-500 border border-gray-100 hover:border-gray-300'}`}>
            {k} ({v})
          </button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 font-semibold">No requests match your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r=>(
            <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-black text-[#1e3a5f] text-sm">{r.subject}</p>
                    <StatusBadge status={r.status}/>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full capitalize">{r.type?.replace(/_/g,' ')}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                    <span>👤 <strong className="text-gray-600">{r.student?.name}</strong> ({r.student?.universityId||'N/A'})</span>
                    {r.advisor && <span>🎓 <strong className="text-gray-600">{r.advisor?.name}</strong></span>}
                    <span>📅 {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-xl leading-relaxed">{r.description}</p>
                  {r.advisorNote && <p className="text-xs mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100 text-gray-600"><strong className="text-[#1e3a5f]">Advisor note:</strong> {r.advisorNote}</p>}
                </div>

                {r.status==='pending' && (
                  <div className="flex flex-col gap-2 flex-shrink-0 min-w-[220px]">
                    <textarea rows={2} placeholder="Add a note (optional)…"
                      value={noteMap[r._id]||''} onChange={e=>setNoteMap({...noteMap,[r._id]:e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#1e3a5f] resize-none"/>
                    <div className="flex gap-2">
                      <button onClick={()=>decide(r._id,'approve')} disabled={processing===r._id}
                        className="flex-1 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 disabled:opacity-50">✓ Approve</button>
                      <button onClick={()=>decide(r._id,'reject')} disabled={processing===r._id}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 disabled:opacity-50">✗ Reject</button>
                    </div>
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
