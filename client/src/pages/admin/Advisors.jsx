import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function AdminAdvisors() {
  const [advisors, setAdvisors] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState(null);
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', department: '' });
  const notify = (msg,type='success')=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  const load   = ()=>API.get('/users/advisors').then(r=>setAdvisors(r.data));
  useEffect(()=>{ load().catch(console.error).finally(()=>setLoading(false)); },[]);

  const saveEdit = async () => {
    if (!editForm.name || !editForm.email) return notify('Name and Email are required', 'error');
    const allowedDomains = ['@msa.edu.eg', '@gmail.com', '@test.com'];
    const isAllowed = allowedDomains.some(domain => editForm.email.endsWith(domain));
    if (!isAllowed) return notify('Invalid email domain. Use MSA, Gmail, or Test email.', 'error');
    try {
      await API.put(`/users/${editId}`, editForm);
      await load();
      setEditId(null);
      notify('Advisor updated successfully');
    } catch (e) { notify(e.response?.data?.message || 'Update failed', 'error'); }
  };

  const del = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advisor?')) return;
    try { await API.delete(`/users/${id}`); await load(); notify('Advisor deleted successfully.'); }
    catch(e){ notify('Failed to delete advisor','error'); }
  };

  const filtered = advisors.filter(a=>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a5f]"/></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm ${toast.type==='error'?'bg-red-500':'bg-green-500'} text-white`}>{toast.msg}</div>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="text-2xl font-black text-[#1e3a5f]">Manage Advisors</h1><p className="text-sm text-gray-500">{advisors.length} advisors in the system</p></div>
        <div className="flex gap-3">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search advisors…"
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f] w-60"/>
          <Link to="/admin/add-advisor" className="px-5 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold hover:bg-[#163050] transition-colors flex items-center gap-2">
            <span>+</span> Add Advisor
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 font-semibold mb-3">No advisors found.</p>
          <Link to="/admin/add-advisor" className="px-5 py-2 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold">Add First Advisor</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a=>(
            <div key={a._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5490] flex items-center justify-center text-white font-black text-base">
                    {a.name?.charAt(0)}
                  </div>
                  <div>
                    {editId === a._id ? (
                      <div className="space-y-2 mb-2">
                        <input value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} className="px-2 py-1 border border-gray-200 rounded-lg text-xs w-full font-bold" placeholder="Name"/>
                        <input value={editForm.email} onChange={e=>setEditForm({...editForm,email:e.target.value})} className="px-2 py-1 border border-gray-200 rounded-lg text-xs w-full" placeholder="Email"/>
                        <input value={editForm.department} onChange={e=>setEditForm({...editForm,department:e.target.value})} className="px-2 py-1 border border-gray-200 rounded-lg text-xs w-full" placeholder="Department"/>
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="flex-1 py-1 bg-green-500 text-white rounded-lg text-[10px] font-bold">Save</button>
                          <button onClick={()=>setEditId(null)} className="flex-1 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-black text-[#1e3a5f] text-sm">{a.name}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full uppercase tracking-wide">Advisor</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 relative z-20">
                  <button onClick={()=>{setEditId(a._id); setEditForm({name:a.name, email:a.email, department:a.department||''});}} className="p-1.5 text-amber-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <div 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Click detected for advisor:', a._id);
                      del(a._id);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-all active:scale-90"
                    title="Delete Advisor"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2"><span>✉️</span><span>{a.email}</span></div>
                {a.universityId && <div className="flex items-center gap-2"><span>🪪</span><span className="font-mono">{a.universityId}</span></div>}
                {a.department && <div className="flex items-center gap-2"><span>🏛️</span><span>{a.department}</span></div>}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Joined {new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
