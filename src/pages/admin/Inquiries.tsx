import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Clock,
  AlertCircle,
  Loader2,
  Trash2,
  CheckCircle,
  ArrowRight,
  X,
  Mail,
  Building2,
  Tags
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc
} from 'firebase/firestore';

const Inquiries = () => {
  const [data, setData] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [markedAsRead, setMarkedAsRead] = useState<Set<string>>(new Set());

  useEffect(() => {
    const colPath = 'inquiries';
    const q = query(collection(db, colPath), orderBy('createdAt', 'desc'));
    
    setFetching(true);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(document => ({
        id: document.id,
        ...document.data(),
        createdAt: document.data().createdAt?.toDate() || new Date()
      }));
      setData(items);
      setFetching(false);
      setError(null);
    }, (err) => {
      console.error(err);
      if (err instanceof Error && err.message.includes('permission')) {
        try {
          handleFirestoreError(err, OperationType.GET, colPath);
        } catch (jsonErr: any) {
          setError(`Security Protocol Breach: ${jsonErr.message}`);
          return;
        }
      }
      setError('Communication Interrupted. Secure link severed.');
      setFetching(false);
    });

    return () => unsubscribe();
  }, []);

  const removeInquiry = async (id: string) => {
    const docPath = `inquiries/${id}`;
    if (!window.confirm('DELETE TRANSMISSION? This action is irreversible.')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes('permission')) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    }
  };

  const markAsRead = (id: string) => {
    setMarkedAsRead(prev => new Set(prev).add(id));
  };

  const viewDetails = (item: any) => {
    setSelectedInquiry(item);
    setShowDetailsModal(true);
    markAsRead(item.id);
  };

  const filteredData = data.filter(item => 
    item.fullName.toLowerCase().includes(search.toLowerCase()) || 
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.track?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-[10px] font-sans font-black tracking-[0.5em] text-accent mb-2">Contact messages</h2>
          <h1 className="text-5xl font-black tracking-tighter">Inquiries</h1>
        </div>
        <div className="flex gap-4 w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name or type..." 
            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 font-sans text-[10px] tracking-widest uppercase font-bold outline-none focus:border-accent transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fetching ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center gap-4">
             <Loader2 className="text-accent animate-spin" size={40} />
             <span className="text-[10px] font-sans font-black tracking-[0.3em] text-white/40">Loading data...</span>
          </div>
        ) : error ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center px-6">
            <AlertCircle className="text-red-500 mb-4" size={40} />
            <h3 className="text-xl font-black tracking-tighter mb-2">Connection error</h3>
            <p className="text-white/60 font-serif italic max-w-sm">{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center text-white/20">
            <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={32} />
            </div>
            <p className="font-sans font-black tracking-widest text-[10px]">No inquiries found.</p>
          </div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className={`group relative p-8 border transition-all ${
              markedAsRead.has(item.id) 
                ? 'bg-white/[0.02] border-white/5' 
                : 'bg-white/5 border-white/10 hover:border-accent'
            }`}>
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">{item.fullName}</h3>
                    <p className="text-[10px] font-sans font-black text-accent uppercase tracking-widest mt-1 italic">{item.track}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => viewDetails(item)}
                       className="p-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-xl"
                       title="View Details"
                     >
                       <ArrowRight size={16} />
                     </button>
                     <button 
                       onClick={() => { markAsRead(item.id); }}
                       className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-xl"
                       title="Mark as Read"
                     >
                       <CheckCircle size={16} />
                     </button>
                     <button 
                       onClick={() => removeInquiry(item.id)}
                       className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                       title="Delete"
                     >
                       <Trash2 size={16} />
                     </button>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-[10px] font-sans font-black uppercase tracking-widest text-white/40">
                     <Clock size={14} className="text-accent" />
                     {item.createdAt.toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })} @ {item.createdAt.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
                  </div>
                  <div className="p-6 bg-white/[0.03] border-l-2 border-accent">
                     <p className="text-sm font-serif italic text-white/80 leading-relaxed">
                        {item.email}
                     </p>
                  </div>
                  <button 
                    onClick={() => viewDetails(item)}
                    className="flex items-center gap-2 text-[10px] font-sans font-black uppercase tracking-widest text-accent hover:text-white transition-colors group/btn"
                  >
                    Open details <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedInquiry && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div 
            onClick={() => setShowDetailsModal(false)}
            className="absolute inset-0 bg-dark/95 backdrop-blur-xl"
          />
          <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl p-8 md:p-12 relative z-10 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowDetailsModal(false)} 
              className="absolute top-6 right-6 text-white/40 hover:text-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-4xl font-black tracking-tighter mb-8 leading-none">Inquiry <br /><span className="text-accent">details</span></h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Full Name</label>
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className="text-accent" />
                    <p className="text-white font-sans font-black uppercase tracking-tight">{selectedInquiry.fullName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Track</label>
                  <div className="flex items-center gap-3">
                    <Tags size={16} className="text-accent" />
                    <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-[10px] font-sans font-black uppercase tracking-widest text-accent italic">
                      {selectedInquiry.track}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Email</label>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-accent" />
                  <p className="text-white font-sans font-black uppercase tracking-tight">{selectedInquiry.email}</p>
                </div>
              </div>

              {selectedInquiry.company && (
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Company</label>
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-accent" />
                    <p className="text-white font-sans font-black uppercase tracking-tight">{selectedInquiry.company}</p>
                  </div>
                </div>
              )}

              {selectedInquiry.interests && selectedInquiry.interests.length > 0 && (
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedInquiry.interests.map((interest: string, idx: number) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-sans font-black uppercase tracking-widest text-white/60"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedInquiry.message && (
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Message</label>
                  <div className="p-6 bg-white/[0.03] border-l-2 border-accent">
                    <p className="text-white font-serif italic leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Received At</label>
                <p className="text-white/60 font-mono text-xs">
                  {selectedInquiry.createdAt.toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })} @ {selectedInquiry.createdAt.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/10">
                <a 
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.track} Inquiry from ${selectedInquiry.fullName}`}
                  className="flex-1 bg-accent/10 text-accent border border-accent/20 py-4 font-sans font-black tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all text-center"
                >
                  <Mail size={14} className="inline mr-2" /> Reply by email
                </a>
                <button 
                  onClick={() => removeInquiry(selectedInquiry.id)}
                  className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-4 font-sans font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={14} className="inline mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;
