import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Trophy, Users, Zap, Calendar, ExternalLink, X, CircleCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState, useContext, createContext } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ModalContext } from '../App';
import heroRunway from '../assets/hero-runway.jpg';
import winner1 from '../assets/winner-1.jpg';
import winner2 from '../assets/winner-2.jpg';
import winner3 from '../assets/winner-3.jpg';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const ApplicationModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      category: formData.get('category'),
      city: formData.get('city'),
      province: formData.get('province'),
      portfolioLinks: formData.get('portfolioLinks'),
      statement: formData.get('statement'),
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'applications'), data);
      setSubmitted(true);
    } catch (error) {
      console.error('Application submission failed:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/95 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-zinc-900 border border-white/10 w-full max-w-2xl p-8 md:p-12 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">
              <X size={24} />
            </button>

            {!submitted ? (
              <>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-none">DESIGNER <br /><span className="text-accent italic">REGISTRATION</span></h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40">Full Name</label>
                    <input required name="fullName" type="text" className="w-full bg-black border border-white/10 px-6 py-4 outline-none focus:border-accent text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40">Email Orbit</label>
                    <input required name="email" type="email" className="w-full bg-black border border-white/10 px-6 py-4 outline-none focus:border-accent text-white" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40">Province</label>
                      <select required name="province" className="w-full bg-black border border-white/10 px-6 py-4 outline-none focus:border-accent text-white uppercase text-xs tracking-widest">
                        <option value="">Select Province</option>
                        <option>Punjab</option>
                        <option>Sindh</option>
                        <option>Khyber Pakhtunkhwa</option>
                        <option>Balochistan</option>
                        <option>Gilgit-Baltistan</option>
                        <option>Azad Jammu & Kashmir</option>
                        <option>Islamabad Capital Territory</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40">City</label>
                      <input required name="city" type="text" placeholder="e.g. Lahore" className="w-full bg-black border border-white/10 px-6 py-4 outline-none focus:border-accent text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans font-black uppercase tracking-widest text-white/40">Category</label>
                    <select name="category" className="w-full bg-black border border-white/10 px-6 py-4 outline-none focus:border-accent text-white uppercase text-xs tracking-widest">
                      <option>Avant-Garde</option>
                      <option>Sustainable</option>
                      <option>Technical Gear</option>
                      <option>Digital/Meta</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40">Portfolio Links (IG, Website, Behance)</label>
                    <textarea name="portfolioLinks" className="w-full bg-black border border-white/10 px-6 py-4 outline-none focus:border-accent text-white resize-none" rows={3} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40">Personal Statement (Why Spotlight?)</label>
                    <textarea name="statement" className="w-full bg-black border border-white/10 px-6 py-4 outline-none focus:border-accent text-white resize-none font-serif italic" rows={4} placeholder="Tell us your vision..." />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-accent text-white py-6 font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? "PROCESSING..." : "SUBMIT APPLICATION"}
                  </button>
                  {error && (
                    <p className="text-red-500 text-center text-[10px] font-sans font-bold uppercase tracking-widest">
                      {error}
                    </p>
                  )}
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 bg-accent/20 border-2 border-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(255,0,102,0.3)]"
                >
                  <CircleCheck size={48} className="text-accent" />
                </motion.div>
                
                <h3 className="text-4xl font-black uppercase mb-4 tracking-tighter leading-none">TRANSMISSION <br /><span className="text-accent">RECEIVED.</span></h3>
                <p className="text-accent font-sans font-bold uppercase tracking-widest text-sm mb-6 animate-pulse">
                  Thank you, your application has been successfully submitted.
                </p>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold mb-8">
                  REF_ID: SP-{Math.random().toString(36).substring(7).toUpperCase()}
                </div>
                
                <p className="text-white/60 font-serif italic mb-12 text-lg leading-relaxed max-w-lg mx-auto">
                  Your vision has been logged into the Spotlight matrix. Our board of curators is currently reviewing the Fall '26 cohort.
                </p>

                <div className="bg-black/40 border border-white/5 p-8 mb-10 text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6 border-b border-white/10 pb-4">Next Phases</h4>
                  <div className="space-y-6">
                    {[
                      { step: "01", title: "Archive Review", status: "Active", desc: "Curators evaluate your portfolio DNA." },
                      { step: "02", title: "Shortlist Alpha", status: "Pending", desc: "Top 100 designers notified via email." },
                      { step: "03", title: "Human Interview", status: "Waitlist", desc: "15min video call with the creative board." }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-6">
                        <span className="text-accent font-black text-xs font-mono">{step.step}</span>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-sans font-black uppercase text-xs tracking-widest">{step.title}</span>
                            <span className={`text-[8px] px-2 py-0.5 border ${i === 0 ? 'border-accent text-accent animate-pulse' : 'border-white/20 text-white/20'} font-bold uppercase tracking-widest`}>
                              {step.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Link 
                    to="/blog" 
                    onClick={onClose}
                    className="w-full py-5 bg-white text-dark font-black uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-white transition-all"
                  >
                    Explore Chronicles
                  </Link>
                  <button 
                    onClick={onClose} 
                    className="text-white/40 hover:text-accent font-sans font-bold uppercase tracking-widest text-[10px] transition-colors"
                  >
                    Return to Void
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Landing = () => {
  const { isModalOpen, setModalOpen } = useContext(ModalContext);

  return (
    <div className="overflow-hidden">
      <ApplicationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      {/* Editorial Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-4 bg-dark">
        {/* Grain Overlay */}
        <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>

        {/* Dynamic Blurs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-accent blur-[140px] pointer-events-none"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-accent blur-[180px] pointer-events-none"
        ></motion.div>

        <div className="flex-1 flex relative border-t border-white/10">
          {/* Vertical Label */}
          <div className="hidden lg:flex w-24 border-r border-white/10 items-center justify-center overflow-hidden">
            <span className="vertical-label opacity-30 select-none">Pakistan Accelerator Vol. 01 — LHE/KHI</span>
          </div>

          {/* Content Area */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative z-10">
            {/* Left: Massive Typography */}
            <div className="lg:col-span-8 p-6 sm:p-10 lg:p-16 flex flex-col justify-center relative">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
              >
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="text-accent text-[10px] sm:text-[12px] font-black tracking-widest uppercase mb-6 flex items-center"
                >
                  <span className="w-12 h-[2px] bg-accent mr-4"></span>
                  // Fall 2026 Applications Open June 1
                </motion.div>
                
                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[110px] leading-[1] md:leading-[0.85] font-black tracking-tighter uppercase mb-10"
                >
                  Stop <span className="text-stroke">interning.</span><br />
                  Start competing.
                </motion.h1>
                
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="font-serif italic text-lg sm:text-xl md:text-3xl text-white/70 max-w-xl leading-snug mb-12"
                >
                 The lineup comprises a distinguished jury of Pakistan's most celebrated couturiers and fashion trailblazers.
                </motion.p>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-10"
                >
                  <button 
                    onClick={() => setModalOpen(true)}
                    className="w-full sm:w-auto px-12 py-6 bg-accent text-white font-black uppercase tracking-tighter text-xl skew-btn shadow-[8px_8px_0px_0px_rgba(255,0,102,0.3)] hover:-translate-y-1 active:translate-y-0 transition-transform"
                  >
                    Apply Now 
                  </button>
                  <div className="text-[11px] uppercase tracking-[0.3em] font-black border-b-2 border-white/30 pb-1 cursor-pointer hover:border-accent hover:text-accent transition-all">
                    Download Prospectus
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right: High Contrast Visual & Stats */}
            <div className="lg:col-span-4 border-l border-white/10 bg-black/40 flex flex-col relative overflow-hidden">
              {/* Internal Grid Accents */}
              <div className="absolute top-0 right-0 w-full h-[1px] bg-white/5"></div>
              <div className="absolute bottom-0 left-0 w-[1px] h-full bg-white/5"></div>

              <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10"></div>
                <div className="h-full w-full bg-[radial-gradient(circle_at_50%_40%,_rgba(40,40,40,1)_0%,_rgba(10,10,10,1)_70%)] flex items-center justify-center relative overflow-hidden">
                  {/* Subtle Scanline Effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] z-0 pointer-events-none opacity-20"></div>

                  {/* Visual Element */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full aspect-[3/4] border border-white/20 relative group overflow-hidden z-10 shadow-2xl"
                  >
                    <img 
                      src={heroRunway} 
                      alt="Runway" 
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-110 group-hover:opacity-60 group-hover:grayscale-[0.5] transition-all duration-1000 ease-out"
                    />
                    <div className="absolute inset-4 border border-accent/30 opacity-40 group-hover:opacity-100 group-hover:border-accent transition-all pointer-events-none"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center group-hover:scale-110 transition-transform px-4">
                        <div className="text-4xl sm:text-5xl font-black mb-2 tracking-tighter drop-shadow-2xl">Rs. 300,000</div>
                        <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 font-bold mix-blend-difference">Venture Grant Fund</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Social Proof Mini Band */}
              <div className="p-10 border-t border-white/10 bg-black/60">
                <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black mb-6 flex items-center">
                   <Users className="w-3 h-3 mr-2" /> Supported by Industry Titans
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['PREMIÈRE VISION', 'WWD MENTOR', 'LVMH ACCEL', 'CFDA PARTNER'].map(partner => (
                    <div key={partner} className="h-10 border border-white/10 flex items-center justify-center grayscale text-[10px] font-black opacity-40 hover:opacity-100 transition-opacity">
                      {partner}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Dates Footer Bar */}
        <footer className="h-16 border-t border-white/10 flex items-center px-6 lg:px-16 justify-between bg-dark relative z-20">
          <div className="flex items-center space-x-8 lg:space-x-12 overflow-x-auto no-scrollbar">
            {[
  { num: "01", label: "The Visionary Call", date: "June 01" },
  { num: "02", label: "The Absolute Cutoff", date: "July 15" },
  { num: "03", label: "The Jury Convene", date: "Aug 10" },
  { num: "04", label: "The Grand Runway", date: "Sept 14" }
].map((d, i) => (
              <div key={i} className="flex items-center space-x-3 shrink-0">
                <span className={`${i === 0 ? 'text-accent' : 'text-white/20'} font-black text-sm`}>{d.num}</span>
                <span className="text-[10px] uppercase font-black text-white/60 tracking-wider whitespace-nowrap">
                  {d.label}: <span className="text-white">{d.date}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="hidden sm:block text-[11px] uppercase font-black tracking-[0.2em] text-accent">
            // Fall 2026 
          </div>
        </footer>
      </section>

      {/* Reusing existing sections but with theme polish */}
      {/* Enhanced Process Section */}
      <section className="py-32 px-6 border-t border-white/10 relative overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-accent mb-4 block">The Blueprint</span>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] md:leading-[0.8]">
                FOUR STAGES <br />
                <span className="text-stroke">TO GLORY.</span>
              </h2>
            </div>
            <div className="text-left md:text-right hidden sm:block">
              <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest leading-relaxed max-w-[200px]">
               Rigorous evaluation by globally recognized fashion authorities, visionary creatives, and next-generation industry innovators.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-white/10">
            {[
  { 
    step: "01", 
    title: "The Submission", 
    subtitle: "Digital Applications Open", 
    desc: "Submit your PDF portfolio showcasing 3-5 looks. We are scouting for your core DNA and your ability to master Western silhouettes with Eastern artistry." 
  },
  { 
    step: "02", 
    title: "The Industrial Cut", 
    subtitle: "Jury Selection & Vetting", 
    desc: "A panel of Industry Creative Directors evaluates the Top 100 to select the Top 10 finalists based on technical excellence and luxury standards." 
  },
  { 
    step: "03", 
    title: "The Spotlight", 
    subtitle: "Live Finale | Sept 14", 
    desc: "The Top 10 designers showcase their vision on the Lahore runway. The winner is decided by key industry stakeholders, influencers, and the public." 
  },
  { 
    step: "04", 
    title: "The Legacy", 
    subtitle: "Grant & Market Launch", 
    desc: "The winner secures a PKR 300K grant. All Top 10 finalists enter a funded production and marketplace partnership spanning 3 consecutive fashion cycles." 
  },
].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="p-10 border-r border-b border-white/10 group hover:bg-white/[0.03] transition-colors relative min-h-[400px] flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                   <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                </div>
                <span className="text-8xl font-sans font-black text-white/5 absolute top-4 left-4 group-hover:text-accent/10 transition-colors pointer-events-none">
                  {item.step}
                </span>
                <div className="relative z-10 pt-12">
                  <span className="text-[10px] font-mono text-accent mb-4 block font-bold tracking-widest uppercase">// STAGE_{item.step}</span>
                  <h4 className="text-3xl font-black uppercase mb-2 tracking-tight group-hover:text-accent transition-colors">{item.title}</h4>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">{item.subtitle}</p>
                </div>
                <div className="relative z-10">
                  <p className="text-white/60 font-serif italic text-lg leading-relaxed group-hover:text-white/90 transition-colors">
                    {item.desc}
                  </p>
                </div>
                {/* Decorative scanning line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Package */}
      <section className="py-32 px-6 bg-accent/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
<h2 className="text-5xl md:text-7xl font-black mb-12 leading-none">
  The Prize <br />
  <span className="text-accent underline decoration-white/20">Isn't Just</span> <br />
  Cash.
</h2>
              <div className="space-y-8">
                {[
  { title: "Cash Prize", value: "PKR 300K awarded to the Top 1 winner" },
  { title: "Ownership", value: "100% ownership of your brand, trademarks, and IP" },
  { title: "3 Collection Cycles", value: "Full production and manufacturing funding for Top 10 designers" },
  { title: "Profit Share", value: "50% net profit split after recovery of production and marketing costs" },
  { title: "Global Launch", value: "Featured collection drop on the ADORZIA digital marketplace" },
  { title: "Runway Showcase", value: "Professional Fall 2026 showcase for Top 10 finalists" },
]
.map((prize, idx) => (
                  <div key={idx} className="flex items-start space-x-6 pb-6 border-b border-white/10">
                    <Zap className="text-accent shrink-0 mt-1" size={24} />
                    <div>
                      <h5 className="font-sans font-bold text-lg mb-1">{prize.title}</h5>
                      <p className="text-white/60">{prize.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-white/10 border border-white/20 p-4">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2600&auto=format&fit=crop" 
                  alt="Designer working" 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale brightness-75"
                />
                <div className="absolute -bottom-10 -right-10 bg-accent p-12 hidden md:block">
                  <span className="text-5xl font-black font-sans uppercase leading-none">Win <br />Your <br />Future</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Sponsors / Brands Section */}
      <section className="py-40 px-6 border-t border-white/10 bg-dark relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/5 -translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="inline-block px-4 py-1 border border-accent text-accent text-[10px] font-black uppercase tracking-[0.3em]">
                Commercial Opportunities
              </div>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                PARTNER <br />
                <span className="text-stroke">WITH US.</span>
              </h2>
              <p className="text-xl md:text-2xl font-serif italic text-white/50 max-w-lg leading-relaxed">
                Connect your brand to the most disruptive talent pool in the industry. We don't just find designers; we build cultural powerhouses.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                {[
  { title: "Early Access", desc: "Connect with Pakistan's most promising emerging designers before the global market discovers them." },
  { title: "Brand Integration", desc: "Place your materials, technology, or services directly into designer collections and runway showcases." },
  { title: "Industry Positioning", desc: "Align your brand with the future of luxury fashion, craftsmanship, and creative innovation." },
  { title: "Global Visibility", desc: "Reach an international fashion audience through digital campaigns, editorial storytelling, and the Fall 2026 showcase." }
].map((benefit, i) => (
                  <div key={i} className="space-y-2 border-l border-accent/30 pl-6">
                    <h4 className="font-sans font-black uppercase text-sm tracking-widest">{benefit.title}</h4>
                    <p className="text-white/40 text-sm font-serif italic">{benefit.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-10">
                <button className="bg-white text-dark px-10 py-5 font-sans font-black uppercase tracking-[0.2em] text-sm hover:bg-accent hover:text-white transition-all shadow-2xl skew-btn flex items-center group">
                  Sponsorship Deck
                  <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative aspect-square md:aspect-video lg:aspect-square bg-white/5 border border-white/10 group overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2574&auto=format&fit=crop" 
                alt="Corporate sponsorship" 
                loading="lazy"
                className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 group-hover:opacity-50 transition-all duration-1000"
              />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="text-center">
                  <span className="text-7xl md:text-9xl font-black text-white/10 group-hover:text-accent transition-colors select-none leading-none">B2B</span>
                  <div className="mt-4 text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold">
                    // Disrupting the legacy loop
                  </div>
                </div>
              </div>
              <div className="absolute bottom-10 left-10 right-10 p-8 border border-white/10 bg-dark/80 backdrop-blur-md">
                <blockquote className="font-serif italic text-white/70">
                  "The most effective way to reach the next generation of consumers is to fund the designers they already trust."
                </blockquote>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="w-8 h-[1px] bg-accent" />
                  <span className="text-[10px] uppercase font-black tracking-widest opacity-40">Founder, Adorzia Fashion Co</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

  
{/* Jury Members */}
<section className="py-32 px-6 max-w-7xl mx-auto">
  <h2 className="text-4xl md:text-6xl font-black mb-8">
    Jury Members <span className="text-accent">—</span>
  </h2>

  <p className="text-white/60 text-lg max-w-3xl mb-20 leading-relaxed">
    The inaugural ADORZIA Spotlight jury panel will be announced soon. 
    The selection committee will include leaders across fashion, retail, 
    production, branding, and creative direction from Pakistan’s evolving fashion industry.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
    {[
      {
        title: "Creative Direction",
        desc: "Industry voices shaping the future of design, storytelling, and fashion identity.",
        image: winner3
      },
      {
        title: "Business & Retail",
        desc: "Professionals experienced in scaling brands, distribution, and market positioning.",
        image: winner2
      },
      {
        title: "Production & Craft",
        desc: "Experts focused on manufacturing, textile innovation, and artisanal excellence.",
        image: winner1 
      }
    ].map((item, idx) => (
      <div key={idx} className="group">
        <div className="aspect-[3/4] overflow-hidden mb-8 relative">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-accent text-xs uppercase tracking-[0.3em] font-bold mb-3">
              Coming Soon
            </p>

            <h4 className="text-2xl font-black uppercase mb-3">
              {item.title}
            </h4>

            <p className="text-white/70 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Deadlines / Timeline */}
      <section className="py-40 px-6 bg-white text-dark relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-dark/[0.02] transform skew-x-[-12deg] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <span className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-accent mb-6 block">The Road to the Runway</span>
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase">FALL '26 <br /><span className="text-stroke" style={{ WebkitTextStroke: '1px #111', color: 'transparent' }}>TIMELINE.</span></h2>
          </motion.div>

          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-dark/10 -translate-x-1/2 hidden lg:block"></div>

            <div className="space-y-32">
              {[
                { date: "JUNE 1, 2026", item: "Applications Open", desc: "Official launch of the submission portal for the Fall 2026 Founding Designers Program." },
                { date: "AUGUST 15, 2026", item: "Submission Deadline", desc: "Final cutoff for all designer applications and portfolio reviews." },
                { date: "AUGUST 30, 2026", item: "Finalists Announcement", desc: "Official selection announcement of the designers entering the production incubation phase." },
                { date: "SEPT 14, 2026", item: "The Grand Runway", desc: "The live finale in Lahore, showcasing the completed collections and awarding season winners." },
              ].map((d, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 group ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Date Side */}
                  <div className={`flex-1 w-full ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <span className="text-accent font-mono text-sm font-bold tracking-[0.3em] block mb-4">// PHASE_0{idx + 1}</span>
                    <span className="text-4xl md:text-6xl font-black font-sans tracking-tighter group-hover:text-accent transition-colors duration-500 leading-none">{d.date}</span>
                    <h3 className="text-2xl md:text-4xl font-black uppercase mt-4 tracking-tight">{d.item}</h3>
                  </div>

                  {/* Marker */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className="w-20 h-20 rounded-full border-2 border-dark/10 bg-white flex items-center justify-center group-hover:border-accent group-hover:scale-110 transition-all duration-500 z-10 shadow-2xl">
                      <span className="text-sm font-black font-mono">0{idx + 1}</span>
                    </div>
                    {/* Pulsing ring on hover */}
                    <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Content Side */}
                  <div className={`flex-1 w-full ${idx % 2 === 0 ? 'lg:text-left' : 'lg:text-right'}`}>
                    <p className="text-lg md:text-xl font-serif italic text-dark/70 leading-relaxed max-w-md mx-auto lg:mx-0 group-hover:text-dark transition-colors">
                      {d.desc}
                    </p>
                    <div className={`mt-10 ${idx % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'} flex justify-center`}>
                      <button 
                        onClick={() => setModalOpen(true)}
                        className="group/btn relative px-10 py-5 overflow-hidden transition-transform active:scale-95"
                      >
                        <div className="absolute inset-0 bg-dark group-hover/btn:bg-accent transition-colors duration-500 skew-x-[-20deg]"></div>
                        <span className="relative z-10 text-white font-sans font-black uppercase tracking-[0.2em] text-[10px]">Set Reminder</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-20 text-center italic font-serif lowercase tracking-normal">Common Questions</h2>
        <div className="space-y-12">
          {[
  { 
    q: "Do I need to submit a full collection?", 
    a: "No. Your initial application only requires your portfolio and design vision. We judge your creative point of view, not your current inventory." 
  },
  { 
    q: "Who owns the rights to my brand?", 
    a: "You do. You retain 100% legal ownership of your trademarks, IP, and designs. ADORZIA is an investment and launch partner, not an owner." 
  },
  { 
    q: "Is the production funding a loan?", 
    a: "No. For the Top 10 finalists, ADORZIA covers the manufacturing and production costs as an investment in your brand's market entry." 
  },
  { 
    q: "What happens if I don't win the grand prize?", 
    a: "All Top 10 finalists receive professional runway exposure, a year of mentorship, and their collections are launched on our digital marketplace." 
  },
  { 
    q: "How does the profit sharing work?", 
    a: "For the funded collections, we use a 50/50 net profit split after production and marketing costs are recovered, ensuring you earn while you grow." 
  },
  { 
    q: "Who is eligible to apply?", 
    a: "We are open to final-year fashion students, recent alumni, and independent designers across Pakistan who specialize in slow fashion and heritage craft." 
  },
  { 
    q: "What is the first season theme?", 
    a: "The debut theme is 'Industrial Heritage'—a call to merge Pakistan's deep-rooted artisanal craftsmanship with modern, utilitarian silhouettes." 
  }
].map((faq, idx) => (
            <div key={idx} className="border-l-4 border-accent pl-8">
              <h5 className="text-xl font-bold mb-4 uppercase">{faq.q}</h5>
              <p className="text-white/60 text-lg leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="apply-section" className="py-24 md:py-40 px-6 text-center bg-accent relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="text-[40vw] lg:text-[30vw] font-black font-sans leading-none select-none">NOW</span>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-9xl font-black text-white mb-12 leading-[0.9] md:leading-none tracking-tighter uppercase font-sans">YOUR BREAKOUT IS 3 CLICKS AWAY.</h2>
          <p className="text-lg md:text-3xl text-white/90 font-serif italic mb-16 px-4">
  Inaugural edition: Applications open for the first-ever ADORZIA Spotlight. The countdown starts today.          </p>
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-white text-accent px-8 md:px-12 py-5 md:py-6 font-sans font-black uppercase text-lg md:text-xl tracking-[0.2em] hover:scale-110 active:scale-95 transition-all shadow-2xl"
          >
            Submit Application
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
