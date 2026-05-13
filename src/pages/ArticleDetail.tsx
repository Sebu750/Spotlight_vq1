import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Share2, Bookmark, Twitter, Linkedin, Facebook, Copy, MessageSquare, Mail } from 'lucide-react';
import { articles } from '../data/articles';
import { useEffect } from 'react';

const ArticleDetail = () => {
  const { id } = useParams();
  const article = articles.find(a => a.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-black uppercase mb-8">Transmission Lost.</h1>
        <p className="text-white/60 font-serif italic mb-8">The archive you're looking for does not exist in our database.</p>
        <Link to="/blog" className="px-8 py-4 bg-accent text-white font-sans font-black uppercase tracking-widest text-xs">
          Return to Chronicles
        </Link>
      </div>
    );
  }

  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="pt-24 min-h-screen">
      {/* Background Decorative Element */}
      <div className="fixed top-0 right-0 w-1/3 h-full bg-accent opacity-[0.02] pointer-events-none z-0" />

      <article className="max-w-4xl mx-auto px-6 pb-32 relative z-10">
        {/* Back Link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center text-accent font-sans font-black uppercase text-[10px] tracking-[0.3em] mb-12 hover:-translate-x-2 transition-transform"
        >
          <ArrowLeft size={14} className="mr-2" /> Back to Chronicles
        </Link>

        {/* Header */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest mb-6"
          >
            <span className="bg-white/5 border border-white/10 px-3 py-1 text-accent">{article.category}</span>
            <span className="flex items-center"><Clock size={12} className="mr-2" /> {article.readTime}</span>
            <span>{article.date}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black mb-10 leading-[0.9] tracking-tighter"
          >
            {article.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between border-y border-white/10 py-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 flex items-center justify-center font-sans font-black text-accent border border-white/5 italic">
                {article.author.charAt(0)}
              </div>
              <div>
                <span className="block text-xs font-sans font-black uppercase tracking-widest">By {article.author}</span>
                <span className="block text-[10px] font-sans font-medium text-white/40 uppercase tracking-widest mt-1">Contributor • Spotlight Archive</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {[Twitter, Linkedin, Facebook, Copy].map((Icon, idx) => (
                <button key={idx} className="w-10 h-10 border border-white/5 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent transition-all">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </motion.div>
        </header>

        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16 aspect-[21/9] bg-white/5 grayscale overflow-hidden"
        >
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Article Body */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div 
            className="font-serif italic text-white/80 leading-relaxed space-y-8 first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-accent first-letter:leading-none markdown-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Interruption / Mid-article CTA */}
        <div className="my-20 p-12 bg-dark border-4 border-accent relative overflow-hidden group">
          <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Is your transmission ready?</h3>
            <p className="text-white/60 font-serif italic mb-8 max-w-xl mx-auto">Applications for the Winter '26 cohort are currently open. We don't care about your resume; we care about your vision.</p>
            <Link to="/apply" className="inline-block bg-accent text-white px-10 py-5 font-sans font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-2xl">
              Initiate Application
            </Link>
          </div>
        </div>

        {/* Share & Feedback */}
        <footer className="mt-20 pt-12 border-t border-white/10 flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-sans font-black uppercase tracking-widest text-white/40">Spread the signal:</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-accent hover:text-white transition-all font-sans font-bold uppercase text-[9px] tracking-widest">
                <Share2 size={12} /> Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-accent hover:text-white transition-all font-sans font-bold uppercase text-[9px] tracking-widest">
                <Bookmark size={12} /> Save
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <MessageSquare size={16} className="text-accent" />
             <span className="text-xs font-sans italic text-white/60">12 comments on this archive</span>
          </div>
        </footer>
      </article>

      {/* Related Content */}
      <section className="px-6 py-24 bg-white/[0.02] border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-accent mb-4 block">Synchronized</span>
              <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Further <br />Transmissions</h2>
            </div>
            <Link to="/blog" className="hidden md:flex items-center font-sans font-black uppercase text-xs tracking-widest border-b-2 border-white/10 pb-1 hover:border-accent transition-all">
              View All <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {relatedArticles.length > 0 ? relatedArticles.map((item) => (
              <Link key={item.id} to={`/blog/${item.id}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 mb-6 bg-white/5">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <span className="text-[9px] font-sans font-black text-accent uppercase tracking-widest mb-3 block">{item.category}</span>
                <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
              </Link>
            )) : articles.slice(0, 3).map((item) => (
              <Link key={item.id} to={`/blog/${item.id}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 mb-6 bg-white/5">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <span className="text-[9px] font-sans font-black text-accent uppercase tracking-widest mb-3 block">{item.category}</span>
                <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-32 bg-accent text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 -mr-20 -mt-20 rotate-12">
          <Mail size={400} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.8] mb-12">DON'T MISS THE <br />NEXT DROP.</h2>
          <p className="text-white/80 font-serif text-xl italic mb-12 max-w-2xl mx-auto leading-relaxed">Join the inner circle. Get first access to competition drops, designer interviews, and exclusive NYC event invites.</p>
          <div className="flex flex-col md:row items-center gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="EMAIL@FUTURE.COM" 
              className="w-full bg-white/10 border-2 border-white/20 px-8 py-6 outline-none focus:bg-white focus:text-accent transition-all font-sans font-black uppercase text-sm tracking-widest placeholder:text-white/40"
            />
            <button className="w-full md:w-auto px-12 py-6 bg-white text-accent font-sans font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticleDetail;
