/**
 * CENTRAL SITE CONFIGURATION
 * --------------------------------------------------------------
 * Every personal detail on the site comes from this file (plus
 * src/data/projects.js and src/data/experience.js). Edit here and
 * nowhere else. Leave a string empty ("") to hide the matching UI.
 */

export const site = {
  // Used for the canonical URL and Open Graph tags.
  websiteUrl: 'https://hb2810.github.io/',

  identity: {
    fullName: 'Het Bhatt',
    displayName: 'HET',
    // Short name used in the wordmark / favicon.
    initials: 'HB',
    profession: 'AI / ML Engineer',
    roleLine2: 'Computer Vision · AI Officer',
    location: 'Ahmedabad, India',
    availability: 'Open to AI / ML roles & collaborations',
    headline: 'Making machines see, learn, and reason.',
    intro:
      'Exploring intelligence through code. From mathematical theory to production systems, I build deep-learning and computer-vision work that actually ships.',
    about: [
      "I'm Het, AI Officer at Stavya Spine Hospital, where I lead AI-driven digital transformation of day-to-day operations, AI-based research and AI applications for routine workflows. I hold a B.E. in Information Technology from LDRP-ITR (KSV University, Ahmedabad), class of 2026.",
      'My work sits at the intersection of AI, deep learning and computer vision. I interned at SAC-ISRO on FMCW Lidar preprocessing and published a Scopus-indexed paper on Gujarati image captioning with Springer.',
      'I believe in depth over breadth, fundamentals over shortcuts, and building things that actually work.',
    ],
    quote: 'Depth over breadth. Fundamentals over shortcuts.',
    // Transparent cut-out portrait (WebP). Leave empty to use a typographic hero.
    portrait: 'assets/portrait.webp',
    portraitSmall: 'assets/portrait-640.webp',
    portraitAlt: 'Painted portrait of Het Bhatt',
    resume: 'assets/Het-Bhatt-Resume.pdf',
  },

  contact: {
    email: 'hetbhatt10@gmail.com',
    phone: '+91 97142 34634',
    whatsapp: '', // international digits only, e.g. "919714234634". Empty = hidden.
    linkedin: 'https://www.linkedin.com/in/het-bhatt-444a23294/',
    github: 'https://github.com/HB2810',
    githubHandle: 'HB2810',
    instagram: '',
    youtube: '',
    otherLinks: [],
  },

  // Only verified numbers. Each shows as a large stat in the hero.
  metrics: [
    { value: '91%', label: 'Deepfake detection accuracy' },
    { value: '1', label: 'Springer paper, Scopus indexed' },
    { value: '20', label: 'Public GitHub repositories' },
  ],

  skills: [
    {
      group: 'AI / ML / Deep Learning',
      items: ['PyTorch', 'TensorFlow', 'Keras', 'Scikit-learn', 'MLflow', 'NumPy', 'Pandas'],
    },
    {
      group: 'Computer Vision',
      items: ['OpenCV', 'CNN', 'ResNet', 'BiLSTM', 'GRU', 'Grad-CAM', 'Object Detection', 'Image Processing'],
    },
    {
      group: 'Languages & Web',
      items: ['Python', 'SQL', 'C', 'JavaScript', 'Flask', 'Django', 'React', 'HTML / CSS'],
    },
    {
      group: 'Cloud, Data & IT',
      items: ['AWS', 'Azure', 'Firebase', 'Docker (basic)', 'Linux', 'PostgreSQL', 'MongoDB', 'SQLite', 'System & Network Support'],
    },
  ],

  tools: ['PyTorch', 'OpenCV', 'Python', 'Flask', 'React', 'Streamlit', 'Jupyter', 'Git & GitHub', 'VS Code', 'Figma', 'Arduino'],

  // How I work. Descriptive, not a factual claim.
  processSteps: [
    { title: 'Understand', text: 'Frame the problem, the data available and what a correct answer looks like.' },
    { title: 'Prepare', text: 'Clean, preprocess and split the data; set a baseline before anything clever.' },
    { title: 'Model', text: 'Design and train the architecture, iterating on what the error analysis shows.' },
    { title: 'Evaluate', text: 'Measure honestly, explain the model (Grad-CAM, ablations) and document results.' },
    { title: 'Ship', text: 'Package it as a usable app or paper and keep it running in the real world.' },
  ],

  interests: ['Cricket', 'Badminton', 'Travelling', 'Poetry', 'Astrology', 'Palmistry'],

  appearance: {
    background: '#090909',
    text: '#f2efeb',
    accent: '#e32b3c',
    muted: '#a09c9a',
    displayFont: 'Anton',
    bodyFont: 'Manrope',
    accentFont: 'Caveat',
    animationIntensity: 'balanced', // subtle | balanced | expressive
  },

  preferences: {
    showAwards: true,
    showEducation: true,
    showExperience: true,
    showBeforeAfter: false,
    showClientLogos: false,
    showTestimonials: false,
    showContactForm: true,
    showDownloadResume: true,
    showProjectArchive: true,
    showProcess: true,
  },

  // Page "Rebuild" effect (cursor swarm rebuilds the page). Also available from the header button.
  rebuild: {
    autoStart: true, // run automatically on every visit (skipped when Motion is off or reduced motion is set)
    autoSpeed: 2, // 1 | 2 | 3 — speed used for the automatic run
    autoTour: false, // auto-scroll the page while it rebuilds
    autoDelay: 350, // ms to wait after the page has loaded before starting
  },

  // Storage key for the motion toggle, derived from the brand.
  storageKey: 'hb-portfolio-motion',
};

export default site;
