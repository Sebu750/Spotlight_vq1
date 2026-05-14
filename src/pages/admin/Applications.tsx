import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock,
  AlertCircle,
  MoreVertical,
  Mail,
  Tag,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const PAKISTAN_PROVINCES = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
  'Gilgit-Baltistan', 'Azad Jammu & Kashmir', 'Islamabad Capital Territory'
];

const Applications = () => {
  const [data, setData] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const colPath = 'applications';
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
      setError('Connection dropped. Authentication check failed or server timeout.');
      setFetching(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const docPath = `applications/${id}`;
    try {
      await updateDoc(doc(db, 'applications', id), { status: newStatus });
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes('permission')) {
        handleFirestoreError(err, OperationType.WRITE, docPath);
      }
    }
  };

  const deleteApplication = async (id: string) => {
    const docPath = `applications/${id}`;
    if (!window.confirm('TERMINATE APPLICATION? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'applications', id));
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes('permission')) {
        handleFirestoreError(err, OperationType.DELETE, docPath);
      }
    }
  };

  const viewDetails = (item: any) => {
    setSelectedApp(item);
    setShowDetailsModal(true);
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.fullName.toLowerCase().includes(search.toLowerCase()) || 
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesRegion = regionFilter === 'ALL' || item.province === regionFilter;
    
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-accent mb-2">Personnel Review • Pakistan Branch</h2>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Designer Pool.</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select 
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-white/5 border border-white/10 px-4 py-4 font-sans text-[10px] tracking-widest uppercase font-bold outline-none focus:border-accent transition-all text-white"
          >
            <option value="ALL">ALL PROVINCES</option>
            {PAKISTAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH BY NAME OR TRACK..." 
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 font-sans text-[10px] tracking-widest uppercase font-bold outline-none focus:border-accent transition-all text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 overflow-hidden">
        {fetching ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
             <div className="relative">
                <Loader2 className="text-accent animate-spin" size={40} />
                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full"></div>
             </div>
             <span className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-white/40">Intercepting Stream...</span>
          </div>
        ) : error ? (
          <div className="py-32 flex flex-col items-center justify-center text-center px-6">
            <AlertCircle className="text-red-500 mb-4" size={40} />
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Protocol Error</h3>
            <p className="text-white/60 font-serif italic max-w-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 text-accent font-sans font-black uppercase text-[10px] tracking-widest hover:underline"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center text-white/20">
            <div className="w-16 h-16 border border-white/5 rounded-full flex items-center justify-center mb-6">
              <Clock size={32} />
            </div>
            <p className="font-sans font-black uppercase tracking-widest text-[10px]">No transmissions keyed to this signature.</p>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-sans font-black uppercase tracking-widest text-white/40">Identity</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-black uppercase tracking-widest text-white/40">Contact / Track</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-black uppercase tracking-widest text-white/40">Timestamp</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-black uppercase tracking-widest text-white/40">Status</th>
                  <th className="px-8 py-6 text-[10px] font-sans font-black uppercase tracking-widest text-white/40 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.03] transition-all">
                    <td className="px-8 py-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black uppercase text-white/20">
                             {item.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="block text-sm font-black uppercase tracking-tight">{item.fullName}</span>
                            <div className="flex items-center gap-2 mt-1">
                               <Tag size={10} className="text-accent" />
                               <span className="text-[9px] font-sans font-bold text-white/40 uppercase tracking-widest">{item.category}</span>
                            </div>
                          </div>
                       </div>
                    </td>

                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2 text-[10px] font-sans font-black uppercase tracking-widest text-white/60 mb-1">
                         <Mail size={12} className="text-white/20" />
                         {item.email}
                      </div>
                      <span className="block text-[9px] font-sans font-bold text-accent/60 uppercase tracking-widest">{item.city || 'Karachi'} • {item.province || 'Pakistan HQ'}</span>
                    </td>

                    <td className="px-8 py-8 text-[10px] font-sans font-black uppercase tracking-widest text-right sm:text-left">
                       <span className="text-white/40 block mb-1">
                        {item.createdAt.toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })}
                       </span>
                       <span className="text-accent/40 block text-[9px]">
                        {item.createdAt.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
                       </span>
                    </td>

                    <td className="px-8 py-8">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 text-[8px] font-sans font-black uppercase tracking-widest skew-x-[-15deg] ${
                        item.status === 'accepted' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' :
                        item.status === 'rejected' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                        'bg-white/10 text-white/40 border border-white/20'
                      }`}>
                         <span className="skew-x-[15deg]">{item.status}</span>
                      </div>
                    </td>

                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => updateStatus(item.id, 'accepted')}
                          className="w-10 h-10 flex items-center justify-center bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white transition-all shadow-xl"
                          title="Authorize"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button 
                          onClick={() => updateStatus(item.id, 'rejected')}
                          className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                          title="Decline"
                        >
                          <XCircle size={16} />
                        </button>
                        <button 
                          onClick={() => viewDetails(item)}
                          className="w-10 h-10 flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all shadow-xl"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => deleteApplication(item.id)}
                          className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                          title="Delete"
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

      {/* Bulk Controls */}
      <div className="flex justify-between items-center bg-[#111] p-6 border border-white/10">
         <div className="flex gap-12">
            <div>
               <span className="block text-[8px] font-sans font-bold text-white/40 uppercase tracking-widest mb-1">Authenticated</span>
               <span className="text-xl font-black uppercase italic tracking-tighter">{data.length} Transmissions</span>
            </div>
            <div>
               <span className="block text-[8px] font-sans font-bold text-white/40 uppercase tracking-widest mb-1">Action Rate</span>
               <span className="text-xl font-black uppercase italic tracking-tighter">100% Signal</span>
            </div>
         </div>
         <button className="bg-white text-dark px-10 py-4 font-sans font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-white transition-all shadow-2xl flex items-center gap-3">
           <Download size={14} /> Batch Export Archive
         </button>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedApp && (
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

            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-none">APPLICATION <br /><span className="text-accent italic">DETAILS</span></h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Full Name</label>
                  <p className="text-white font-sans font-black uppercase tracking-tight">{selectedApp.fullName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Email</label>
                  <p className="text-white font-sans font-black uppercase tracking-tight">{selectedApp.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Category</label>
                  <p className="text-accent font-sans font-black uppercase tracking-tight">{selectedApp.category}</p>
                </div>
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Status</label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-sans font-black uppercase tracking-widest ${
                    selectedApp.status === 'accepted' ? 'bg-green-500 text-white' :
                    selectedApp.status === 'rejected' ? 'bg-red-500 text-white' :
                    'bg-white/10 text-white/40 border border-white/20'
                  }`}>
                    {selectedApp.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">City</label>
                  <p className="text-white font-sans font-black uppercase tracking-tight">{selectedApp.city || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Province</label>
                  <p className="text-white font-sans font-black uppercase tracking-tight">{selectedApp.province || 'N/A'}</p>
                </div>
              </div>

              {selectedApp.portfolioLinks && (
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Portfolio Links</label>
                  <p className="text-white font-serif italic whitespace-pre-wrap">{selectedApp.portfolioLinks}</p>
                </div>
              )}

              {selectedApp.statement && (
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Personal Statement</label>
                  <p className="text-white font-serif italic whitespace-pre-wrap">{selectedApp.statement}</p>
                </div>
              )}

              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/40 block mb-2">Submitted At</label>
                <p className="text-white/60 font-mono text-xs">
                  {selectedApp.createdAt.toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })} @ {selectedApp.createdAt.toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/10">
                <button 
                  onClick={() => { updateStatus(selectedApp.id, 'accepted'); setSelectedApp({...selectedApp, status: 'accepted'}); }}
                  className="flex-1 bg-green-500/10 text-green-500 border border-green-500/20 py-4 font-sans font-black uppercase tracking-widest text-[10px] hover:bg-green-500 hover:text-white transition-all"
                >
                  <CheckCircle2 size={14} className="inline mr-2" /> Authorize
                </button>
                <button 
                  onClick={() => { updateStatus(selectedApp.id, 'rejected'); setSelectedApp({...selectedApp, status: 'rejected'}); }}
                  className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-4 font-sans font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all"
                >
                  <XCircle size={14} className="inline mr-2" /> Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
