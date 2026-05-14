import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  Search,
  Settings,
  Flame,
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { AdminProvider, useAdmin } from '../../lib/authContext';

const AdminLayoutWrapper = () => {
  return (
    <AdminProvider>
      <AdminLayout />
    </AdminProvider>
  );
};

const AdminLayout = () => {
  const { user, isAdmin, loading, signIn, signUp, signInGoogle, signOut } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEnrollMode, setIsEnrollMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      if (isEnrollMode) {
        await signUp(loginEmail, loginPassword);
      } else {
        await signIn(loginEmail, loginPassword);
      }
    } catch (err: any) {
      if (err.message.includes('network') || err.message.includes('Communication')) {
        setAuthError('Satellite Signal Failure: A network error interrupted the handshake. Ensure third-party cookies are enabled in this environment.');
      } else {
        setAuthError(err.message);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Insights', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'Applications', path: '/admin/applications', icon: Users },
    { name: 'Subscribers', path: '/admin/subscribers', icon: Mail },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="w-20 h-20 border-t-2 border-accent rounded-full flex items-center justify-center"
          >
            <ShieldCheck className="text-accent" size={32} />
          </motion.div>
          <div className="text-center">
            <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-white/40 animate-pulse">
              Establishing Secure Uplink...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // Case: Not Logged In or Not Authorized
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#080808] border border-white/10 p-8 md:p-12 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
          {/* Decorative Mesh */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 -mr-32 -mt-32 blur-3xl rounded-full"></div>
          
          <div className="flex flex-col justify-center relative">
            <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mb-8 relative">
              <ShieldCheck className="text-accent" size={32} />
              <div className="absolute inset-0 border border-accent/20 rounded-full animate-ping opacity-20"></div>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic text-white text-glow leading-none">Vanguard <br />Portal.</h1>
            <p className="text-white/40 font-serif italic text-sm leading-relaxed mb-8">
              {user && !isAdmin 
                ? "Your current identity lacks the necessary clearance for this sector. Authorization denied."
                : "Secure administrative gateway for high-level operations and intelligence viewing."}
            </p>
            
            <div className="flex items-center gap-3 text-[10px] font-sans font-black uppercase tracking-[0.2em] text-white/20">
              <div className={`w-2 h-2 rounded-full ${user && !isAdmin ? 'bg-red-500' : 'bg-accent'} animate-pulse`}></div>
              <span>Protocol: {user && !isAdmin ? 'CLEARANCE FAILURE' : 'AES-256'}</span>
            </div>
          </div>

          <div className="flex flex-col justify-center relative">
            {user && !isAdmin ? (
              <div className="space-y-6">
                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-sm">
                  <h3 className="text-red-500 font-sans font-black uppercase text-[12px] tracking-widest mb-2 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    Clearance Denied
                  </h3>
                  <p className="text-white/40 text-[10px] font-sans font-bold uppercase tracking-wider leading-relaxed">
                    Identity <span className="text-white">{user.email}</span> lacks authorization for this level. 
                    {!user.emailVerified && <span className="block text-accent mt-1">Verification Required: Ensure your email is verified.</span>}
                  </p>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="w-full border border-white/10 text-white py-4 font-sans font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-dark transition-all flex items-center justify-center gap-3"
                >
                  Terminate & Exit
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Google Sign In - Primary */}
                <div className="space-y-4">
                  <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-white/60 mb-2 italic">
                    Fast Track Access
                  </h2>
                  <button 
                    type="button"
                    onClick={() => signInGoogle()}
                    className="w-full bg-white text-dark py-4 font-sans font-black uppercase tracking-widest text-[11px] hover:bg-accent hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group"
                  >
                    <Activity size={16} className="group-hover:animate-pulse" />
                    Secure Google Uplink
                  </button>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-grow-0 mx-4 text-[9px] font-sans font-black text-white/5 uppercase tracking-[0.4em]">Alternative</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                {/* Email Sign In - Secondary */}
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-white/40 italic">
                      {isEnrollMode ? 'Secure Enrollment' : 'Terminal Access'}
                    </h2>
                    {loginEmail.toLowerCase() === 'haseeb.49251@gmail.com' && (
                      <button 
                        type="button"
                        onClick={() => setIsEnrollMode(!isEnrollMode)}
                        className="text-[9px] font-sans font-bold uppercase tracking-widest text-accent hover:underline decoration-accent/30 underline-offset-4"
                      >
                        {isEnrollMode ? 'Return to Terminal' : 'Enroll Master'}
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="ADMIN EMAIL"
                        className="w-full bg-white/[0.03] border border-white/10 pl-12 pr-4 py-3 font-sans text-[11px] tracking-widest font-bold outline-none focus:border-accent transition-all text-white placeholder:text-white/10"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="PASS-CLIP"
                        className="w-full bg-white/[0.03] border border-white/10 pl-12 pr-12 py-3 font-sans text-[11px] tracking-widest font-bold outline-none focus:border-accent transition-all text-white placeholder:text-white/10"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {authError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500"
                      >
                        <AlertTriangle size={12} className="shrink-0" />
                        <p className="text-[9px] font-sans font-bold uppercase tracking-widest">{authError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    type="submit"
                    disabled={isAuthenticating}
                    className={`w-full ${isEnrollMode ? 'bg-accent text-white' : 'border border-white/10 text-white/60'} py-3 font-sans font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-dark transition-all disabled:opacity-50`}
                  >
                    {isAuthenticating ? (
                      <Activity size={14} className="animate-spin mx-auto" />
                    ) : (
                      isEnrollMode ? 'Confirm Enrollment' : 'Bypass Terminal'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
          
          <p className="col-span-full mt-12 text-center text-[9px] font-sans font-bold text-white/10 uppercase tracking-[0.4em]">
            This terminal is monitored. Authorized Personnel Only • Violators will be traced.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } border-r border-white/10 bg-[#080808] flex flex-col transition-all duration-500 relative z-50`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-accent flex items-center justify-center skew-x-[-15deg]">
              <Flame size={18} className="text-white skew-x-[15deg]" />
            </div>
            {isSidebarOpen && (
              <span className="font-black italic tracking-tighter text-xl uppercase group-hover:text-accent transition-colors">Vanguard.</span>
            )}
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 transition-all group relative ${
                  isActive ? 'text-accent' : 'text-white/40 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-accent' : 'group-hover:text-white'} />
                {isSidebarOpen && (
                  <span className="font-sans font-black uppercase text-[11px] tracking-[0.2em]">{item.name}</span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="sidebarActive"
                    className="absolute left-0 w-1 h-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-4 text-white/40 hover:text-red-500 transition-all group overflow-hidden`}
          >
            <LogOut size={20} />
            {isSidebarOpen && (
              <span className="font-sans font-black uppercase text-[11px] tracking-[0.2em]">Terminate Session</span>
            )}
          </button>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-24 w-8 h-8 bg-accent text-white flex items-center justify-center rounded-sm hover:scale-110 active:scale-95 transition-all shadow-xl z-50 overflow-hidden"
        >
          {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-dot-pattern">
        {/* Top Header */}
        <header className="h-20 border-b border-white/10 bg-[#080808]/80 backdrop-blur-xl px-8 flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="PROBING DATA STREAM..." 
                className="bg-white/5 border border-white/10 pl-12 pr-4 py-2.5 w-64 font-sans text-[9px] tracking-widest uppercase font-bold outline-none focus:border-accent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] font-sans font-black uppercase tracking-widest text-white/20">LIVE ENGINE SAFE</span>
            </div>
            
            <div className="w-[1px] h-6 bg-white/10"></div>

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <span className="block text-[10px] font-sans font-black uppercase tracking-widest leading-none mb-1">{user.displayName}</span>
                <span className="block text-[9px] font-sans font-bold text-accent uppercase tracking-widest opacity-60">Operations Unit</span>
              </div>
              <div className="w-10 h-10 border-2 border-accent/20 p-0.5 overflow-hidden group-hover:border-accent transition-colors">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=ff3b30&color=fff`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="Admin" />
              </div>
            </div>

            <div className="w-[1px] h-6 bg-white/10 hidden sm:block"></div>

            <button 
              onClick={handleLogout}
              className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm group relative"
              title="Terminate Global Session"
            >
              <LogOut size={16} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-black uppercase px-2 py-1 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Terminate
              </span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto pb-20">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayoutWrapper;
