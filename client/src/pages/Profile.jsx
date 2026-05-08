import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#1e3a5f]">Account Profile</h1>
          <p className="text-gray-500 font-medium italic">Your university identity and credentials</p>
        </div>
        <Link 
          to="/updateprofile"
          className="px-8 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#163050] transition-all shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information Section */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1e3a5f]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1e3a5f]">Personal Details</h2>
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-gray-50/50 rounded-[24px] border border-gray-100 space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Name</p>
              <p className="text-lg font-bold text-[#1e3a5f]">{user?.name}</p>
            </div>
            <div className="p-5 bg-gray-50/50 rounded-[24px] border border-gray-100 space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">University Email</p>
              <p className="text-lg font-bold text-[#1e3a5f]">{user?.email}</p>
            </div>
            <div className="p-5 bg-gray-50/50 rounded-[24px] border border-gray-100 space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">University ID</p>
              <p className="text-lg font-bold text-[#1e3a5f]">{user?.universityId}</p>
            </div>
          </div>
        </div>

        {/* Account Info Section */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#c8922a]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1e3a5f]">System Role</h2>
          </div>

          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
             <div className="px-10 py-4 bg-[#1e3a5f] text-white rounded-3xl shadow-xl shadow-blue-900/20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Access Level</p>
                <p className="text-2xl font-black uppercase">{user?.role}</p>
             </div>
             <p className="text-sm text-gray-400 font-bold max-w-[240px] mt-4">
               Your role determines which features you can access in the Advising System.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
