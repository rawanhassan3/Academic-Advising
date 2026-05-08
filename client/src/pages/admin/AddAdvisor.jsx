import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

export default function AddAdvisor() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name:'', email:'', universityId:'' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Name, email, and password are required.'); return; }
    if (!form.email.endsWith('@msa.edu.eg' || '@gmail.com'|| '@test.com')) {
      setError('Only MSA University emails (@msa.edu.eg) are allowed.');
      return;
    }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await API.post('/users/advisor', form);
      setSuccess(`Advisor account created for ${res.data.name} successfully.`);
      setForm({ name:'', email:'', universityId:'', password:'' });
    } catch(err){
      setError(err.response?.data?.message || 'Failed to create advisor account.');
    } finally { setLoading(false); }
  };

  const Field = ({ label, name, type='text', placeholder, required=false, pattern, maxLength }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wide">{label}{required&&<span className="text-red-400 ml-0.5">*</span>}</label>
      <input type={type} name={name} placeholder={placeholder} required={required} pattern={pattern} maxLength={maxLength}
        value={form[name]} onChange={e=>{ setError(''); setForm({...form,[name]:e.target.value}); }}
        className="w-full px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f] transition-all font-medium text-gray-700"/>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-[#1e3a5f]">Add New Advisor</h1>
        <p className="text-sm text-gray-500 mt-0.5">Create an advisor account. A secure password will be auto-generated and emailed.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Info notice */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
          <span className="text-blue-500 text-lg mt-0.5">ℹ️</span>
          <div>
            <p className="text-sm font-bold text-blue-700">Advisor Account Creation</p>
            <p className="text-xs text-blue-600 mt-0.5">Enter the advisor's details and set a password manually. The advisor role is assigned automatically.</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold">{error}</div>
        )}
        {success && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 font-bold text-sm">✅ Success!</p>
            <p className="text-green-600 text-sm mt-1">{success}</p>
            <button onClick={()=>navigate('/admin/advisors')} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700">View All Advisors →</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Full Name"      name="name"         placeholder="Dr. Ahmed Hassan"  required />
            <Field label="Email Address"  name="email"        type="email" placeholder="advisor@msa.edu.eg" required />
            <Field label="University ID (optional)" name="universityId" placeholder="6-digit ID" maxLength="6" pattern="\d{0,6}" />
            <Field label="Password" name="password" type="password" placeholder="••••••••" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-50 mt-6">
            {/* Role display (read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wide">Account Role</label>
              <div className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-green-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Advisor (Fixed)
              </div>
            </div>

            <div className="flex items-end gap-3">
              <button type="submit" disabled={loading}
                className="flex-1 py-3 bg-[#1e3a5f] text-white rounded-2xl font-black uppercase tracking-[0.15em] text-xs hover:bg-[#163050] active:scale-[0.98] transition-all shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 h-[46px]">
                {loading && <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>}
                {loading ? 'CREATING...' : 'CREATE ADVISOR'}
              </button>
              <button type="button" onClick={()=>navigate('/admin/advisors')}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-200 transition-colors h-[46px]">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
