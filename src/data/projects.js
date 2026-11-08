/**
 * PROJECTS
 * --------------------------------------------------------------
 * Real work only. Set `featured: true` on the 2–4 strongest.
 * `cover` is optional: leave it empty and the site renders an
 * abstract generated cover for that project. To use a screenshot,
 * put it in public/assets/projects/ and set cover: 'assets/projects/name.webp'.
 */

export const projects = [
  {
    id: 'deepfake-detection',
    title: 'Deepfake Detection System',
    category: 'AI / ML',
    year: '2025',
    summary: 'Multimodal CNN + BiLSTM detector with 91% accuracy on a custom audio-video dataset.',
    description:
      'An advanced multimodal deepfake detection system that integrates CNN-based spatial feature extraction with BiLSTM temporal pattern recognition. Feature-level fusion, ensemble modelling and extensive preprocessing deliver 91% accuracy on a custom audio-video dataset, and Grad-CAM explainability shows where the model is looking when it flags a forgery.',
    role: 'Research & implementation',
    tools: ['PyTorch', 'CNN', 'BiLSTM', 'Grad-CAM', 'Python'],
    highlight: '91% accuracy',
    cover: '',
    gallery: [],
    videoUrl: '',
    liveUrl: '',
    sourceUrl: '',
    featured: true,
  },
  {
    id: 'gujarati-caption-generator',
    title: 'Image-Based Caption Generator (Gujarati)',
    category: 'Research',
    year: '2025',
    summary: 'Low-resource Gujarati image captioning, published at ICDSA 2025 (Springer, Scopus indexed).',
    description:
      'A low-resource Gujarati image captioning model trained on Flickr8k and Flickr30k, using a ResNet-18 encoder with a GRU decoder and SentencePiece tokenisation to handle Gujarati morphology. It reached BLEU-4 scores of 0.225 (Flickr8k) and 0.192 (Flickr30k). The work was published as Paper No. 1837, "Image-Based Caption Generation for Gujarati Language Using Deep Learning", at ICDSA 2025 (Springer, Scopus indexed, Vol. 6).',
    role: 'Author & implementation',
    tools: ['Python', 'PyTorch', 'ResNet-18', 'GRU', 'SentencePiece'],
    highlight: 'Springer published',
    cover: '',
    gallery: [],
    videoUrl: '',
    liveUrl: '',
    sourceUrl: '',
    featured: true,
  },
  {
    id: 'resolveit-helpdesk',
    title: 'ResolveIT — Employee Helpdesk Ticketing System',
    category: 'Web App',
    year: '2026',
    summary: 'Flask helpdesk with authentication, role-based access, ticket tracking and an admin dashboard.',
    description:
      'A web-based IT helpdesk for managing employee technical support requests. It includes authentication, role-based access, ticket tracking, status management and an admin dashboard, built with Flask, SQLite, SQLAlchemy and Bootstrap in a modular project architecture.',
    role: 'Full-stack developer',
    tools: ['Python', 'Flask', 'SQLite', 'SQLAlchemy', 'Bootstrap'],
    highlight: 'Live demo',
    cover: '',
    gallery: [],
    videoUrl: '',
    liveUrl: 'https://resolve-it-employee-helpdesk-ticket.vercel.app',
    sourceUrl: 'https://github.com/HB2810/ResolveIT--Employee-Helpdesk-Ticketing-System',
    featured: true,
  },
  {
    id: 'plant-disease-detection',
    title: 'Plant Disease Detection System',
    category: 'Computer Vision',
    year: '2025',
    summary: 'Classifies plant diseases from leaf images with PyTorch, deployed as a Streamlit app.',
    description:
      'An AI-powered plant disease detection system that classifies diseases from leaf images using a deep-learning model trained in PyTorch, deployed as an interactive Streamlit web app so anyone can upload a photo and get a prediction.',
    role: 'ML engineer',
    tools: ['PyTorch', 'Streamlit', 'Jupyter Notebook'],
    highlight: '',
    cover: '',
    gallery: [],
    videoUrl: '',
    liveUrl: '',
    sourceUrl: 'https://github.com/HB2810/plant_disease_detection',
    featured: false,
  },
  {
    id: 'virtual-piano',
    title: 'Virtual Piano — Computer Vision',
    category: 'Computer Vision',
    year: '2025',
    summary: 'Play a piano in the air: hand tracking with OpenCV turns gestures into notes.',
    description:
      'An interactive virtual piano that uses hand-gesture tracking through computer vision so you can play musical notes without touching a physical keyboard. Built in Python with OpenCV.',
    role: 'Developer',
    tools: ['Python', 'OpenCV', 'Computer Vision', 'Jupyter Notebook'],
    highlight: '',
    cover: '',
    gallery: [],
    videoUrl: '',
    liveUrl: '',
    sourceUrl: 'https://github.com/HB2810/Virtual-Piano-Using-Computer-Vison-and-Opencv-python-',
    featured: false,
  },
  // TEMPLATE — copy this block, fill in a real project and uncomment it.
  // {
  //   id: 'chakshya',
  //   title: 'Chakshya',
  //   category: 'Computer Vision',
  //   year: '2025',
  //   summary: '',
  //   description: '',
  //   role: '',
  //   tools: ['TypeScript'],
  //   highlight: '',
  //   cover: '',
  //   gallery: [],
  //   videoUrl: '',
  //   liveUrl: '',
  //   sourceUrl: 'https://github.com/HB2810/Chakshya',
  //   featured: false,
  // },
];

export default projects;
