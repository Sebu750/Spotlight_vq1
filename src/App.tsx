/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import ArticleDetail from './pages/ArticleDetail';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, createContext, useContext } from 'react';

// Context to share modal state
export const ModalContext = createContext({
  isModalOpen: false,
  setModalOpen: (open: boolean) => {},
});

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setModalOpen } = useContext(ModalContext);
  const location = useLocation();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Articles', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-dark px-6 lg:px-12 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-xl bg-dark/90">
      <Link to="/" className="text-2xl font-sans font-black tracking-tighter text-white uppercase group">
        SPOTLIGHT<span className="text-accent group-hover:animate-pulse">.</span>
      </Link>
      
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-12">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            to={link.path} 
            className={`font-sans uppercase text-[11px] font-bold tracking-[0.2em] transition-all hover:text-accent ${location.pathname === link.path ? 'text-accent' : 'text-white/60'}`}
          >
            {link.name}
          </Link>
        ))}
        <button 
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 border-2 border-accent text-accent font-sans font-black uppercase text-[11px] tracking-[0.2em] hover:bg-accent hover:text-white transition-all duration-300"
        >
          Apply Now
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed inset-0 top-[77px] bg-dark z-[99] flex flex-col p-8 space-y-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className="font-sans font-black uppercase text-4xl tracking-tighter text-white border-b border-white/5 pb-4"
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => {
                setIsOpen(false);
                setModalOpen(true);
              }}
              className="bg-accent text-white w-full text-center py-6 font-sans font-black uppercase tracking-[0.2em]"
            >
              Apply Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6 mt-20">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="md:col-span-2">
        <h2 className="text-4xl font-sans font-black mb-6">SPOTLIGHT<span className="text-accent text-6xl">.</span></h2>
        <p className="max-w-md text-white/60 text-lg leading-relaxed">
          The venture accelerator for the next generation of global fashion talent. 
          Democratizing access to funding, mentorship, and industry infrastructure.
        </p>
      </div>
      <div>
        <h4 className="font-sans font-bold mb-6 text-accent">Navigation</h4>
        <ul className="space-y-4 text-white/80">
          <li><Link to="/about" className="hover:text-white">About</Link></li>
          <li><Link to="/blog" className="hover:text-white">Articles</Link></li>
          <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          <li><Link to="/apply" className="hover:text-white">Apply Now</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-sans font-bold mb-6 text-accent">Connect</h4>
        <ul className="space-y-4 text-white/80">
          <li><a href="#" className="hover:text-white">Instagram</a></li>
          <li><a href="#" className="hover:text-white">TikTok</a></li>
          <li><a href="#" className="hover:text-white">LinkedIn</a></li>
          <li><a href="#" className="hover:text-white">Discord</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-10 flex flex-col md:row items-center justify-between text-white/30 text-xs tracking-widest uppercase">
      <p>© 2026 Spotlight Global. All rights reserved.</p>
      <div className="flex space-x-6 mt-4 md:mt-0">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Entry</a>
      </div>
    </div>
  </footer>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Router>
      <ModalContext.Provider value={{ isModalOpen, setModalOpen }}>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col pt-16">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<ArticleDetail />} />
              <Route path="/apply" element={<Landing />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ModalContext.Provider>
    </Router>
  );
}
