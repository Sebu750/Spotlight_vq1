import { motion } from 'motion/react';
import { Target, Globe, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import founder from '../assets/founder.png';
import team1 from '../assets/team1.jpg';
import partner1 from '../assets/s.png';
import partner2 from '../assets/o.png';
import partner3 from '../assets/l.png';
import partner4 from '../assets/i.png';
import partner5 from '../assets/g.png';



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
            src={team1} 
            alt="founder" 
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-4xl md:text-6xl font-black mb-12">FOUNDING <span className="text-accent underline">STORY</span></h2>
         
<p className="text-xl text-white/70 leading-relaxed font-serif mb-8">
  ADORZIA Spotlight is being built as a founding platform for designers who are ready to move beyond visibility and into ownership. This is not just a competition, it is an infrastructure for emerging fashion brands to be funded, produced, and scaled with real industry backing.
</p>

<p className="text-xl text-white/70 leading-relaxed font-serif">
  From first sketch to market-ready brand, we exist to give designers control over their IP, access to manufacturing and capital, and a direct pathway to market, without compromising creative independence. This is where future fashion founders are formed, not just selected.
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
              { icon: <Globe />, title: "Global Perspective", desc: "Focused on discovering and elevating Pakistan’s next generation of designers." }
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
            { name: "TBD", role: "Co-Founder & Creative Director", quirk: "Building ADORZIA as Pakistan's first designer accelerator focused on ownership, production, and scale.", img: team1 },
            { name: "TBD", role: "Head of Strategy", quirk: "Focused on shaping systems that turn Pakistan's emerging designers into market-ready brands.", img: team1 },
            { name: "TBD", role: "Venture Lead", quirk: "Backing design talent across Pakistan with capital, mentorship, and production access.", img: team1 }
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
                  loading="lazy"
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

     {/* Partners */}
<section className="py-24 px-6 border-y border-white/10 bg-white/5 overflow-hidden">
  <div className="max-w-7xl mx-auto">
    
    <h3 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase max-w-xs leading-none text-center mx-auto mb-16">
      OUR <span className="text-accent underline">PARTNERS</span>
    </h3>

    <div className="relative">
      <div className="flex animate-marquee">
        <div className="flex items-center gap-16 sm:gap-20 md:gap-24 shrink-0">
          <img src={partner1} alt="Partner 1" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
          <img src={partner2} alt="Partner 2" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
          <img src={partner3} alt="Partner 3" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
          <img src={partner4} alt="Partner 4" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
          <img src={partner5} alt="Partner 5" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
        </div>
        <div className="flex items-center gap-16 sm:gap-20 md:gap-24 shrink-0">
          <img src={partner1} alt="Partner 1" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
          <img src={partner2} alt="Partner 2" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
          <img src={partner3} alt="Partner 3" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
          <img src={partner4} alt="Partner 4" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
          <img src={partner5} alt="Partner 5" className="h-12 sm:h-14 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300" loading="lazy" />
        </div>
      </div>
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
