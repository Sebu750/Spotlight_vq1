/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, createContext, useContext, ReactNode, Suspense, lazy } from 'react';
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import ArticleDetail from './pages/ArticleDetail';
import { Menu, X, Shield, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

// Lazy load admin components for code splitting
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Insights = lazy(() => import('./pages/admin/Insights'));
const Applications = lazy(() => import('./pages/admin/Applications'));
const Subscribers = lazy(() => import('./pages/admin/Subscribers'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));

// Context to share modal state
export const ModalContext = createContext({
  isModalOpen: false,
  setModalOpen: (open: boolean) => {},
});

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setModalOpen } = useContext(ModalContext);
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark z-[99] flex flex-col justify-center items-center p-8 space-y-8 md:hidden h-screen"
          >
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center border-b border-white/5">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-sans font-black tracking-tighter text-white uppercase">
                SPOTLIGHT<span className="text-accent">.</span>
              </Link>
              <button className="text-white" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center space-y-10 w-full">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-full text-center"
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className="font-sans font-black uppercase text-5xl sm:text-6xl tracking-tighter text-white hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                onClick={() => {
                  setIsOpen(false);
                  setModalOpen(true);
                }}
                className="bg-accent text-white w-full max-w-xs py-6 font-sans font-black uppercase tracking-[0.2em] shadow-2xl skew-btn"
              >
                Apply Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
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
          <li><a href="https://instagram.com/adorziaofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
          <li><a href="https://tiktok.com/@adorziaofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white">TikTok</a></li>
          <li><a href="https://linkedin.com/company/adorzia" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
          <li><a href="https://wa.me/923059064253" target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between text-white/30 text-xs tracking-widest uppercase gap-6">
      <p className="text-center md:text-left">© 2026 Spotlight Global. All rights reserved.</p>
      <div className="flex space-x-6 items-center">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Entry</a>
        <Link to="/admin" className="ml-4 px-4 py-2 border border-white/20 text-white/40 hover:text-white hover:border-accent hover:text-accent transition-all">
          ...
        </Link>
      </div>
    </div>
  </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  return (
    <ModalContext.Provider value={{ isModalOpen, setModalOpen }}>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col pt-16">
        <Navigation />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            {/* @ts-ignore - location and key are used for AnimatePresence transitions */}
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
              <Route path="/blog/:id" element={<PageWrapper><ArticleDetail /></PageWrapper>} />
              <Route path="/apply" element={<PageWrapper><Landing /></PageWrapper>} />
              
              {/* Admin Portal */}
              <Route path="/admin" element={
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center bg-dark">
                    <div className="text-center">
                      <Loader2 className="text-accent animate-spin mx-auto mb-4" size={48} />
                      <p className="text-white/40 font-sans font-black uppercase text-[10px] tracking-widest">Loading Admin Panel...</p>
                    </div>
                  </div>
                }>
                  <AdminLayout />
                </Suspense>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={
                  <Suspense fallback={
                    <div className="flex items-center justify-center py-32">
                      <Loader2 className="text-accent animate-spin" size={32} />
                    </div>
                  }>
                    <Insights />
                  </Suspense>
                } />
                <Route path="applications" element={
                  <Suspense fallback={
                    <div className="flex items-center justify-center py-32">
                      <Loader2 className="text-accent animate-spin" size={32} />
                    </div>
                  }>
                    <Applications />
                  </Suspense>
                } />
                <Route path="subscribers" element={
                  <Suspense fallback={
                    <div className="flex items-center justify-center py-32">
                      <Loader2 className="text-accent animate-spin" size={32} />
                    </div>
                  }>
                    <Subscribers />
                  </Suspense>
                } />
                <Route path="inquiries" element={
                  <Suspense fallback={
                    <div className="flex items-center justify-center py-32">
                      <Loader2 className="text-accent animate-spin" size={32} />
                    </div>
                  }>
                    <Inquiries />
                  </Suspense>
                } />
              </Route>
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </ModalContext.Provider>
  );
}
