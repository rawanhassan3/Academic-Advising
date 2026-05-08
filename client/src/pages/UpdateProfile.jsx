import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const UpdateProfile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    universityId: user?.universityId || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await API.put('/users/profile', profileForm);
      const token = localStorage.getItem('token');
      login(res.data, token);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Update failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await API.put('/users/profile', { password: passwordForm.password });
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setPasswordForm({ password: '', confirmPassword: '' });
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Change password failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#1e3a5f]">Edit Profile</h1>
          <p className="text-gray-500 font-medium italic">Update your personal and security details</p>
        </div>
        <Link 
          to="/profile"
          className="px-6 py-2 bg-gray-100 text-gray-500 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl text-sm font-bold animate-in zoom-in ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information Section */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1e3a5f]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1e3a5f]">Profile Info</h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-[#1e3a5f] outline-none focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] transition-all"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-[#1e3a5f] outline-none focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] transition-all"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#1e3a5f] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#163050] transition-all shadow-lg"
            >
              {loading ? "Updating..." : "Save Profile Changes"}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#c8922a]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1e3a5f]">Security</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-[#1e3a5f] outline-none focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] transition-all"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-[#1e3a5f] outline-none focus:ring-4 focus:ring-[#1e3a5f]/5 focus:border-[#1e3a5f] transition-all"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#c8922a] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#b08125] transition-all shadow-lg"
            >
              {loading ? "Changing..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
