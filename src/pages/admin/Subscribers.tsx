import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Download, 
  Clock,
  AlertCircle,
  Loader2,
  ExternalLink,
  Trash2,
  Filter
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

const Subscribers = () => {
  const [data, setData] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const colPath = 'subscribers';
    const q = query(collection(db, colPath), orderBy('createdAt', 'desc'));
    
    setFetching(true);
    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map(document => ({
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
      setError('Signal Lost. Unauthorized access or encryption mismatch.');
      setFetching(false);
    });

    return () => unsubscribe();
  }, []);

  const removeSubscriber = async (id: string) => {
    const docPath = `subscribers/${id}`;
    if (!window.confirm('TERMINATE TRANSMISSION? This will remove the address from the global loop.')) return;
    try {
      await deleteDoc(doc(db, 'subscribers', id));
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes('permission')) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    }
  };

  const filteredData = data.filter(item => 
    item.email.toLowerCase().includes(search.toLowerCase()) || 
    item.source?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-[10px] font-sans font-black tracking-[0.5em] text-accent mb-2">Newsletter subscribers</h2>
          <h1 className="text-5xl font-black tracking-tighter">Subscribers</h1>
        </div>
        <div className="flex gap-4 w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by email or source..." 
            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 font-sans text-[10px] tracking-widest uppercase font-bold outline-none focus:border-accent transition-all"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 overflow-hidden">
        {fetching ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
             <Loader2 className="text-accent animate-spin" size={40} />
             <span className="text-[10px] font-sans font-black tracking-[0.3em] text-white/40">Loading data...</span>
          </div>
        ) : error ? (
          <div className="py-32 flex flex-col items-center justify-center text-center px-6">
            <AlertCircle className="text-red-500 mb-4" size={40} />
            <h3 className="text-xl font-black tracking-tighter mb-2">Connection error</h3>
            <p className="text-white/60 font-serif italic max-w-sm">{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center text-white/20">
            <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center mb-6">
              <Mail size={32} />
            </div>
            <p className="font-sans font-black tracking-widest text-[10px]">No subscribers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-sans font-black tracking-widest text-white/40">Email</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-black tracking-widest text-white/40">Source</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-black tracking-widest text-white/40">Subscribed</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-black tracking-widest text-white/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.03] transition-all">
                    <td className="px-8 py-8 font-sans font-black uppercase tracking-widest text-sm">
                       {item.email}
                    </td>

                    <td className="px-8 py-8">
                       <span className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-sans font-black uppercase tracking-widest text-accent italic">
                          {item.source || 'GLOBAL_LOOP'}
                       </span>
                    </td>

                    <td className="px-8 py-8 text-[10px] font-sans font-black uppercase tracking-widest text-white/40">
                       {item.createdAt.toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })} @ {item.createdAt.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
                    </td>

                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => removeSubscriber(item.id)}
                          className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                          title="Purge"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribers;
