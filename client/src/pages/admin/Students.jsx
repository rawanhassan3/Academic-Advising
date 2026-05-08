import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function AdminStudents() {
  const [students,  setStudents]  = useState([]);
  const [advisors,  setAdvisors]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [selAdvisor,setSelAdvisor]= useState('');
  const [toast,     setToast]     = useState(null);
  const [editId,    setEditId]    = useState(null);
  const [editForm,  setEditForm]  = useState({});

  const notify = (msg,type='success')=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  const load = async () => {
    const [s,a] = await Promise.all([API.get('/users/students'), API.get('/users/advisors')]);
    setStudents(s.data); setAdvisors(a.data);
  };

  useEffect(()=>{ load().catch(console.error).finally(()=>setLoading(false)); },[]);

  const assignAdvisor = async () => {
    if (!selAdvisor) return;
    setAssigning(true);
    try {
      await API.put(`/users/${selected._id}/assign-advisor`, { advisorId: selAdvisor });
      await load(); setSelected(null); setSelAdvisor(''); notify('Advisor assigned!');
    } catch(e){ notify('Failed','error'); } finally { setAssigning(false); }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try { 
      await API.delete(`/users/${id}`); 
      await load(); 
      notify('Student deleted successfully.'); 
    } catch(e) { 
      const msg = e.response?.data?.message || 'Failed to delete student.';
      notify(msg, 'error'); 
    }
  };

  const saveEdit = async () => {
    try { 
      await API.put(`/users/${editId}`, editForm); 
      await load(); 
      setEditId(null); 
      notify('Updated successfully!'); 
    } catch(e) { 
      const msg = e.response?.data?.message || 'Update failed.';
      notify(msg, 'error'); 
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.universityId||'').includes(search)
  );

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a5f]"/></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm ${toast.type==='error'?'bg-red-500':'bg-green-500'} text-white`}>{toast.msg}</div>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="text-2xl font-black text-[#1e3a5f]">Manage Students</h1><p className="text-sm text-gray-500 mt-0.5">{students.length} registered students</p></div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email, ID…"
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/10 w-72"/>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Name','ID','Email','GPA','Advisor','Actions'].map(h=><th key={h} className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length===0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">No students found.</td></tr>
              ) : filtered.map(s=>(
                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center text-[#1e3a5f] text-xs font-black">{s.name?.charAt(0)}</div><span className="font-semibold text-[#1e3a5f]">{s.name}</span></div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{s.universityId||'—'}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{s.email}</td>
                  <td className="px-5 py-4"><span className="font-black text-[#c8922a]">{(s.gpa||0).toFixed(2)}</span></td>
                  <td className="px-5 py-4 text-xs text-gray-500">{s.advisor?.name||<span className="text-red-400 font-bold">Unassigned</span>}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      {editId===s._id ? (
                        <div className="flex flex-col gap-2 min-w-[200px] bg-gray-50 p-2 rounded-xl border border-gray-200">
                          <input value={editForm.name||''} onChange={e=>setEditForm({...editForm,name:e.target.value})} className="px-2 py-1 border border-gray-300 rounded-lg text-xs" placeholder="Name"/>
                          <input value={editForm.email||''} onChange={e=>setEditForm({...editForm,email:e.target.value})} className="px-2 py-1 border border-gray-300 rounded-lg text-xs" placeholder="Email"/>
                          <input type="number" step="0.01" value={editForm.gpa||0} onChange={e=>setEditForm({...editForm,gpa:+e.target.value})} className="px-2 py-1 border border-gray-300 rounded-lg text-xs" placeholder="GPA"/>
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="flex-1 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600">Save</button>
                            <button onClick={()=>setEditId(null)} className="flex-1 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={()=>{setSelected(s);setSelAdvisor('');}} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">Assign</button>
                          <button onClick={()=>{setEditId(s._id);setEditForm({name:s.name,email:s.email,gpa:s.gpa,department:s.department});}} className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100">Edit</button>
                          <button onClick={()=>deleteStudent(s._id)} className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100">Delete</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign advisor modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-black text-[#1e3a5f] mb-1">Assign Advisor</h2>
            <p className="text-sm text-gray-500 mb-4">Student: <strong>{selected.name}</strong></p>
            <select value={selAdvisor} onChange={e=>setSelAdvisor(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f] mb-4">
              <option value="">— Select an Advisor —</option>
              {advisors.map(a=><option key={a._id} value={a._id}>{a.name} ({a.email})</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={assignAdvisor} disabled={assigning||!selAdvisor} className="flex-1 py-2.5 bg-[#1e3a5f] text-white rounded-xl font-bold text-sm hover:bg-[#163050] disabled:opacity-50">{assigning?'Assigning...':'Assign Advisor'}</button>
              <button onClick={()=>setSelected(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
