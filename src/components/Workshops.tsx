import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Star } from 'lucide-react';

interface WorkshopItem {
  title: string;
  host: string;
  date: string;
  desc: string;
  skills: string[];
  link?: string;
  highlight?: boolean;
}

export default function Workshops() {
  const workshopsList: WorkshopItem[] = [
    {
      title: "Generative AI Workshop & Developer Sprint",
      host: "Outskill",
      date: "Dec 2025",
      desc: "An immersive, hands-on masterclass series detailing Large Language Model architectures, temperature/top-p tuning, RAG (Retrieval-Augmented Generation) setups, vector databases (Pinecone/ChromaDB), and designing resilient autonomous AI agents.",
      skills: ["Large Language Models", "System Prompt Tuning", "RAG Pipeline", "AI Agents"],
      highlight: true,
      link: "https://www.linkedin.com/in/narkees-banu-s-2b4566307"
    }
  ];

  return (
    <section id="workshops" className="py-20 px-6 w-full max-w-5xl scroll-mt-20">
      <div className="space-y-12">
        
        {/* Section Header */}
        <div className="text-center">
          <span className="text-violet-400 text-xs font-mono uppercase tracking-widest block mb-2">// TECHNICAL ASSEMBLY & BOOTCAMPS</span>
          <h2 
            className="text-4xl sm:text-5xl text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Workshops & Tech Seminars
          </h2>
          <p className="text-zinc-400 font-light mt-2 text-sm sm:text-base max-w-xl mx-auto">
            Interactive training camps, developer bootcamps, and industrial seminars completed to sharpen engineering execution.
          </p>
        </div>

        {/* Workshops Grid */}
        <div className="max-w-2xl mx-auto">
          {workshopsList.map((ws, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              className={`liquid-glass rounded-3xl p-6 sm:p-8 border relative transition-all group overflow-hidden flex flex-col justify-between ${
                ws.highlight 
                  ? 'border-violet-500/20 bg-violet-950/5 hover:border-violet-400/40' 
                  : 'border-white/5 bg-zinc-950/20 hover:border-violet-500/20'
              }`}
            >
              {ws.highlight && (
                <div className="absolute top-0 right-0 bg-violet-500 text-black font-mono font-bold text-[9px] px-3 py-1 uppercase rounded-bl-xl tracking-wider flex items-center gap-1 shadow">
                  <Star size={10} fill="currentColor" />
                  <span>Featured Workshop</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <BookOpen size={20} className="text-violet-400" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full uppercase">
                    {ws.date}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                    {ws.title}
                  </h3>
                  <p className="text-xs font-mono text-violet-400 mt-1">{ws.host}</p>
                </div>

                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {ws.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-3">
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {ws.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="text-[9px] font-mono bg-white/5 border border-white/5 text-zinc-400 px-2.5 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {ws.link && (
                  <div className="flex items-center justify-end text-xs pt-1">
                    <a 
                      href={ws.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium text-[11px]"
                    >
                      <span>Show credentials link</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
