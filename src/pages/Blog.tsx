import { motion } from 'motion/react';
import { Search, ArrowRight, Bookmark, Clock, Share2, Tag, Mail, Loader2, Check } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';
import { subscribeToNewsletter } from '../lib/newsletterService';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [mobileEmail, setMobileEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [mobileStatus, setMobileStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const categories = ['All', 'Interview', 'Industry Insights', 'Competition Tips', 'Designer Spotlight', 'Behind-the-Scenes'];

  const handleSubscribe = async (e: React.FormEvent, isMobile: boolean = false) => {
    e.preventDefault();
    const targetEmail = isMobile ? mobileEmail : email;
    const setTargetStatus = isMobile ? setMobileStatus : setStatus;
    const setTargetEmail = isMobile ? setMobileEmail : setEmail;

    if (!targetEmail || !targetEmail.includes('@')) return;

    setTargetStatus('loading');
    try {
      const result = await subscribeToNewsletter(targetEmail, isMobile ? 'blog_mobile' : 'blog_sidebar');
      if (result.success) {
        setTargetStatus('success');
        setTargetEmail('');
        setTimeout(() => setTargetStatus('idle'), 5000);
      } else {
        setTargetStatus('error');
      }
    } catch (err) {
      setTargetStatus('error');
    }
  };

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="pt-24 min-h-screen">
      {/* Featured Header */}
      <section className="px-6 pb-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[1] md:leading-[0.8] mb-12 uppercase italic relative">
            THE <br /><span className="text-white ml-0 md:ml-40 lg:ml-60">CHRONICLES</span>
            <span className="hidden sm:block absolute -top-10 -right-10 text-[20vw] text-accent opacity-5 font-sans italic select-none">READ.</span>
          </h1>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mt-12 md:mt-20">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-6 py-2 font-sans font-bold uppercase text-[9px] sm:text-[10px] tracking-widest transition-all ${
                    activeCategory === cat ? 'bg-accent text-white' : 'bg-white/5 text-white/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-96 group order-first lg:order-last">
              <input 
                type="text" 
                placeholder="SEARCH ARCHIVE..." 
                className="w-full bg-transparent border-b border-white/20 py-4 font-sans text-xs tracking-widest outline-none focus:border-accent transition-all pl-10"
              />
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Article Grid */}
          <div className="lg:col-span-8">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-24"
            >
              {filteredArticles.map((article, idx) => (
                <motion.article 
                  key={article.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="group flex flex-col md:flex-row gap-10 items-start"
                >
                <div className="w-full md:w-2/5 aspect-[4/3] bg-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-4 left-4 bg-dark text-[10px] font-sans font-black uppercase tracking-widest px-3 py-1 shadow-2xl">
                    {article.category}
                  </div>
                </div>
                <div className="w-full md:w-3/5 flex flex-col items-start pt-2">
                  <div className="flex items-center gap-6 text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest mb-6">
                    <span className="flex items-center"><Clock size={12} className="mr-2" /> {article.readTime}</span>
                    <span>{article.date}</span>
                  </div>
                  <Link to={`/blog/${article.id}`} className="block group/link">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 leading-none group-hover/link:text-accent transition-colors tracking-tight">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-white/60 text-lg font-serif italic mb-8 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between w-full border-t border-white/5 pt-6 mt-auto">
                    <span className="text-xs font-sans font-black uppercase tracking-widest text-accent">By {article.author}</span>
                    <Link to={`/blog/${article.id}`} className="flex items-center font-sans font-black uppercase text-xs tracking-[0.2em] group/btn hover:text-accent transition-colors">
                      Read Article <ArrowRight className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
          
          <div className="pt-20 flex justify-center">
              <button className="border-4 border-white text-white px-12 py-5 font-sans font-black uppercase tracking-[0.3em] hover:bg-white hover:text-dark transition-all">
                Load More Archives
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-16">
            <div className="sticky top-32 space-y-16">
              
              {/* Featured / Most Read */}
              <div>
                <h4 className="text-xs font-sans font-black uppercase tracking-widest text-white/40 mb-8 border-b border-white/10 pb-4 flex items-center justify-between">
                  Vanguard Pick
                  <Bookmark size={12} className="text-accent" />
                </h4>
                <div className="space-y-8">
                  {articles.slice(0, 2).map((item) => (
                    <Link key={item.id} to={`/blog/${item.id}`} className="group flex gap-4 items-start">
                      <div className="w-20 aspect-square overflow-hidden grayscale group-hover:grayscale-0 transition-all shrink-0 bg-white/5 border border-white/5">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div>
                        <span className="text-[8px] font-sans font-black text-accent uppercase tracking-widest mb-1 block">{item.category}</span>
                        <h5 className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                          {item.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="p-8 bg-accent border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 opacity-10 -mr-10 -mt-10 group-hover:rotate-12 transition-transform duration-700">
                  <Mail size={200} className="text-white" />
                </div>
                <h4 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter relative z-10">THE FUTURE IN YOUR INBOX.</h4>
                <p className="text-white/80 font-serif italic mb-8 relative z-10 text-sm">Join 15,000+ industry shakers. No fluff, just signal.</p>
                <form onSubmit={(e) => handleSubscribe(e)} className="space-y-4 relative z-10">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={status === 'success' ? "CHRONICLED." : "EMAIL@FUTURE.COM"}
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-white/20 border border-white/20 px-6 py-4 outline-none focus:bg-white focus:text-dark transition-all font-sans text-xs tracking-widest placeholder:text-white/50 uppercase font-bold disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full bg-white text-accent py-4 font-sans font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? <Loader2 size={16} className="animate-spin text-accent" /> : 
                     status === 'success' ? <Check size={16} /> : "Subscribe"}
                  </button>
                  {status === 'error' && <p className="text-[10px] text-white/60 font-sans font-bold uppercase tracking-widest">Link Lost. Try again.</p>}
                </form>
              </div>

              {/* Trending Tags */}
              <div>
                <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-white/40 mb-8 border-b border-white/10 pb-4">Trending Disruption</h4>
                <div className="flex flex-wrap gap-2">
                  {['#AI_FASHION', '#GEN_Z_LUXURY', '#UPCYCLING', '#DIGITAL_COUTURE', '#NYC_SCENE', '#FUNDING', '#ACCELERATOR'].map(tag => (
                    <a key={tag} href="#" className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-sans font-bold text-white/60 hover:text-accent hover:border-accent transition-all uppercase tracking-widest">
                      {tag}
                    </a>
                  ))}
                </div>
              </div>

              {/* Apply Mini Banner */}
              <div className="aspect-square bg-white relative overflow-hidden group border border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1544441892-0b291d646b9a?q=80&w=2670&auto=format&fit=crop" 
                  className="w-full h-full object-cover grayscale brightness-[0.3] group-hover:brightness-50 group-hover:scale-110 transition-all duration-1000" 
                  alt="Runway"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <span className="text-[10px] font-sans font-black text-accent uppercase tracking-[0.4em] mb-4">SEASON 04</span>
                  <h3 className="text-white text-4xl font-black uppercase tracking-tighter mb-8 transition-transform">Your Work. <br />Our Stage.</h3>
                  <Link to="/apply" className="bg-accent text-white px-8 py-4 font-sans font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-white hover:text-accent transition-colors">
                    Apply Now
                  </Link>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-1">
                   <div className="w-1 h-1 bg-accent"></div>
                   <div className="w-1 h-1 bg-accent opacity-50"></div>
                   <div className="w-1 h-1 bg-accent opacity-25"></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Newsletter (Mobile Only visible footer) */}
      <section className="lg:hidden px-6 py-20 bg-accent text-center">
        <h3 className="text-4xl font-black mb-8 uppercase tracking-tighter italic">Join the vanguard.</h3>
        <form onSubmit={(e) => handleSubscribe(e, true)} className="max-w-md mx-auto space-y-4">
          <input 
            type="email" 
            value={mobileEmail}
            onChange={(e) => setMobileEmail(e.target.value)}
            placeholder={mobileStatus === 'success' ? "CHRONICLED." : "EMAIL@FUTURE.COM"}
            disabled={mobileStatus === 'loading' || mobileStatus === 'success'}
            className="w-full bg-white/20 border border-white/20 px-6 py-4 outline-none focus:bg-white focus:text-dark transition-all font-sans text-xs tracking-widest disabled:opacity-50 uppercase font-bold"
          />
          <button 
            type="submit"
            disabled={mobileStatus === 'loading' || mobileStatus === 'success'}
            className="w-full bg-white text-accent py-4 font-sans font-black uppercase text-sm tracking-widest shadow-2xl flex items-center justify-center gap-2"
          >
            {mobileStatus === 'loading' ? <Loader2 size={16} className="animate-spin text-accent" /> : 
             mobileStatus === 'success' ? <Check size={16} /> : "Subscribe"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Blog;
