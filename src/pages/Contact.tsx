import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Instagram, Linkedin, MessageSquare, ArrowRight, CircleCheck, X } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

const Contact = () => {
  const [track, setTrack] = useState<'designer' | 'sponsor' | 'other'>('designer');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const interests: string[] = [];
    formData.forEach((value, key) => {
      if (key === 'interests') interests.push(value as string);
    });

    const data = {
      track,
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      message: formData.get('message'),
      province: formData.get('province') || null,
      city: formData.get('city') || null,
      company: formData.get('company') || null,
      interests: interests.length > 0 ? interests : null,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'inquiries'), data);
      setSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left Column: Info */}
        <div className="lg:sticky lg:top-32">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-12 uppercase tracking-tighter leading-[0.9] md:leading-[0.8]">
            LET'S <br /><span className="text-accent italic">CONNECT</span><span className="text-white">.</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/50 font-serif mb-12 lg:mb-20 italic max-w-sm leading-relaxed">
            Whether you're breaking boundaries or funding those who do, we're listening.
          </p>

          <div className="space-y-12">
            <div>
              <h4 className="text-accent font-sans font-bold uppercase tracking-widest text-sm mb-6">Direct Inquiries</h4>
              <div className="space-y-4">
                <a href="mailto:press@spotlight.fashion" className="flex items-center group text-xl md:text-2xl font-bold uppercase hover:text-accent transition-colors">
                  <Mail className="mr-4 text-white/20 group-hover:text-accent" />
                  press@spotlight.fashion
                </a>
                <a href="mailto:partnerships@spotlight.fashion" className="flex items-center group text-xl md:text-2xl font-bold uppercase hover:text-accent transition-colors">
                  <Mail className="mr-4 text-white/20 group-hover:text-accent" />
                  partners@spotlight.fashion
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-accent font-sans font-bold uppercase tracking-widest text-sm mb-6">Social Echo</h4>
              <div className="flex gap-8">
                <a href="#" className="p-4 bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all">
                  <Instagram size={32} />
                </a>
                <a href="#" className="p-4 bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all">
                  <Linkedin size={32} />
                </a>
                <a href="#" className="p-4 bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all">
                  <MessageSquare size={32} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="bg-white/5 border border-white/10 p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {/* Track Selector */}
                <div className="flex mb-12 border-b border-white/10">
                  {([
                    { id: 'designer', label: "I'm a Designer" },
                    { id: 'sponsor', label: "I'm a Sponsor" },
                    { id: 'other', label: "Other" }
                  ] as const).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTrack(t.id)}
                      className={`px-6 py-4 font-sans font-bold uppercase text-xs tracking-widest transition-all relative ${
                        track === t.id ? 'text-accent' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {t.label}
                      {track === t.id && (
                        <motion.div 
                          layoutId="activeTrack"
                          className="absolute bottom-0 left-0 w-full h-[2px] bg-accent"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {track === 'designer' && (
                    <div className="p-6 bg-accent/10 border-l-4 border-accent mb-8">
                      <p className="text-white/80 font-serif italic italic leading-relaxed">
                        Most answers are in our <span className="font-bold underline decoration-accent/40 cursor-pointer">FAQ</span>. Still need help? Drop us a note below.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-sans font-bold uppercase tracking-widest text-white/40">Full Name</label>
                      <input 
                        required
                        name="fullName"
                        type="text" 
                        className="w-full bg-dark border border-white/10 px-6 py-4 focus:border-accent outline-none text-white transition-all font-sans"
                        placeholder="ALEXANDER MCQUEEN"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-sans font-bold uppercase tracking-widest text-white/40">Email Orbit</label>
                      <input 
                        required
                        name="email"
                        type="email" 
                        className="w-full bg-dark border border-white/10 px-6 py-4 focus:border-accent outline-none text-white transition-all font-sans"
                        placeholder="ALEX@STUDIO.COM"
                      />
                    </div>
                  </div>

                  {track === 'sponsor' && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-xs font-sans font-bold uppercase tracking-widest text-white/40">Company / Brand</label>
                        <input 
                          required
                          name="company"
                          type="text" 
                          className="w-full bg-dark border border-white/10 px-6 py-4 focus:border-accent outline-none text-white transition-all font-sans"
                          placeholder="LVMH / INDITEX / ETC"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-sans font-bold uppercase tracking-widest text-white/40">Partnership Interests</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {['Title Sponsor', 'Fabric Partner', 'Media Partner', 'Live Event Partner'].map((p) => (
                            <label key={p} className="flex items-center space-x-3 cursor-pointer group">
                              <div className="w-5 h-5 border border-white/20 group-hover:border-accent flex items-center justify-center transition-colors">
                                <input type="checkbox" name="interests" value={p} className="peer hidden" />
                                <div className="w-3 h-3 bg-accent opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                              </div>
                              <span className="text-sm font-sans uppercase tracking-wider text-white/60 group-hover:text-white">{p}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {track === 'designer' && (
                    <div className="space-y-2">
                      <label className="text-xs font-sans font-bold uppercase tracking-widest text-white/40">Primary Category</label>
                      <select className="w-full bg-dark border border-white/10 px-6 py-4 focus:border-accent outline-none text-white transition-all font-sans uppercase text-sm tracking-widest">
                        <option>Avant-Garde</option>
                        <option>Sustainable / Upcycled</option>
                        <option>Technical Gear</option>
                        <option>Digital / Meta-Fashion</option>
                        <option>Luxury Streetwear</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-sans font-bold uppercase tracking-widest text-white/40">Province</label>
                      <select name="province" className="w-full bg-dark border border-white/10 px-6 py-4 focus:border-accent outline-none text-white transition-all font-sans uppercase text-sm tracking-widest">
                        <option>Punjab</option>
                        <option>Sindh</option>
                        <option>KPK</option>
                        <option>Balochistan</option>
                        <option>Gilgit-Baltistan</option>
                        <option>AJK</option>
                        <option>Islamabad</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-sans font-bold uppercase tracking-widest text-white/40">City</label>
                      <input 
                        name="city"
                        type="text" 
                        className="w-full bg-dark border border-white/10 px-6 py-4 focus:border-accent outline-none text-white transition-all font-sans uppercase"
                        placeholder="e.g. Lahore"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-sans font-bold uppercase tracking-widest text-white/40">Your Transmission</label>
                    <textarea 
                      name="message"
                      rows={6}
                      className="w-full bg-dark border border-white/10 px-6 py-4 focus:border-accent outline-none text-white transition-all font-serif resize-none"
                      placeholder="Tell us what the industry is missing..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-white py-6 font-sans font-black uppercase tracking-[0.3em] flex items-center justify-center group active:scale-[0.98] transition-all glitch-hover disabled:opacity-50"
                    data-hover={loading ? "TRANSMITTING..." : "SEND TRANSMISSION"}
                  >
                    {loading ? "Processing..." : "Initiate Contact"}
                    <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
                  </button>

                  <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.2em]">
                    We read every message personally. You’ll hear back within 48 hours.
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center flex flex-col items-center"
              >
                <div className="p-6 bg-accent rounded-full mb-12">
                  <CircleCheck size={64} className="text-white" />
                </div>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">Received <span className="text-accent italic">&</span> Vetted.</h3>
                <p className="text-xl text-white/60 font-serif italic max-w-sm mb-12">
                  The future doesn't wait, but our team needs a moment to process your genius. Stay tuned.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="font-sans font-bold uppercase tracking-widest text-accent hover:text-white transition-colors border-b-2 border-accent"
                >
                  Send another transmission
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-20 gap-12">
          <div className="text-center md:text-left">
            <h5 className="font-sans font-black uppercase text-accent mb-2">Pakistan Operations</h5>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tighter uppercase leading-[1] md:leading-[0.8]">LAHORE <span className="text-white/20 italic">HQ</span></h2>
            <p className="text-white/40 font-serif text-base sm:text-lg mt-4 italic">Gulberg III, Main Boulevard, Lahore 54000</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-4 md:gap-x-12 opacity-20 hover:opacity-100 transition-opacity">
            <span className="text-2xl sm:text-4xl font-black italic select-none text-accent">ISLAMABAD</span>
            <span className="text-2xl sm:text-4xl font-black italic select-none">KARACHI</span>
            <span className="text-2xl sm:text-4xl font-black italic select-none">FAISALABAD</span>
            <span className="text-2xl sm:text-4xl font-black italic select-none">MULTAN</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
