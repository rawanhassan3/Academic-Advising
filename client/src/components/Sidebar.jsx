import { Link, useLocation } from 'react-router-dom';

// ── Nav configs per role ───────────────────────────────────────
const studentNav = [
  { name: 'Dashboard',     path: '/student',              icon: 'home' },
  { name: 'My Courses',    path: '/student#courses',      icon: 'book' },
  { name: 'GPA',           path: '/student#gpa',          icon: 'chart' },
  { name: 'My Requests',   path: '/student#requests',     icon: 'clipboard' },
  { name: 'Schedule',      path: '/student#schedule',     icon: 'calendar' },
  { name: 'Notifications', path: '/student#notifications',icon: 'bell' },
];

const advisorNav = [
  { name: 'Dashboard',       path: '/advisor',              icon: 'home' },
  { name: 'My Students',     path: '/advisor#students',     icon: 'users' },
  { name: 'Requests',        path: '/advisor#requests',     icon: 'clipboard' },
  { name: 'Academic Notes',  path: '/advisor#notes',        icon: 'pencil' },
  { name: 'Progress',        path: '/advisor#progress',     icon: 'chart' },
];

const adminNav = [
  { name: 'Dashboard',   path: '/admin',              icon: 'home' },
  { name: 'Students',    path: '/admin/students',     icon: 'users' },
  { name: 'Advisors',    path: '/admin/advisors',     icon: 'badge' },
  { name: 'Courses',     path: '/admin/courses',      icon: 'book' },
  { name: 'Requests',    path: '/admin/requests',     icon: 'clipboard' },
  { name: 'Add Advisor', path: '/admin/add-advisor',  icon: 'addUser' },
  { name: 'Analytics',   path: '/admin/analytics',    icon: 'chart' },
];

const navByRole = { student: studentNav, advisor: advisorNav, admin: adminNav };

// ── Icon component ─────────────────────────────────────────────
const Icon = ({ name }) => {
  const cls = "h-5 w-5 flex-shrink-0";
  const icons = {
    home: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    book: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    chart: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    clipboard: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
    calendar: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    bell: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    users: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    badge: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
    pencil: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    addUser: <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
  };
  return icons[name] || null;
};

// ── Role badge colors ──────────────────────────────────────────
const roleBadge = {
  student: 'bg-blue-500/20 text-blue-300',
  advisor: 'bg-green-500/20 text-green-300',
  admin:   'bg-[#c8922a]/20 text-[#c8922a]',
};

// ── Sidebar component ──────────────────────────────────────────
const Sidebar = ({ user, logout, isOpen, onClose }) => {
  const location = useLocation();
  const navItems = navByRole[user?.role] || studentNav;

  const isActive = (path) => {
    // For hash links, match just the pathname
    const basePath = path.split('#')[0];
    return location.pathname === basePath && !path.includes('#')
      ? true
      : location.pathname === basePath && location.hash === `#${path.split('#')[1]}`;
  };

  // Exact match for dashboard items without hash
  const isExactActive = (path) => location.pathname === path && !path.includes('#');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        bg-gradient-to-b from-[#152c48] to-[#1e3a5f]
        md:translate-x-0 md:static md:inset-auto md:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex flex-col items-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white md:hidden rounded-lg hover:bg-white/10 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src="/src/assets/MSA-New-Logo-Small-V (1).png" alt="MSA Logo"
            className="h-16 object-contain mb-3 filter brightness-0 invert" />
          <h2 className="text-[9px] font-black uppercase tracking-[0.35em] text-[#c8922a] text-center leading-tight">
            Academic Advising System
          </h2>
        </div>

        {/* User info */}
        {user && (
          <div className="mx-4 mt-4 p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c8922a]/20 flex items-center justify-center text-[#c8922a] font-black text-sm flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{user.name}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBadge[user.role] || 'bg-white/10 text-white/60'} uppercase tracking-wider`}>
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.path.includes('#')
              ? location.pathname + location.hash === item.path.replace('#', '#')
              : isExactActive(item.path);

            return (
              <Link key={item.path} to={item.path}
                onClick={() => { if (window.innerWidth < 768) onClose(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                  active
                    ? 'bg-white/15 text-[#c8922a] shadow-inner border border-white/10'
                    : 'text-gray-300 hover:bg-white/8 hover:text-white'
                }`}>
                <Icon name={item.icon} />
                <span>{item.name}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c8922a]" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-all font-semibold text-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
