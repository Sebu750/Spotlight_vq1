import { motion } from 'motion/react';
import { Target, Globe, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <section className="px-6 py-12 md:py-20 bg-dark border-b border-white/10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between relative z-10 gap-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-8 leading-[1] md:leading-[0.8] tracking-tighter">
              THE <br /><span className="text-stroke">MANIFESTO.</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/70 font-serif italic max-w-xl leading-relaxed">
              We didn't start Spotlight to follow patterns. We started it to break them. 
              The industry is gated; we provide the key.
            </p>
          </div>
          <div className="hidden lg:block">
            <span className="text-[10rem] xl:text-[15rem] font-sans font-black text-white/5 select-none leading-none -mb-12">EST.2023</span>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="aspect-[4/5] bg-white/5 border border-white/10 overflow-hidden grayscale">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop" 
            alt="Fashion studio" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-4xl md:text-6xl font-black mb-12">FOUNDING <span className="text-accent underline">STORY</span></h2>
          <p className="text-xl text-white/70 leading-relaxed font-serif mb-8">
            The fashion industry is notoriously difficult to penetrate. Access to capital, 
            manufacturing resources, and distribution networks often depends more on 
            who you know than what you can create. We saw a gap where raw brilliance 
            was being suffocated by bureaucracy and nepotism.
          </p>
          <p className="text-xl text-white/70 leading-relaxed font-serif">
            Spotlight was born from a simple, rebellious premise: Talent should be the only 
            requirement for entry. We combined the speed of a tech accelerator with the 
            prestige of a heritage competition to create a platform that doesn't just 
            award prizes—it builds sustainable businesses.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-32 px-6 bg-white text-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-20 text-center uppercase tracking-tighter italic">Values over metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Target />, title: "Democratizing Access", desc: "Your background shouldn't limit your potential. We fund merit, not resumes." },
              { icon: <Zap />, title: "Raw Talent First", desc: "A great idea in a sketchbook is worth more than a bad one in silk." },
              { icon: <ShieldCheck />, title: "Non-Negotiable Ethics", desc: "Sustainability and fair labor aren't perks; they're the standard." },
              { icon: <Globe />, title: "Global Perspective", desc: "Fashion has no borders. We search every continent for the next icon." }
            ].map((v, i) => (
              <div key={i} className="p-10 border border-dark/10 group hover:bg-dark hover:text-white transition-all duration-500 flex flex-col items-center text-center">
                <div className="mb-8 p-4 rounded-full bg-accent text-white group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <h4 className="text-xl font-bold mb-6 font-sans uppercase tracking-widest">{v.title}</h4>
                <p className="text-dark/60 group-hover:text-white/60 leading-relaxed font-serif">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black mb-20">THE <span className="text-accent">CORE</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: "Julian Valez", role: "Founder & Creative Director", quirk: "Ex-Vogue editor who still hand-writes thank you notes", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2574&auto=format&fit=crop" },
            { name: "Sarah Chen", role: "Head of Strategy", quirk: "Can identify any fabric weave by touch alone", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" },
            { name: "Marcus Thorne", role: "Venture Lead", quirk: "Unhealthily obsessed with 90's brutalist architecture", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2574&auto=format&fit=crop" }
          ].map((member, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="aspect-square bg-white/5 border border-white/10 overflow-hidden mb-8 relative">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute top-4 right-4 bg-accent text-white p-2 text-[10px] uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Active
                </div>
              </div>
              <h4 className="text-2xl font-black uppercase mb-1">{member.name}</h4>
              <p className="text-accent font-sans font-bold text-xs uppercase tracking-widest mb-4">{member.role}</p>
              <p className="text-white/40 italic font-serif leading-relaxed">"{member.quirk}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Press */}
      <section className="py-24 px-6 border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase max-w-xs leading-none text-center lg:text-left">AS FEATURED IN <span className="text-accent underline">THE PRESS</span></h3>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-24 opacity-30">
            <span className="text-xl sm:text-2xl font-bold font-sans uppercase">Business of Fashion</span>
            <span className="text-xl sm:text-2xl font-bold font-sans uppercase">Vogue Business</span>
            <span className="text-xl sm:text-2xl font-bold font-sans uppercase">Forbes</span>
            <span className="text-xl sm:text-2xl font-bold font-sans uppercase">Wallpaper*</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto border-4 border-accent p-12 md:p-24 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-dark px-8">
            <Zap size={48} className="text-accent shrink-0" />
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-12 uppercase tracking-tighter leading-none italic">Join the movement.</h2>
          <div className="flex flex-col sm:row justify-center items-center gap-8">
            <Link to="/apply" className="bg-white text-dark px-10 py-5 font-sans font-black uppercase tracking-widest text-lg hover:bg-accent hover:text-white transition-all w-full sm:w-auto">
              Apply Now
            </Link>
            <Link to="/contact" className="border border-white/20 px-10 py-5 font-sans font-bold uppercase tracking-widest text-lg hover:border-white transition-all w-full sm:w-auto">
              Become a Sponsor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
