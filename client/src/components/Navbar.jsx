import { Link } from 'react-router-dom';

const ROLE_HOME  = { student: '/student', advisor: '/advisor', admin: '/admin' };
const ROLE_COLOR = { student: 'text-blue-600 bg-blue-50', advisor: 'text-green-600 bg-green-50', admin: 'text-amber-600 bg-amber-50' };

const Navbar = ({ user, onMenuClick }) => {
  const homeLink = ROLE_HOME[user?.role] || '/dashboard';
  const roleColor = ROLE_COLOR[user?.role] || 'text-gray-600 bg-gray-100';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 md:px-8 sticky top-0 z-30 shadow-sm">
      {/* Left: hamburger + brand */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick}
          className="p-2 -ml-1 text-[#1e3a5f] md:hidden hover:bg-gray-100 rounded-xl transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to={homeLink} className="flex items-center gap-2 hidden md:flex">
          <img src="/src/assets/MSA-New-Logo-Small-V (1).png" alt="MSA" className="h-8 object-contain" />
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest hidden lg:block">
            Academic Advising
          </span>
        </Link>

        {/* Mobile logo */}
        <Link to={homeLink} className="md:hidden">
          <img src="/src/assets/MSA-New-Logo-Small-V (1).png" alt="MSA" className="h-8 object-contain" />
        </Link>
      </div>

      {/* Right: role badge + user avatar */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        {user?.role && (
          <span className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-current/20 ${roleColor}`}>
            {user.role === 'admin' ? '🛡️' : user.role === 'advisor' ? '🎓' : '🎒'} {user.role}
          </span>
        )}

        {/* Name + avatar */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <Link to="/profile" className="text-sm font-black text-[#1e3a5f] hover:text-[#c8922a] transition-colors leading-tight block">
              {user?.name}
            </Link>
            <p className="text-[10px] text-gray-400 font-semibold">{user?.email}</p>
          </div>

          <Link to="/profile"
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5490] flex items-center justify-center text-white font-black text-sm shadow-sm hover:shadow-md transition-shadow flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
