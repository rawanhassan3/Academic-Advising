import { useState, useEffect } from 'react';
import API from '../../services/api';

const empty = { code:'', name:'', description:'', instructor:'', credits:3, capacity:30, schedule:'', semester:'', department:'' };

export default function AdminCourses() {
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(empty);
  const [editId,   setEditId]   = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState(null);

  const notify = (msg,type='success')=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
  const load   = ()=>API.get('/courses').then(r=>setCourses(r.data));

  useEffect(()=>{ load().catch(console.error).finally(()=>setLoading(false)); },[]);

  const openCreate = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit   = (c)  => { setForm({code:c.code,name:c.name,description:c.description,instructor:c.instructor,credits:c.credits,capacity:c.capacity,schedule:c.schedule,semester:c.semester,department:c.department}); setEditId(c._id); setShowForm(true); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) await API.put(`/courses/${editId}`, form);
      else        await API.post('/courses', form);
      await load(); setShowForm(false); setForm(empty); setEditId(null);
      notify(editId ? 'Course updated!' : 'Course created!');
    } catch(err){ notify(err.response?.data?.message||'Failed','error'); } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await API.delete(`/courses/${id}`); await load(); notify('Course deleted.'); }
    catch(e){ notify('Failed','error'); }
  };

  const filtered = courses.filter(c=>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a5f]"/></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-lg font-semibold text-sm ${toast.type==='error'?'bg-red-500':'bg-green-500'} text-white`}>{toast.msg}</div>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div><h1 className="text-2xl font-black text-[#1e3a5f]">Manage Courses</h1><p className="text-sm text-gray-500">{courses.length} total courses</p></div>
        <div className="flex gap-3">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses…"
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f] w-56"/>
          <button onClick={openCreate} className="px-5 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold hover:bg-[#163050] transition-colors">+ Add Course</button>
        </div>
      </div>

      {/* Course form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-black text-[#1e3a5f] mb-5">{editId?'Edit Course':'Create New Course'}</h2>
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Course Code *</label>
                  <input required value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} placeholder="e.g. CS101" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f]"/></div>
                <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Credits *</label>
                  <input required type="number" min={1} max={6} value={form.credits} onChange={e=>setForm({...form,credits:+e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f]"/></div>
              </div>
              <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Course Name *</label>
                <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Introduction to Programming" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f]"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Instructor</label>
                  <input value={form.instructor} onChange={e=>setForm({...form,instructor:e.target.value})} placeholder="Dr. Name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f]"/></div>
                <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Capacity</label>
                  <input type="number" min={1} value={form.capacity} onChange={e=>setForm({...form,capacity:+e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f]"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Schedule</label>
                  <input value={form.schedule} onChange={e=>setForm({...form,schedule:e.target.value})} placeholder="Mon/Wed 10:00–11:30" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f]"/></div>
                <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Semester</label>
                  <input value={form.semester} onChange={e=>setForm({...form,semester:e.target.value})} placeholder="Fall 2025" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f]"/></div>
              </div>
              <div><label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Course description…" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e3a5f] resize-none"/></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#1e3a5f] text-white rounded-xl font-bold text-sm hover:bg-[#163050] disabled:opacity-50">{saving?'Saving...':editId?'Update Course':'Create Course'}</button>
                <button type="button" onClick={()=>setShowForm(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filtered.length===0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 font-semibold mb-3">No courses found.</p>
          <button onClick={openCreate} className="px-5 py-2 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold">Create First Course</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Code','Course Name','Instructor','Credits','Enrollment','Schedule','Actions'].map(h=><th key={h} className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c=>{
                  const pct = c.capacity>0 ? Math.round((c.students.length/c.capacity)*100) : 0;
                  return (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-black text-[#1e3a5f] text-xs">{c.code}</td>
                      <td className="px-5 py-4 font-semibold">{c.name}</td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{c.instructor||'—'}</td>
                      <td className="px-5 py-4 text-gray-500">{c.credits}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct>=80?'bg-red-400':pct>=50?'bg-amber-400':'bg-green-400'}`} style={{width:`${pct}%`}}/></div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">{c.students.length}/{c.capacity}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">{c.schedule||'—'}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button onClick={()=>openEdit(c)} className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100">Edit</button>
                          <button onClick={()=>del(c._id)} className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
