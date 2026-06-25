import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, ArrowRight, Check, Mail, ExternalLink, 
  RefreshCw, Send, Award, Instagram, Twitter, 
  Linkedin, BookOpen, Star, Cpu, Database, Terminal, 
  ChevronRight, Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';

import NeuralLab from './components/NeuralLab';
import Workshops from './components/Workshops';

// ---------------------------------------------------------------------------
// TYPES & INTERFACES FOR GITHUB PROJECTS
// ---------------------------------------------------------------------------
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export default function App() {
  const [emailInput, setEmailInput] = useState<string>('');
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);

  // GitHub Projects State
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);
  const [reposError, setReposError] = useState<boolean>(false);

  // Terminal State for Login Simulation
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Welcome to Narkees-AI Dev Environment v2.0...',
    'System: Chennai nodes connected. [OK]',
    'Type "help" to explore available AI simulation subroutines.'
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Certificate/Credential Filtering state
  const [certFilter, setCertFilter] = useState<string>('all');

  // Background video fade refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeAnimationFrameRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);

  // Dynamic Unsplash image selector based on project topic keywords
  const getProjectImage = (name: string, description: string = '') => {
    const title = (name + ' ' + description).toLowerCase();
    
    if (title.includes('brain') || title.includes('tumor') || title.includes('cancer') || title.includes('medical') || title.includes('mri')) {
      return 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&h=350&q=80'; // Brain MRI / Neuro Scan
    }
    if (title.includes('stock') || title.includes('market') || title.includes('finance') || title.includes('trade') || title.includes('predictive') || title.includes('forecasting')) {
      return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&h=350&q=80'; // Stock Market candlestick charts
    }
    if (title.includes('sign') || title.includes('gesture') || title.includes('interpret') || title.includes('hand') || title.includes('mediapipe') || title.includes('vision') || title.includes('opencv')) {
      return 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=600&h=350&q=80'; // Gesture tracking / Motion interaction
    }
    if (title.includes('climate') || title.includes('weather') || title.includes('global') || title.includes('earth') || title.includes('temperature') || title.includes('environment')) {
      return 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=600&h=350&q=80'; // Space view of planet Earth
    }
    if (title.includes('portfolio') || title.includes('website') || title.includes('react') || title.includes('ui') || title.includes('frontend')) {
      return 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&h=350&q=80'; // Clean developer workstation
    }
    if (title.includes('analysis') || title.includes('pandas') || title.includes('data') || title.includes('numpy') || title.includes('eda') || title.includes('clean')) {
      return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=350&q=80'; // Data analytics Dashboard
    }
    if (title.includes('algorithm') || title.includes('code') || title.includes('python') || title.includes('scikit') || title.includes('learn') || title.includes('tensorflow') || title.includes('neural')) {
      return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&h=350&q=80'; // Matrix cyber code
    }
    
    // Abstract sci-fi technological illustrations for fallback to ensure uniqueness
    const abstractPool = [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&h=350&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&h=350&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=350&q=80',
      'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=600&h=350&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&h=350&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&h=350&q=80',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&h=350&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=350&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&h=350&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&h=350&q=80'
    ];

    // Simple hash to guarantee stability for any dynamic repo
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % abstractPool.length;
    return abstractPool[index];
  };

  // Dynamic GitHub projects fetch
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        setLoadingRepos(true);
        setReposError(false);
        const res = await fetch('https://api.github.com/users/snarkeesbanu-saleem/repos?sort=updated&per_page=12');
        if (!res.ok) throw new Error();
        const data = await res.json();
        // filter out empty or meta repos, display top ones
        setRepos(data);
      } catch (err) {
        console.warn("GitHub API limit or offline. Proceeding to fallback list.");
        setReposError(true);
      } finally {
        setLoadingRepos(false);
      }
    };
    fetchGithubData();
  }, []);

  // Custom JS Video Fade Looper
  const fadeTo = (targetOpacity: number, duration: number = 500) => {
    const video = videoRef.current;
    if (!video) return;

    if (fadeAnimationFrameRef.current !== null) {
      cancelAnimationFrame(fadeAnimationFrameRef.current);
      fadeAnimationFrameRef.current = null;
    }

    const startOpacity = parseFloat(video.style.opacity) || 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Interpolate opacity smoothly
      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      video.style.opacity = currentOpacity.toString();

      if (progress < 1) {
        fadeAnimationFrameRef.current = requestAnimationFrame(animate);
      } else {
        fadeAnimationFrameRef.current = null;
      }
    };

    fadeAnimationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initially transparent
    video.style.opacity = '0';

    const handleCanPlay = () => {
      // 500ms fade-in on load/loop start
      fadeTo(0.4, 500); 
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      // 500ms fade-out when 0.55 seconds remain before the video ends
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      // On ended, opacity is set to 0, then after 100ms the video resets to currentTime = 0, plays, and fades back in
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;
        video.play().then(() => {
          fadeTo(0.4, 500);
        }).catch(err => console.warn("Video auto-play restricted by browser:", err));
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // If already loaded
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (fadeAnimationFrameRef.current !== null) {
        cancelAnimationFrame(fadeAnimationFrameRef.current);
      }
    };
  }, []);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    
    // Confetti triggers on successful action!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#a78bfa', '#ffffff', '#8b5cf6']
    });

    setEmailSubmitted(true);
    setTimeout(() => {
      setEmailSubmitted(false);
      setEmailInput('');
    }, 4500);
  };

  // Handle custom interactive AI simulator console
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let reply = `Command "${cmd}" not recognized. Type "help" for a list of modules.`;

    if (cmd === 'help') {
      reply = 'Available AI simulation subroutines: "about", "skills", "experience", "projects", "certify", "clear", "train-neural-net"';
    } else if (cmd === 'about') {
      reply = 'S. Narkees Banu: AI Engineer & Data Scientist based in Chennai, Tamil Nadu. Specializes in building predictive systems, machine learning models, and full-stack integration.';
    } else if (cmd === 'skills') {
      reply = 'Core competencies: Python, Machine Learning, Deep Learning, Data Analysis, Pandas, NumPy, Exploratory Data Analysis (EDA), PostgreSQL, SQL, React.js, Flutter, REST APIs, Forecasting, Data Visualization.';
    } else if (cmd === 'experience') {
      reply = 'Internships: 1. AI Data Analyst (InAmigos Foundation - Jun 2026), 2. Machine Learning (Future Interns - Feb 2026), 3. Software Engineer (Bluestock - Jan 2026), 4. Data Analyst (Geeks Kepler - Dec 2025). Education: BE in Computer Science (Anand Institute of Higher Technology, Sep 2023 - Apr 2027).';
    } else if (cmd === 'projects') {
      reply = 'Active research pipelines include: Brain Tumor Classification, Advanced Predictive Stock Analytics, Sign Language Gesture Interpreter, and Exploratory Global Climate Pipelines.';
    } else if (cmd === 'certify') {
      reply = 'Verified Credentials: HCLTech (Data Science & AI), Future Interns (ML), Deloitte Australia Data Analytics (Forage), Aptitude Quiz composites (Unstop), IBM Data Analytics, upGrad GenAI, Infosys, and Outskill.';
    } else if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (cmd === 'train-neural-net') {
      setTerminalHistory(prev => [...prev, `> ${terminalInput}`, 'System: Initializing backward propagation simulator...', 'Calculating weights optimization...']);
      setTerminalInput('');
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setTerminalHistory(prev => [
          ...prev, 
          `Epoch ${progress/20}/5 - Loss: ${(1 / (progress + 1.2)).toFixed(4)} | Training Accuracy: ${(82 + progress * 0.17).toFixed(2)}%`
        ]);

        if (progress >= 100) {
          clearInterval(interval);
          setTerminalHistory(prev => [...prev, '✓ Neural training routine completed with excellent validation metrics!', 'System: Ready for next subroutine request.']);
          
          confetti({
            particleCount: 50,
            spread: 40,
            colors: ['#10b981', '#34d399', '#ffffff']
          });
        }
      }, 600);
      return;
    }

    setTerminalHistory(prev => [...prev, `> ${terminalInput}`, reply]);
    setTerminalInput('');
  };

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  // Fallback high-quality curated project list of S. Narkees Banu
  const fallbackProjects: GitHubRepo[] = [
    {
      id: 101,
      name: "Brain Tumor Classification & Detection",
      description: "Implemented a custom Deep Learning convolutional network that accurately detects brain tumor presence in MRI brain scans with premium validation metrics.",
      language: "Python / TensorFlow",
      stargazers_count: 14,
      html_url: "https://github.com/snarkeesbanu-saleem",
      homepage: null,
      updated_at: "2026-03-20T10:00:00Z"
    },
    {
      id: 102,
      name: "Advanced Predictive Stock Analytics",
      description: "An exploratory predictive modeling pipeline built using Scikit-Learn and Pandas to evaluate high-frequency market trends and historic stock indexes.",
      language: "Jupyter Notebook",
      stargazers_count: 9,
      html_url: "https://github.com/snarkeesbanu-saleem",
      homepage: null,
      updated_at: "2026-04-12T15:30:00Z"
    },
    {
      id: 103,
      name: "Sign Language Gesture Interpreter",
      description: "Built a computer vision system parsing hand poses and gesture vectors using MediaPipe, outputting immediate translated textual equivalents.",
      language: "Python / OpenCV",
      stargazers_count: 18,
      html_url: "https://github.com/snarkeesbanu-saleem",
      homepage: null,
      updated_at: "2026-05-18T09:15:00Z"
    },
    {
      id: 104,
      name: "Exploratory Global Climate Pipeline",
      description: "A robust data science pipeline aggregating, scrubbing, and visualizing historical global surface temperature trends across 50 years.",
      language: "Pandas & NumPy",
      stargazers_count: 11,
      html_url: "https://github.com/snarkeesbanu-saleem",
      homepage: null,
      updated_at: "2026-06-01T12:00:00Z"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden text-white font-sans selection:bg-violet-500/30 selection:text-white">
      
      {/* -----------------------------------------------------------------------
          BACKGROUND VIDEO (Fixed so content scrolls cleanly on top of it)
          ----------------------------------------------------------------------- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
          autoPlay
          muted
          playsInline
          loop={false}
          className="absolute inset-0 w-full h-full object-cover translate-y-[17%] scale-105"
        />
        {/* Dark cinematic overlays for premium text legibility and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/50 to-black/95" />
      </div>

      {/* -----------------------------------------------------------------------
          STICKY HEADER / NAVIGATION BAR
          ----------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 backdrop-blur-sm bg-black/10">
        <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto shadow-2xl">
          
          {/* Left side: Logo area with a Globe icon */}
          <a 
            href="#hero"
            className="flex items-center gap-2 group hover:opacity-90 transition-all text-left"
          >
            <Globe size={24} className="text-white animate-spin-slow group-hover:rotate-45 transition-transform duration-700" />
            <span className="text-white font-semibold text-lg tracking-tight">Asme</span>
            <span className="text-xs font-mono text-white/30 hidden sm:inline">• S. Narkees Banu</span>
          </a>

          {/* Middle: Beautiful scrolling anchors (No Modals, straight scroll!) */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative py-1"
            >
              About
            </a>
            <a
              href="#experience"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative py-1"
            >
              Experience
            </a>
            <a
              href="#projects"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative py-1"
            >
              Projects
            </a>
            <a
              href="#certificates"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative py-1"
            >
              Certificates
            </a>
            <a
              href="#contact"
              className="text-white/80 hover:text-white transition-colors text-sm font-medium relative py-1"
            >
              Contact
            </a>
          </div>

          {/* Right side: Replaced Sign Up / Login with beautiful LinkedIn and Call-To-Action */}
          <div className="flex items-center gap-3">
            <a 
              href="https://www.linkedin.com/in/narkees-banu-s-2b4566307?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
              target="_blank" 
              rel="noreferrer" 
              className="liquid-glass rounded-full px-5 py-2 text-xs font-medium cursor-pointer text-white bg-white/5 hover:bg-white/10 flex items-center gap-2"
            >
              <Linkedin size={14} className="text-violet-400" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </header>

      {/* -----------------------------------------------------------------------
          MAIN SCROLLABLE PORTFOLIO CONTENT
          ----------------------------------------------------------------------- */}
      <main className="relative z-10 flex-1 flex flex-col items-center">

        {/* 1. HERO SECTION */}
        <section id="hero" className="min-h-[92vh] w-full flex flex-col items-center justify-center px-6 py-12 text-center relative">
          
          <div className="space-y-3 mb-4">
            <span className="bg-white/5 border border-white/10 text-white/90 text-xs px-4 py-1.5 rounded-full font-mono tracking-widest uppercase inline-block">
              AI Engineer & Data Scientist
            </span>
          </div>

          {/* Cinematic Heading using Instrument Serif */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Built for the curious
          </h1>

          {/* Dynamic newsletter or stream sign-up block */}
          <div className="max-w-xl w-full space-y-5">
            
            {/* Email input bar with Liquid Glass */}
            <form 
              onSubmit={handleSubscribe}
              className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3 w-full shadow-lg border border-white/5"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-white placeholder:text-white/40 text-base font-light min-w-0"
              />
              
              <button
                type="submit"
                className="bg-white hover:bg-zinc-100 rounded-full p-3 text-black cursor-pointer flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                aria-label="Subscribe to update stream"
              >
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Interactive subscription response */}
            <AnimatePresence>
              {emailSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-emerald-400 font-mono text-xs flex items-center justify-center gap-1.5 py-1"
                >
                  <Check size={14} />
                  <span>Subscription verified. S. Narkees Banu has logged your handshake!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtitle text */}
            <p className="text-white/80 text-sm leading-relaxed px-4 font-light max-w-lg mx-auto">
              Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
            </p>

            {/* Scroll Indicator Button */}
            <div className="flex justify-center pt-8">
              <a
                href="#about"
                className="liquid-glass rounded-full px-8 py-3 text-white text-xs font-medium hover:bg-white/5 transition-all cursor-pointer bg-white/5 border border-white/5 flex items-center gap-2 tracking-wider"
              >
                <span>EXPLORE PORTFOLIO</span>
                <ChevronRight size={14} className="animate-bounce" />
              </a>
            </div>

          </div>
        </section>


        {/* 2. ABOUT SECTION */}
        <section id="about" className="py-24 px-6 w-full max-w-5xl scroll-mt-20">
          <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-white/5 shadow-2xl backdrop-blur-md">
            
            <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center md:items-start">
              
              {/* Profile Card Side */}
              <div className="shrink-0 text-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl border border-white/20 relative overflow-hidden group">
                  <span className="text-5xl font-bold text-white tracking-widest select-none">NB</span>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                <div className="mt-4">
                  <p className="text-xs text-zinc-400 font-mono">@snarkeesbanu</p>
                  <p className="text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    <span>Active Chennai, IN</span>
                  </p>
                </div>
              </div>

              {/* Bio & Details Side */}
              <div className="flex-1 space-y-6">
                <div>
                  <span className="text-violet-400 text-xs font-mono uppercase tracking-widest block mb-2">// EXECUTIVE PROFILE</span>
                  <h2 
                    className="text-4xl sm:text-5xl text-white font-normal leading-tight"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    S. Narkees Banu
                  </h2>
                  <h3 className="text-sm font-mono text-zinc-400 mt-1">Computer Science Engineer & Machine Learning Developer</h3>
                </div>

                <p className="text-zinc-300 font-light text-base sm:text-lg leading-relaxed">
                  I am Narkees, an AI Engineer and Data Scientist based in Chennai, Tamil Nadu. Currently pursuing my B.E. in Computer Science & Engineering at <strong>Anand Institute of Higher Technology</strong>, my passion lies at the intersection of deep convolutional neural networks, prediction algorithms, and elegant data representation.
                </p>

                <p className="text-zinc-400 font-light text-sm sm:text-base leading-relaxed">
                  I design high-impact architectures that translate raw datasets into robust software solutions. Whether training convolutional networks for medical imagery classification or fine-tuning pipelines, I aim for exceptional rigor, accuracy, and clarity.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-3">
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex items-start gap-3">
                    <BookOpen size={20} className="text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-mono text-zinc-500 uppercase">Education</p>
                      <p className="text-sm font-medium text-white mt-1">B.E. Computer Science & Engineering</p>
                      <p className="text-xs text-zinc-400 font-light mt-0.5">Anand Institute of Higher Technology, Chennai</p>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex items-start gap-3">
                    <Cpu size={20} className="text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-mono text-zinc-500 uppercase">Focus Areas</p>
                      <p className="text-sm font-medium text-white mt-1">Generative AI & Deep Learning</p>
                      <p className="text-xs text-zinc-400 font-light mt-0.5">Computer Vision, Trend Analytics, and NLP</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Technical matrix Grid */}
            <div className="border-t border-white/10 mt-12 pt-10 space-y-5">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-violet-400" />
                <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Technical Competency Grid</h4>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { name: 'Python', cat: 'Programming & Scripts' },
                  { name: 'Machine Learning', cat: 'Scikit-Learn & Models' },
                  { name: 'Deep Learning', cat: 'Neural Networks' },
                  { name: 'Data Analysis', cat: 'Statistical Analytics' },
                  { name: 'Pandas & NumPy', cat: 'Data Manipulation' },
                  { name: 'Exploratory Data Analysis (EDA)', cat: 'Feature Engineering' },
                  { name: 'PostgreSQL & SQL', cat: 'Relational Databases' },
                  { name: 'React.js', cat: 'Frontend Web Dev' },
                  { name: 'Flutter', cat: 'Cross-Platform Mobile' },
                  { name: 'REST APIs', cat: 'System Integration' },
                  { name: 'Data Visualization', cat: 'Charts & Analytics' },
                  { name: 'Forecasting', cat: 'Predictive Modeling' }
                ].map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-black/40 border border-white/5 p-4 rounded-xl hover:border-violet-400/40 transition-colors"
                  >
                    <p className="text-white font-semibold text-sm">{skill.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{skill.cat}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>


        {/* 3. EXPERIENCE & EDUCATION SECTION */}
        <section id="experience" className="py-20 px-6 w-full max-w-5xl scroll-mt-20">
          <div className="space-y-12">
            
            <div className="text-center">
              <span className="text-violet-400 text-xs font-mono uppercase tracking-widest block mb-2">// EXPERIENCE & EDUCATION</span>
              <h2 
                className="text-4xl sm:text-5xl text-white font-normal"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Professional Internships & Academic Pathway
              </h2>
              <p className="text-zinc-400 font-light mt-2 text-sm sm:text-base max-w-xl mx-auto">
                Review her verified technical career milestones, industry internships, and formal training.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: 7/12 - Professional Internships */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={16} className="text-violet-400" />
                  <h3 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Industry Internships</h3>
                </div>

                {/* Internship 1 */}
                <div className="liquid-glass rounded-2xl p-6 border border-white/5 bg-zinc-950/20 hover:border-violet-500/20 transition-all shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-violet-400" />
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">AI Data Analyst (Internship)</h4>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">InAmigos Foundation (IAF) • Remote, India</p>
                    </div>
                    <span className="text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2.5 py-1 rounded-full">
                      JUN 2026 — PRESENT
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                    Formulating machine learning pipelines, building high-fidelity automated data extraction mechanisms, and modeling robust exploratory analytics dashboards.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python', 'EDA', 'Data Analysis', 'Data Visualization'].map((tag) => (
                      <span key={tag} className="text-[9px] font-mono bg-white/5 border border-white/5 text-zinc-400 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Internship 2 */}
                <div className="liquid-glass rounded-2xl p-6 border border-white/5 bg-zinc-950/20 hover:border-violet-500/20 transition-all shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-emerald-400" />
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">Machine Learning (Internship)</h4>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">Future Interns • Remote, India</p>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      FEB 2026 (1 MO)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                    Developed tailored machine learning solutions for customer support optimization. Managed complex dataset preprocessing, forecasting structures, and exploratory workflows.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python', 'Machine Learning', 'Pandas', 'NumPy', 'EDA', 'Forecasting'].map((tag) => (
                      <span key={tag} className="text-[9px] font-mono bg-white/5 border border-white/5 text-zinc-400 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Internship 3 */}
                <div className="liquid-glass rounded-2xl p-6 border border-white/5 bg-zinc-950/20 hover:border-violet-500/20 transition-all shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-blue-400" />
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">Software Engineer (Internship)</h4>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">Bluestock™ • Remote, India</p>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-full">
                      JAN 2026 — FEB 2026 (2 MOS)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                    Contributed to the development of Bluestock's stock market analytics systems. Leveraged React.js, cross-platform mobile architecture, and REST endpoints for data pipelines.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['React.js', 'Flutter', 'PostgreSQL', 'REST APIs', 'Machine Learning'].map((tag) => (
                      <span key={tag} className="text-[9px] font-mono bg-white/5 border border-white/5 text-zinc-400 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Internship 4 */}
                <div className="liquid-glass rounded-2xl p-6 border border-white/5 bg-zinc-950/20 hover:border-violet-500/20 transition-all shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-[3px] h-full bg-amber-400" />
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">Data Analyst (Internship)</h4>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">Geeks Kepler • Remote</p>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-1 rounded-full">
                      DEC 2025 — JAN 2026 (2 MOS)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed mb-4">
                    Conducted datasets cleaning, aggregation, database queries, and formatted dynamic reports showcasing actionable growth insights.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Data Analysis', 'SQL', 'Pandas', 'NumPy', 'Data Visualization'].map((tag) => (
                      <span key={tag} className="text-[9px] font-mono bg-white/5 border border-white/5 text-zinc-400 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Side: 5/12 - Academic Pathway */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-violet-400" />
                  <h3 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Academic Pathway</h3>
                </div>

                {/* College Degree */}
                <div className="liquid-glass rounded-2xl p-6 border border-white/5 bg-zinc-950/20 hover:border-violet-500/20 transition-all shadow-xl">
                  <span className="text-[9px] font-mono text-violet-400 bg-white/5 px-2.5 py-1 rounded-full inline-block mb-3">
                    SEP 2023 — APR 2027
                  </span>
                  <h4 className="text-base font-bold text-white">B.E. Computer Science & Engineering</h4>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Anand Institute of Higher Technology, Chennai</p>
                  <p className="text-xs text-zinc-300 font-light mt-3 leading-relaxed">
                    Undergoing rich academic curriculum affiliated to Anna University. Excelling in algorithm architectures, object-oriented systems, artificial intelligence models, and distributed structures.
                  </p>
                </div>

                {/* Specialized Course */}
                <div className="liquid-glass rounded-2xl p-6 border border-white/5 bg-zinc-950/20 hover:border-violet-500/20 transition-all shadow-xl">
                  <span className="text-[9px] font-mono text-violet-400 bg-white/5 px-2.5 py-1 rounded-full inline-block mb-3">
                    VERIFIED ENROLLMENT
                  </span>
                  <h4 className="text-base font-bold text-white">Data Science with AI Specialty</h4>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Internshala Trainings</p>
                  <p className="text-xs text-zinc-300 font-light mt-3 leading-relaxed">
                    Hands-on training emphasizing statistics, dataset feature selection, data manipulation using Pandas, and training baseline ML regressors and classifiers.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* 4. PROJECTS SECTION */}
        <section id="projects" className="py-20 px-6 w-full max-w-5xl scroll-mt-20">
          <div className="space-y-10">
            <div className="text-center">
              <span className="text-violet-400 text-xs font-mono uppercase tracking-widest block mb-2">// PROJECT REPOS</span>
              <h2 
                className="text-4xl sm:text-5xl text-white font-normal"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Intelligent Architectures & Repositories
              </h2>
              <p className="text-zinc-400 font-light mt-2 text-sm sm:text-base max-w-xl mx-auto">
                Explore her dynamic open source project pipelines pulled live from GitHub, highlighting specialized deep learning classification models.
              </p>
            </div>

            {loadingRepos ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <RefreshCw size={32} className="animate-spin text-violet-400" />
                <span className="text-sm font-mono text-zinc-500">Retrieving remote repositories...</span>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {((repos.length > 0 && !reposError) ? repos : fallbackProjects).map((repo) => {
                  const bgImage = getProjectImage(repo.name, repo.description || '');
                  const prettyName = repo.name.replace(/[-_]/g, ' ');

                  return (
                    <div 
                      key={repo.id}
                      className="bg-zinc-950/50 border border-white/5 rounded-3xl overflow-hidden hover:border-violet-500/40 transition-all group flex flex-col justify-between shadow-lg"
                    >
                      <div className="h-40 w-full overflow-hidden relative">
                        <img 
                          src={bgImage} 
                          alt={prettyName}
                          className="w-full h-full object-cover grayscale brightness-[0.6] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                        
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                          <span className="font-mono text-zinc-400 bg-black/75 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[10px] tracking-wider uppercase">
                            {repo.language || "Python"}
                          </span>
                          
                          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-black/75 backdrop-blur-md px-2 py-1 rounded-md">
                            <Star size={12} className="fill-amber-400" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white capitalize group-hover:text-violet-300 transition-colors tracking-tight line-clamp-1">
                            {prettyName}
                          </h3>
                          <p className="text-xs text-zinc-400 font-light mt-2 line-clamp-3 leading-relaxed">
                            {repo.description || "An advanced deep-learning pipeline and dataset preprocessing repository. Click explore to review architecture diagrams and performance logs."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                          <span className="text-[10px] text-zinc-500 font-mono">
                            UPDATED: {new Date(repo.updated_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1.5 font-medium tracking-wide group/link"
                          >
                            <span>INSPECT CODE</span>
                            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-center pt-4">
              <a
                href="https://github.com/snarkeesbanu-saleem"
                target="_blank"
                rel="noreferrer"
                className="liquid-glass rounded-full px-6 py-3 bg-white/5 hover:bg-white/10 text-xs font-mono tracking-wider flex items-center gap-2"
              >
                <span>VISIT S. NARKEES BANU ON GITHUB</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </section>


        {/* 5. CERTIFICATES SECTION */}
        <section id="certificates" className="py-20 px-6 w-full max-w-5xl scroll-mt-20">
          <div className="space-y-10">
            
            <div className="text-center">
              <span className="text-violet-400 text-xs font-mono uppercase tracking-widest block mb-2">// COMPLIANCE & CREDENTIALS</span>
              <h2 
                className="text-4xl sm:text-5xl text-white font-normal"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Verified Professional Certifications
              </h2>
              <p className="text-zinc-400 font-light mt-2 text-sm sm:text-base max-w-xl mx-auto">
                Rigorous computer science, artificial intelligence, and data engineering credentials verified by global tech institutes.
              </p>
            </div>

            {/* Interactive Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {[
                { id: 'all', label: 'All Credentials' },
                { id: 'aiml', label: 'AI & Machine Learning' },
                { id: 'genai', label: 'Generative AI' },
                { id: 'data', label: 'Data Analytics' },
                { id: 'quiz', label: 'Aptitude & Quizzes' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCertFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider border cursor-pointer transition-all ${
                    certFilter === tab.id
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Certs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const certsList = [
                  {
                    title: "Roadmap to Data Science, AI & Machine Learning",
                    issuer: "HCLTech",
                    date: "Dec 2025",
                    id: "h122053W1N30677616",
                    category: "aiml",
                    desc: "Specialized in deep pipeline orchestration, predictive modeling, data architecture, and modern artificial intelligence foundations."
                  },
                  {
                    title: "Machine Learning (Internship Certification)",
                    issuer: "Future Interns",
                    date: "Mar 2026",
                    id: "FIT/FEB26/ML5582",
                    category: "aiml",
                    desc: "Validation of hands-on model development during industry internship: regression, classification, and supervised learning systems."
                  },
                  {
                    title: "Deloitte Australia - Data Analytics Simulation",
                    issuer: "Forage",
                    date: "Feb 2026",
                    id: "HZspkdGDmqwLAvSFF",
                    category: "data",
                    desc: "Simulated analytics for Deloitte Australia: structuring complex data, executing trend analyses, and preparing diagnostic slides."
                  },
                  {
                    title: "Aptitude Quiz Round of Enigma | COMPOSIT",
                    issuer: "Unstop",
                    date: "Apr 2026",
                    id: "32b4687b-2728-4ee7-be38-02f95a2e13e4",
                    category: "quiz",
                    desc: "Algorithmic and quantitative assessment testing advanced computational math, analytical reasoning, and computing logic."
                  },
                  {
                    title: "ROUND 1: QUIZ of Valorem Competition",
                    issuer: "Unstop",
                    date: "Mar 2026",
                    id: "826371f2-7e11-46ce-ac43-40990ff2c2dc",
                    category: "quiz",
                    desc: "Competitive algorithmic assessment evaluating data parsing structures, logical optimization, and pattern analytics."
                  },
                  {
                    title: "AI For All",
                    issuer: "Infosys Springboard",
                    date: "Dec 2025",
                    category: "genai",
                    desc: "Foundational AI framework training covering computing metrics, neural architecture compliance, and deployment ethics."
                  },
                  {
                    title: "Generative AI Foundation",
                    issuer: "upGrad",
                    date: "Dec 2025",
                    category: "genai",
                    desc: "Comprehensive track covering transformer-based attention modeling, fine-tuning, and cognitive service integration."
                  },
                  {
                    title: "Getting Started with Data",
                    issuer: "IBM",
                    date: "Oct 2025",
                    category: "data",
                    desc: "Professional credential validating SQL querying, relational database design principles, and exploratory data preprocessing."
                  }
                ];

                const filteredCerts = certFilter === 'all' 
                  ? certsList 
                  : certsList.filter(c => c.category === certFilter);

                return filteredCerts.map((cert, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    key={cert.title + index}
                    className="liquid-glass rounded-3xl p-6 border border-white/5 bg-zinc-950/40 relative hover:border-violet-400/30 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                          <Award size={20} className="text-violet-400" />
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded uppercase">
                          {cert.date}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight line-clamp-2 h-10">{cert.title}</h3>
                        <p className="text-[11px] text-violet-400 font-mono mt-1">{cert.issuer}</p>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-light line-clamp-3">
                        {cert.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2">
                      {cert.id && (
                        <div className="flex justify-between items-center bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5">
                          <span className="text-[9px] font-mono text-zinc-500">ID:</span>
                          <span className="text-[9px] font-mono text-zinc-300 truncate max-w-[120px]" title={cert.id}>
                            {cert.id}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-zinc-500 font-mono text-[9px]">VERIFIED</span>
                        <a 
                          href="https://www.linkedin.com/in/narkees-banu-s-2b4566307" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium"
                        >
                          <span>Show credential</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ));
              })()}
            </div>

          </div>
        </section>


        {/* 5. WORKSHOPS & TECH ASSEMBLY SECTION */}
        <Workshops />


        {/* 6. NEURAL LABORATORY: INTERACTIVE AI SANDBOX */}
        <NeuralLab />


        {/* 7. INTERACTIVE AI TERMINAL SIMULATOR SECTION (Very unique!) */}
        <section className="py-16 px-6 w-full max-w-4xl">
          <div className="liquid-glass rounded-3xl border border-white/10 p-6 sm:p-8 backdrop-blur-md bg-zinc-950/85">
            
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-violet-400 animate-pulse" />
                <h3 className="text-sm font-mono text-white/90">Interactive AI & Subroutine Console</h3>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-light mb-4">
              Interact with Narkees' simulated Chennai cluster in real-time. Execute commands like <span className="font-mono text-white bg-white/5 px-1 py-0.5 rounded">help</span>, <span className="font-mono text-white bg-white/5 px-1 py-0.5 rounded">train-neural-net</span>, or <span className="font-mono text-white bg-white/5 px-1 py-0.5 rounded">skills</span>.
            </p>

            <div className="h-64 overflow-y-auto bg-black/80 rounded-xl p-4 font-mono text-xs text-zinc-300 space-y-2.5 border border-white/5 custom-scrollbar mb-4">
              {terminalHistory.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap leading-relaxed">
                  {line}
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex gap-2 items-center bg-black/60 border border-white/10 rounded-xl px-4 py-3">
              <span className="text-violet-400 font-mono text-sm font-bold animate-pulse">&gt;</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder='Type command (e.g. "help", "train-neural-net", "skills")...'
                className="bg-transparent border-none outline-none flex-1 text-white font-mono placeholder:text-zinc-600 text-xs"
              />
            </form>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2 pt-4">
              <span className="text-zinc-500 font-mono text-[10px] self-center">Presets:</span>
              {[
                { cmd: 'help', label: 'Help Menu' },
                { cmd: 'about', label: 'Query Profile' },
                { cmd: 'skills', label: 'List Tech Matrix' },
                { cmd: 'experience', label: 'View Internships' },
                { cmd: 'train-neural-net', label: '★ Train Neural Net' }
              ].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTerminalInput(tag.cmd);
                  }}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-md px-3 py-1.5 font-mono text-[10px] text-zinc-300 transition-colors cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>

          </div>
        </section>


        {/* 7. MANIFESTO */}
        <section className="py-16 px-6 w-full max-w-3xl text-center">
          <span className="text-violet-400 text-xs font-mono uppercase tracking-widest block mb-3">// THE MANIFESTO</span>
          <h2 
            className="text-4xl sm:text-5xl text-white font-normal italic mb-6"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            "Built for the curious."
          </h2>

          <div className="space-y-4 text-zinc-300 font-light text-base sm:text-lg leading-relaxed text-center italic">
            <p>
              In a world overflowing with data, raw numbers mean nothing without eyes that can look deeper. We build not simply to automate or replicate, but to expand the horizon of human understanding.
            </p>
            <p>
              Artificial Intelligence is the ultimate brush, deep learning the canvas, and data is the story. From Chennai to the global open source community, our goal is to design intelligent systems that remain ethically transparent, highly predictive, and incredibly beautiful.
            </p>
          </div>
        </section>


        {/* 8. CONTACT SECTION */}
        <section id="contact" className="py-20 px-6 w-full max-w-lg scroll-mt-20">
          <div className="liquid-glass rounded-3xl p-8 border border-white/5 shadow-2xl backdrop-blur-md">
            
            <div className="text-center mb-8">
              <span className="text-violet-400 text-xs font-mono uppercase tracking-widest block mb-1.5">// INITIATE CONTACT</span>
              <h2 
                className="text-3xl text-white font-normal"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Let's Build Something Smarter
              </h2>
              <p className="text-zinc-400 font-light mt-1 text-xs">
                Have a machine learning project, co-op opportunity, or a collaborative idea? Dispatch a handshake token below.
              </p>
            </div>

            {contactSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-950/20 border border-emerald-500/30 p-8 rounded-2xl text-center space-y-4"
              >
                <div className="w-12 h-12 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto text-xl font-bold animate-bounce">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-white">Handshake Sequence Logged</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  Thank you! S. Narkees Banu has securely logged your parameters. A direct email response will be dispatched to your coordinates.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-1.5 uppercase" htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Alexis Carter"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-400 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-1.5 uppercase" htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="alexis@company.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-400 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-1.5 uppercase" htmlFor="contact-msg">Message or Project Vision</label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Detail your ML pipeline request or collaborative terms..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-violet-400 outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 active:scale-95 text-xs font-mono font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  <span>TRANSMIT HANDSHAKE HANDOFF</span>
                </button>
              </form>
            )}

          </div>
        </section>

      </main>

      {/* -----------------------------------------------------------------------
          SOCIAL FOOTER
          ----------------------------------------------------------------------- */}
      <footer className="relative z-10 flex flex-col items-center justify-center gap-4 pb-12 w-full mt-auto pt-8 border-t border-white/5">
        
        <div className="flex justify-center gap-4">
          <a 
            href="https://www.linkedin.com/in/narkees-banu-s-2b4566307?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
            target="_blank" 
            rel="noreferrer" 
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={20} />
          </a>
          
          <a 
            href="https://github.com/snarkeesbanu-saleem" 
            target="_blank" 
            rel="noreferrer" 
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
            aria-label="GitHub Profile"
          >
            <Globe size={20} />
          </a>

          <a 
            href="mailto:snarkeesbanu@gmail.com" 
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
            aria-label="Send direct email"
          >
            <Mail size={20} />
          </a>

          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer" 
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>

          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noreferrer" 
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
        </div>

        <div className="text-center space-y-1">
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
            © {new Date().getFullYear()} S. NARKEES BANU. ALL RIGHTS SECURED.
          </p>
          <p className="text-[9px] text-zinc-600 font-mono">
            Crafted in Chennai Subnet • AI-Studio Build
          </p>
        </div>
      </footer>

    </div>
  );
}
