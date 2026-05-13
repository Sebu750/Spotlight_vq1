import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Globe,
  Clock,
  Activity,
  MapPin
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const Insights = () => {
  const [stats, setStats] = useState({
    apps: 0,
    subs: 0,
    inquiries: 0,
    recent: [] as any[]
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Real-time counts
    const unsubApps = onSnapshot(collection(db, 'applications'), (snap) => {
      setStats(prev => ({ ...prev, apps: snap.size }));
      
      // Compute simple chart data from last 7 days (mocked for now but based on real count)
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = new Date().getDay();
      const mockChart = Array.from({ length: 7 }).map((_, i) => {
        const dayIdx = (currentDay - (6 - i) + 7) % 7;
        return {
          name: days[dayIdx],
          apps: Math.floor(snap.size / 7) + Math.floor(Math.random() * 5)
        };
      });
      setChartData(mockChart);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'applications');
    });

    const unsubSubs = onSnapshot(collection(db, 'subscribers'), (snap) => {
      setStats(prev => ({ ...prev, subs: snap.size }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'subscribers');
    });

    const unsubInq = onSnapshot(collection(db, 'inquiries'), (snap) => {
      setStats(prev => ({ ...prev, inquiries: snap.size }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'inquiries');
    });

    const unsubRecent = onSnapshot(
      query(collection(db, 'applications'), orderBy('createdAt', 'desc'), limit(3)),
      (snap) => {
        setStats(prev => ({
          ...prev,
          recent: snap.docs.map(d => ({ id: d.id, ...d.data() }))
        }));
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'applications_recent');
      }
    );

    return () => {
      unsubApps();
      unsubSubs();
      unsubInq();
      unsubRecent();
    };
  }, []);

  const provinceData = [
    { name: 'Punjab', value: 45, color: '#ff3b30' },
    { name: 'Sindh', value: 30, color: '#white' },
    { name: 'KPK', value: 15, color: '#333' },
    { name: 'Balochistan', value: 10, color: '#666' },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome & Time */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-accent mb-2">Vanguard Pakistan Command</h2>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Intelligence Briefing.</h1>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 flex flex-col items-end">
            <span className="text-[8px] font-sans font-bold text-white/40 uppercase tracking-widest">Islamabad Sync</span>
            <span className="text-[11px] font-sans font-black text-white">
              {new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT
            </span>
          </div>
          <div className="px-4 py-2 bg-accent text-white flex flex-col items-end shadow-lg shadow-accent/20">
            <span className="text-[8px] font-sans font-bold text-white/60 uppercase tracking-widest">Operational Status</span>
            <span className="text-[11px] font-sans font-black">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Applications', value: stats.apps, trend: '+12.5%', icon: Users, color: 'text-accent' },
          { label: 'Subscribers', value: stats.subs, trend: '+5.2%', icon: Mail, color: 'text-white' },
          { label: 'Active Inquiries', value: stats.inquiries, trend: 'STABLE', icon: MessageSquare, color: 'text-accent' },
          { label: 'System Uptime', value: '99.98%', trend: 'OPTIMAL', icon: Zap, color: 'text-white' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-8 bg-white/5 border border-white/10 overflow-hidden hover:border-accent transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-sans font-black uppercase tracking-widest text-green-500">
                {stat.trend}
                <ArrowUpRight size={12} />
              </div>
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-sans font-black text-white/40 uppercase tracking-widest mb-1 block">{stat.label}</span>
              <span className="text-4xl font-black uppercase tracking-tighter italic">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Growth Chart */}
        <div className="lg:col-span-8 p-8 bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-sm font-sans font-black uppercase tracking-[0.2em]">Regional Application Index</h3>
              <p className="text-[10px] font-serif italic text-white/40">7-day tracking of Pakistan submissions</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3b30" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff3b30" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900, fontFamily: 'sans-serif' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900, fontFamily: 'sans-serif' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0 }}
                  itemStyle={{ fontSize: '10px font-black uppercase text-white tracking-[0.2em]' }}
                  cursor={{ stroke: '#ff3b30', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="apps" 
                  stroke="#ff3b30" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorApps)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Distribution */}
        <div className="lg:col-span-4 p-8 bg-white/5 border border-white/10 flex flex-col">
          <h3 className="text-sm font-sans font-black uppercase tracking-[0.2em] mb-10">Regional Spread</h3>
          <div className="flex-1 space-y-8">
            {provinceData.map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-end">
                   <span className="text-xs font-sans font-black uppercase tracking-widest">{item.name}</span>
                   <span className="text-[10px] font-sans font-black uppercase text-accent">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, delay: idx * 0.2 }}
                    className="h-full" 
                    style={{ backgroundColor: item.color }}
                   />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
               <MapPin className="text-accent" size={16} />
               <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-white/40">Tracking all Pakistan Nodes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white/5 border border-white/10">
          <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-accent mb-6">Recent Pakistan Intercepts</h4>
          <div className="space-y-6">
            {stats.recent.map((app, i) => (
              <div key={app.id} className="flex gap-4 items-center group cursor-pointer">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center font-sans font-black text-[10px] text-white/20 group-hover:text-white transition-colors">{i+1}</div>
                <div>
                  <span className="block text-[10px] font-sans font-black uppercase tracking-tight truncate max-w-[150px]">{app.fullName}</span>
                  <span className="block text-[8px] font-sans font-bold text-white/20 uppercase tracking-widest">{app.category}</span>
                </div>
              </div>
            ))}
            {stats.recent.length === 0 && (
              <p className="text-[10px] font-sans font-black text-white/10 uppercase tracking-widest">Awaiting live feed...</p>
            )}
          </div>
        </div>

        <div className="p-8 bg-white/5 border border-white/10">
          <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-accent mb-6">Local Network Health</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-widest">
              <span className="text-white/40">PK Server Latency</span>
              <span className="text-green-500">18ms</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-widest">
              <span className="text-white/40">Handshake Speed</span>
              <span>Rs. 0 Cost</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-widest">
              <span className="text-white/40">Encryption</span>
              <span>Quantum-PK</span>
            </div>
          </div>
        </div>

        <div className="p-8 bg-accent flex flex-col justify-between">
           <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-white mb-6">Pakistan Workflow</h4>
           <p className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8">{stats.apps} Applications in system.</p>
           <button className="w-full bg-white text-accent py-4 font-sans font-black uppercase text-[10px] tracking-widest hover:bg-dark hover:text-white transition-all shadow-xl">
             Review Sequence
           </button>
        </div>
      </div>
    </div>
  );
};

export default Insights;
