import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Clock,
  AlertCircle,
  Loader2,
  Trash2,
  CheckCircle,
  ArrowRight
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

  const filteredData = data.filter(item => 
    item.fullName.toLowerCase().includes(search.toLowerCase()) || 
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.track?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-accent mb-2">Direct Intercepts</h2>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Inquiries.</h1>
        </div>
        <div className="flex gap-4 w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER BY TRACK, NAME..." 
            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 font-sans text-[10px] tracking-widest uppercase font-bold outline-none focus:border-accent transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {fetching ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center gap-4">
             <Loader2 className="text-accent animate-spin" size={40} />
             <span className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-white/40">Intercepting Stream...</span>
          </div>
        ) : error ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center px-6">
            <AlertCircle className="text-red-500 mb-4" size={40} />
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Protocol Error</h3>
            <p className="text-white/60 font-serif italic max-w-sm">{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center text-white/20">
            <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={32} />
            </div>
            <p className="font-sans font-black uppercase tracking-widest text-[10px]">No transmissions logged in this archive.</p>
          </div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="group relative p-8 bg-white/5 border border-white/10 hover:border-accent transition-all">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">{item.fullName}</h3>
                    <p className="text-[10px] font-sans font-black text-accent uppercase tracking-widest mt-1 italic">{item.track}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={() => removeInquiry(item.id)}
                       className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                     >
                       <Trash2 size={16} />
                     </button>
                     <button className="p-3 bg-white/5 text-white/40 hover:text-white transition-colors">
                       <CheckCircle size={16} />
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
                  <button className="flex items-center gap-2 text-[10px] font-sans font-black uppercase tracking-widest text-accent hover:text-white transition-colors group/btn">
                    Open Intercept <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inquiries;
