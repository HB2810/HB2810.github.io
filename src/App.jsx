import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Download, 
  ArrowRight, 
  Terminal, 
  ExternalLink,
  Menu,
  X,
  Code2,
  BrainCircuit,
  Database,
  Cloud,
  Layout,
  Cpu,
  Trophy,
  Award,
  BookOpen
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa';

// --- REAL DATA ---

const PERSONAL_INFO = {
  name: "Het Bhatt",
  githubUsername: "HB2810",
  githubUrl: "https://github.com/HB2810",
  linkedin: "https://www.linkedin.com/in/het-bhatt-444a23294/",
  email: "hetbhatt10@gmail.com",
  phone: "+91 9714234634",
  location: "Ahmedabad, Gujarat, India",
  githubBio: "Exploring intelligence through code. From mathematical theory to production systems — making machines see, learn, and reason.",
  roles: [
    "IT Executive",
    "AI/ML Enthusiast",
    "Researcher",
    "Published Author",
    "Problem Solver",
    "Ex-Intern @ SAC-ISRO"
  ]
};

const EDUCATION = [
  {
    institution: "LDRP-ITR, KSV University, Ahmedabad",
    degree: "B.E. in Information Technology",
    duration: "Sept 2022 – June 2026 (Currently Pursuing)",
    cgpa: "7.28 / 10"
  }
];

const EXPERIENCE = [
  {
    title: "IT Executive",
    organization: "[Current Company — add company name here]",
    duration: "Current",
    description: [
      "Managing IT infrastructure, system support, hardware & software troubleshooting, and IT operations while actively building expertise in AI/ML and Computer Vision through independent research and projects."
    ]
  },
  {
    title: "Research Intern",
    organization: "SAC, ISRO Ahmedabad",
    duration: "May 2024 – July 2024",
    description: [
      "Worked on \"FMCW Lidar Preprocessing Stage Problem Identification and Efficient Solution\"",
      "Developed and implemented efficient preprocessing techniques to enhance system accuracy and reliability",
      "Collaborated with senior ISRO Scientists to validate solutions and optimize performance"
    ]
  }
];

const ACHIEVEMENTS = [
  {
    icon: <Trophy className="w-8 h-8 text-amber" />,
    title: "1st Runner-Up — Mission CHANDRA",
    description: "State-level competition organized by SAC-ISRO, GUJCOST, DOT, and Gujarat Science City."
  },
  {
    icon: <Award className="w-8 h-8 text-cyan" />,
    title: "National Hackathon Leader",
    description: "Led teams in national hackathons — SIH (Smart India Hackathon) and SSIP, delivering successful solutions in innovation-focused challenges."
  },
  {
    icon: <BookOpen className="w-8 h-8 text-amber" />,
    title: "Published Research Paper",
    description: "Paper No. 1837: \"Image-Based Caption Generation for Gujarati Language Using Deep Learning\" (ICDSA 2025 | Publisher: Springer, Scopus Indexed, Vol. 6)"
  }
];

const PROJECTS = [
  {
    title: "Deepfake Detection System",
    github: "https://github.com/HB2810",
    stack: ["PyTorch", "CNN", "BiLSTM", "Grad-CAM"],
    description: "Advanced multimodal deepfake detection system integrating CNN-based spatial feature extraction with BiLSTM temporal pattern recognition. Achieved 91% accuracy on a custom audio-video dataset using feature-level fusion, ensemble modeling, and Grad-CAM explainability.",
    status: "Completed",
    highlight: "91% Accuracy",
    featured: true
  },
  {
    title: "Image-Based Caption Generator (Gujarati)",
    github: "https://github.com/HB2810",
    stack: ["Python", "PyTorch", "ResNet-18", "GRU", "SentencePiece"],
    description: "Low-resource Gujarati image captioning model trained on Flickr8k/30k datasets. Achieved BLEU-4 scores of 0.225 (Flickr8k) and 0.192 (Flickr30k). Research published at ICDSA 2025, Springer (Scopus Indexed).",
    status: "Published",
    highlight: "Springer Published",
    featured: true
  },
  {
    title: "Virtual Piano — Computer Vision",
    github: "https://github.com/HB2810/Virtual-Piano-Using-Computer-Vison-and-Opencv-python-",
    stack: ["Python", "OpenCV", "Computer Vision", "Jupyter Notebook"],
    description: "Interactive virtual piano application using hand gesture tracking via computer vision — play musical notes without touching a physical keyboard.",
    status: "Completed"
  },
  {
    title: "ResolveIT — Employee Helpdesk Ticketing System",
    github: "https://github.com/HB2810/ResolveIT--Employee-Helpdesk-Ticketing-System",
    stack: ["Python", "Flask", "SQLite", "SQLAlchemy", "Bootstrap"],
    description: "Web-based IT helpdesk system with authentication, role-based access, ticket tracking, status management, and admin dashboard. Built with modular project architecture.",
    status: "Completed"
  },
  {
    title: "Plant Disease Detection System",
    github: "https://github.com/HB2810/plant_disease_detection",
    stack: ["PyTorch", "Streamlit", "Jupyter Notebook"],
    description: "AI-powered plant disease detection system that classifies plant diseases from leaf images using deep learning. Deployed as an interactive Streamlit web app.",
    status: "Completed"
  },
  {
    title: "Chakshya",
    github: "https://github.com/HB2810/Chakshya",
    stack: ["TypeScript"],
    description: "Vision-focused AI project (TypeScript-based). [Add your detailed description here]",
    status: "In Progress"
  }
];

const SKILLS = [
  {
    category: "Languages & Frameworks",
    icon: <Code2 className="w-6 h-6 text-cyan" />,
    items: ["Python", "SQL", "C", "Django", "Flask", "React", "HTML", "CSS", "JavaScript"]
  },
  {
    category: "AI / ML / Deep Learning",
    icon: <BrainCircuit className="w-6 h-6 text-cyan" />,
    items: ["PyTorch", "TensorFlow", "Scikit-learn", "Keras", "MLflow", "NumPy", "Pandas", "Matplotlib", "Seaborn"]
  },
  {
    category: "Computer Vision",
    icon: <Layout className="w-6 h-6 text-cyan" />,
    items: ["OpenCV", "Image Processing", "CNN", "Object Detection", "Grad-CAM", "ResNet", "BiLSTM", "GRU"]
  },
  {
    category: "Cloud & DevOps",
    icon: <Cloud className="w-6 h-6 text-cyan" />,
    items: ["AWS", "Azure", "Firebase", "Git & GitHub", "Docker (basic)", "Linux"]
  },
  {
    category: "Databases",
    icon: <Database className="w-6 h-6 text-cyan" />,
    items: ["SQLite", "PostgreSQL", "MongoDB"]
  },
  {
    category: "Hardware, IT & Tools",
    icon: <Cpu className="w-6 h-6 text-cyan" />,
    items: ["System Troubleshooting", "Network Support", "Arduino", "Figma", "VS Code", "Jupyter"]
  }
];

const INTERESTS = ["Cricket", "Badminton", "Travelling", "Poetry", "Astrology", "Palmistry"];

// --- HOOKS ---
const useTypingAnimation = (words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const currentWord = words[loopNum % words.length];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && text === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

// --- COMPONENTS ---

const SectionHeading = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    className="mb-12"
  >
    <h2 className="text-3xl md:text-4xl font-mono text-light font-bold">
      <span className="text-cyan">[</span>{children}<span className="text-cyan">]</span>
    </h2>
  </motion.div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['About', 'Skills', 'Projects', 'Experience', 'Achievements', 'Contact'];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark/80 backdrop-blur-md border-b border-cyan/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-mono text-xl font-bold text-light">
          <Terminal className="text-cyan w-6 h-6" />
          <span>&gt; HB</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-muted hover:text-cyan transition-colors font-mono text-sm">
              {link}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-light" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full bg-dark/95 backdrop-blur-lg border-b border-cyan/10 flex flex-col items-center py-6 gap-6"
          >
            {links.map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                onClick={() => setIsOpen(false)}
                className="text-light hover:text-cyan font-mono text-lg"
              >
                {link}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const typedText = useTypingAnimation(PERSONAL_INFO.roles);

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden pt-20">
      {/* Background Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#00F5FF_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>
      
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <p className="font-mono text-cyan mb-4">&gt; Hello World, I am</p>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-light mb-4">
            {PERSONAL_INFO.name}
          </h1>
          <div className="h-10 mb-6">
            <p className="text-2xl md:text-3xl font-mono text-muted">
              &gt; <span className="text-light">{typedText}</span><span className="animate-pulse text-cyan">_</span>
            </p>
          </div>
          <p className="text-lg text-muted italic border-l-2 border-cyan/30 pl-4 py-1 mb-8 max-w-xl">
            "{PERSONAL_INFO.githubBio}"
          </p>
          
          <div className="flex flex-wrap gap-4 mb-10">
            <a href="#projects" className="flex items-center gap-2 bg-cyan/10 hover:bg-cyan/20 border border-cyan text-cyan px-6 py-3 rounded-md font-mono transition-all">
              View Projects <ArrowRight className="w-4 h-4" />
            </a>
            <a href={`${import.meta.env.BASE_URL}HB Resume.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-light px-6 py-3 rounded-md font-mono transition-all">
              Download Resume <Download className="w-4 h-4" />
            </a>
          </div>

          <div className="flex gap-6">
            <a href={PERSONAL_INFO.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href={`mailto:${PERSONAL_INFO.email}`} className="text-muted hover:text-cyan transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="order-1 lg:order-2 flex justify-center lg:justify-end relative"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-cyan/30 p-2 shadow-[0_0_30px_rgba(0,245,255,0.2)]">
            <div className="absolute inset-0 rounded-full border border-cyan animate-[spin_10s_linear_infinite] opacity-50"></div>
            <div className="w-full h-full rounded-full overflow-hidden bg-dark">
              <img 
                src={`${import.meta.env.BASE_URL}profile.jpg`}
                alt="Het Bhatt" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://ui-avatars.com/api/?name=Het+Bhatt&background=0A0F1E&color=00F5FF&size=512";
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
  const stats = [
    { label: "Projects", value: "6+" },
    { label: "Research Paper Published", value: "1" },
    { label: "Ex-Intern", value: "@SAC-ISRO" },
    { label: "Model Accuracy", value: "91%" }
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading>ABOUT</SectionHeading>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-muted text-lg leading-relaxed"
          >
            <p>
              I'm a B.E. IT student at LDRP-ITR, KSV University (graduating 2026), currently working as an IT Executive. 
              My passion lies at the intersection of AI, Deep Learning, and Computer Vision — from mathematical theory to real-world production systems.
            </p>
            <p>
              I've had the privilege of interning at SAC-ISRO and publishing research in a Springer Scopus-indexed conference. 
              I believe in depth over breadth, fundamentals over shortcuts, and building things that actually work.
            </p>
            
            <div className="pt-6">
              <h3 className="font-mono text-cyan mb-4 text-sm">&gt; Interests</h3>
              <div className="flex flex-wrap gap-3">
                {INTERESTS.map(interest => (
                  <span key={interest} className="px-4 py-1.5 rounded-full bg-cyan/5 border border-cyan/20 text-light text-sm font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card glow-border p-6 flex flex-col justify-center items-center text-center h-40"
              >
                <div className="text-3xl font-heading font-bold text-light mb-2">{stat.value}</div>
                <div className="text-sm font-mono text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-dark/50 border-y border-cyan/10">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading>SKILLS</SectionHeading>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((skillGroup, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card glow-border p-6"
            >
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
                {skillGroup.icon}
                <h3 className="font-heading font-semibold text-lg text-light">{skillGroup.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map(item => (
                  <span key={item} className="px-3 py-1 bg-white/5 text-muted text-sm rounded font-mono hover:text-cyan hover:bg-cyan/10 transition-colors">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading>PROJECTS</SectionHeading>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card glow-border p-6 flex flex-col h-full ${project.featured ? 'md:col-span-2 lg:col-span-1 bg-cyan/5 border-cyan/20' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-heading font-bold text-xl text-light leading-tight">{project.title}</h3>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan mt-1">
                  <Github className="w-5 h-5" />
                </a>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.status === 'Published' && (
                  <span className="px-2 py-1 text-xs font-mono font-bold bg-amber/10 text-amber border border-amber/20 rounded">
                    📄 {project.highlight || 'Published'}
                  </span>
                )}
                {project.status === 'Completed' && (
                  <span className="px-2 py-1 text-xs font-mono font-bold bg-cyan/10 text-cyan border border-cyan/20 rounded">
                    ✓ Completed {project.highlight && `- ${project.highlight}`}
                  </span>
                )}
                {project.status === 'In Progress' && (
                  <span className="px-2 py-1 text-xs font-mono font-bold bg-white/10 text-light border border-white/20 rounded">
                    ⟳ In Progress
                  </span>
                )}
              </div>

              <p className="text-muted text-sm mb-6 flex-grow">{project.description}</p>
              
              <div className="pt-4 border-t border-white/5 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <span key={tech} className="text-xs font-mono text-cyan/70">#{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExperienceEducation = () => {
  return (
    <section id="experience" className="py-24 bg-dark/50 border-y border-cyan/10">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
        
        {/* Experience */}
        <div>
          <SectionHeading>EXPERIENCE</SectionHeading>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan before:via-cyan/20 before:to-transparent">
            {EXPERIENCE.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 md:pl-0"
              >
                <div className="md:w-1/2 md:pr-12 md:text-right md:ml-0 md:mr-auto">
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-dark border-2 border-cyan shadow-[0_0_10px_rgba(0,245,255,0.5)] transform -translate-x-1.5 md:-translate-x-1/2 mt-1.5"></div>
                  
                  <div className="glass-card p-6 md:absolute md:left-[calc(50%+3rem)] md:top-0 md:w-[calc(50%-3rem)] md:text-left text-left w-full ml-0 md:ml-0 md:hidden">
                     {/* Mobile Card inline, Desktop handles via positioning below */}
                  </div>

                  <div className="glass-card p-6 hidden md:block">
                     <span className="font-mono text-cyan text-sm block mb-2">{exp.duration}</span>
                     <h3 className="font-heading font-bold text-xl text-light">{exp.title}</h3>
                     <h4 className="text-muted font-medium mb-4">{exp.organization}</h4>
                     <ul className="text-sm text-muted/80 space-y-2 list-disc list-inside">
                       {exp.description.map((desc, i) => (
                         <li key={i}>{desc}</li>
                       ))}
                     </ul>
                  </div>

                  {/* Mobile Card View */}
                  <div className="glass-card p-6 md:hidden">
                     <span className="font-mono text-cyan text-sm block mb-2">{exp.duration}</span>
                     <h3 className="font-heading font-bold text-xl text-light">{exp.title}</h3>
                     <h4 className="text-muted font-medium mb-4">{exp.organization}</h4>
                     <ul className="text-sm text-muted/80 space-y-2 list-disc list-inside">
                       {exp.description.map((desc, i) => (
                         <li key={i}>{desc}</li>
                       ))}
                     </ul>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <SectionHeading>EDUCATION</SectionHeading>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan before:via-cyan/20 before:to-transparent">
            {EDUCATION.map((edu, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 w-4 h-4 rounded-full bg-dark border-2 border-cyan shadow-[0_0_10px_rgba(0,245,255,0.5)] transform -translate-x-1.5 mt-1.5"></div>
                
                <div className="glass-card p-6">
                  <span className="font-mono text-cyan text-sm block mb-2">{edu.duration}</span>
                  <h3 className="font-heading font-bold text-xl text-light">{edu.degree}</h3>
                  <h4 className="text-muted font-medium mb-4">{edu.institution}</h4>
                  <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded font-mono text-sm text-light">
                    CGPA: <span className="text-cyan">{edu.cgpa}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

const Achievements = () => {
  return (
    <section id="achievements" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading>ACHIEVEMENTS</SectionHeading>
        
        <div className="grid md:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((achievement, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card glow-border p-8 flex flex-col items-center text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="mb-6 p-4 rounded-full bg-dark border border-white/5 shadow-inner">
                {achievement.icon}
              </div>
              <h3 className="font-heading font-bold text-lg text-light mb-3">{achievement.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      e.target.reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionHeading>CONTACT</SectionHeading>
        
        <div className="glass-card p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12">
            
            <div>
              <h3 className="text-2xl font-heading font-bold text-light mb-4">Let's connect.</h3>
              <p className="text-muted mb-8">
                I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
              
              <div className="flex gap-4">
                <a href={PERSONAL_INFO.githubUrl} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-cyan hover:border-cyan/50 transition-all">
                  <Github className="w-6 h-6" />
                </a>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-cyan hover:border-cyan/50 transition-all">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href={`mailto:${PERSONAL_INFO.email}`} className="p-4 bg-white/5 border border-white/10 rounded-xl text-muted hover:text-cyan hover:border-cyan/50 transition-all">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input type="text" required placeholder="Name" className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-light focus:outline-none focus:border-cyan transition-colors" />
              </div>
              <div>
                <input type="email" required placeholder="Email" className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-light focus:outline-none focus:border-cyan transition-colors" />
              </div>
              <div>
                <textarea required placeholder="Message" rows="4" className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-light focus:outline-none focus:border-cyan transition-colors resize-none"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={formStatus === 'submitting' || formStatus === 'success'}
                className="w-full bg-cyan/10 hover:bg-cyan/20 border border-cyan text-cyan font-mono py-3 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
              >
                {formStatus === 'idle' && <>Send Message <ArrowRight className="w-4 h-4" /></>}
                {formStatus === 'submitting' && 'Sending...'}
                {formStatus === 'success' && 'Message Sent! ✓'}
              </button>
            </form>

          </div>
        </div>

        <div className="mt-24 text-center">
          <div className="inline-block text-left p-4 bg-dark border border-white/5 rounded-lg font-mono text-sm text-muted mb-8 shadow-2xl">
            <span className="text-cyan">het@portfolio</span>:<span className="text-amber">~</span>$ echo "Thanks for visiting. Let's build something intelligent together." <span className="animate-pulse">_</span>
          </div>
          <p className="text-sm text-muted/60 font-mono">
            Designed & Built by Het Bhatt · 2025
          </p>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  return (
    <div className="bg-dark min-h-screen selection:bg-cyan/30 selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ExperienceEducation />
      <Achievements />
      <Contact />
    </div>
  );
};

export default App;
