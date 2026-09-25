export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "AI & Computer Vision" | "Enterprise Platform" | "Software Architecture";
  description: string;
  longDescription: string[];
  tags: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  githubUrl?: string;
  internalRef?: string;
  featured: boolean;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  type: "Founding" | "Employment" | "Internship";
  summary: string;
  responsibilities: string[];
  technologies: string[];
  verifiedNote?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  score: string;
  highlight?: string;
}

export const PORTFOLIO_DATA = {
  identity: {
    name: "Sriram K",
    title: "AI & Software Builder | Founder, Wave Init Solutions",
    heroHeadline: "ENGINEERING INTELLIGENT SOFTWARE & DIGITAL EXPERIENCES",
    subheadline: "AI & Data Science graduate building computer vision systems, enterprise web platforms, and intelligent workflows — turning complex algorithms into production software.",
    aboutBio:
      "I'm Sriram K, an AI & Data Science graduate, software builder and founder of Wave Init Solutions. I work at the intersection of artificial intelligence, software development and emerging technologies, turning ideas into practical digital experiences.",
    location: "Salem, Tamil Nadu, India",
    portrait: "/sriram_portrait.jpg",
    portraitLarge: "/sriram_photo_large.jpg",
    status: {
      available: true,
      text: "Open to AI & Software Engineering Engagements",
    },
  },

  links: {
    lms: "https://www.waveinitlms.online/",
    waveInitSolutions: "https://www.waveinitsolutions.online/",
    waveInitLinkedIn: "https://www.linkedin.com/company/wave-init",
    personalLinkedIn: "https://www.linkedin.com/in/sriram-k-486bb4343/",
    github: "https://github.com/sriram-Kannan-45",
    email: "titooram123@gmail.com",
    phone: "+91 6381102874",
    phoneTel: "+916381102874",
    resumePdf: "/SRIRAMK_RESUME.pdf",
  },

  founderVision: {
    title: "FOUNDER'S VISION — SRIRAM K / Founder, Wave Init Solutions",
    quote:
      "Wave Init was founded with a single mission: bridging the gap between cutting-edge artificial intelligence and high-performance software engineering to build scalable, production-grade applications that solve real-world problems.",
    companyName: "Wave Init Solutions",
    companyTagline: "AI, Full-Stack & GenAI Development Studio",
    companyDescription:
      "Wave Init Solutions builds modern full-stack applications, AI-powered products, GenAI solutions, web platforms and intelligent automation using advanced AI-assisted development workflows. We engineer architectures capable of sub-second execution, enterprise-grade security, and modular scaling.",
    logo: "/waveinit-logo.png",
    logoHorizontal: "/waveinit-logo-horizontal.png",
    logoSvg: "/waveinit-logo.svg",
    keyPillars: [
      {
        title: "Sub-Second Latency Execution",
        desc: "Optimized rendering cycles, lightweight bundles, and streaming server responses for immediate feedback.",
      },
      {
        title: "High-Concurrency Data Pipelines",
        desc: "Event-driven message queues, vector search indexes, and resilient storage built for heavy parallel loads.",
      },
      {
        title: "Enterprise-Grade Security",
        desc: "Strict role-based access control (RBAC), end-to-end token encryption, and audited data isolation.",
      },
      {
        title: "Modular System Boundaries",
        desc: "Clean microservice contracts and decoupled UI components that prevent tech debt and simplify future expansions.",
      },
    ],
  },

  skills: {
    languages: ["Python", "Java", "TypeScript", "C", "SQL"],
    aiAndMl: [
      "TensorFlow",
      "PyTorch",
      "Scikit-learn",
      "Computer Vision",
      "Deep Learning",
      "Machine Learning",
      "AI-Assisted Coding",
    ],
    libraries: ["OpenCV", "NumPy", "Pandas", "NLTK", "gTTS"],
    engineeringAndDevOps: [
      "REST APIs",
      "OOP",
      "Git",
      "GitHub",
      "Docker",
      "Jenkins",
      "Maven",
      "Agile & SDLC",
    ],
    qualityAndVerification: [
      "Selenium WebDriver",
      "Playwright",
      "TestNG",
      "PyTest",
      "REST Assured",
      "ISTQB Fundamentals",
    ],
    portfolioTechStack: [
      "Next.js (App Router)",
      "React 19 & TypeScript",
      "Tailwind CSS v4",
      "Three.js & React Three Fiber (@react-three/fiber)",
      "@react-three/drei",
      "GSAP & ScrollTrigger",
    ],
  },

  projects: [
    {
      id: "wave-init-solutions",
      title: "Wave Init Solutions",
      subtitle: "Official AI & Software Development Venture",
      category: "Enterprise Platform",
      featured: true,
      description:
        "Founded tech venture engineering full-stack digital products, custom AI model integration, and agentic workflows for modern enterprises.",
      longDescription: [
        "Founded and direct Wave Init Solutions as an innovation-driven software company focused on modern full-stack applications and intelligent automation.",
        "Architected scalable web infrastructure utilizing modern React ecosystems, microservices, and AI-assisted engineering pipelines.",
        "Engineered reliable business workflows, context-aware AI tools, and enterprise interfaces serving real business throughput.",
      ],
      tags: ["Full-Stack", "AI Engineering", "GenAI Architecture", "Next.js", "Enterprise Systems"],
      metrics: [
        { label: "Venture Status", value: "Active Founder" },
        { label: "Core Focus", value: "AI + Full-Stack" },
        { label: "Deployment", value: "Production Live" },
      ],
      liveUrl: "https://www.waveinitsolutions.online/",
    },
    {
      id: "wave-init-lms",
      title: "Wave Init LMS Portal",
      subtitle: "Enterprise Learning & Assessment Platform",
      category: "Enterprise Platform",
      featured: true,
      description:
        "Full-featured enterprise Learning Management System featuring proctored online examinations, course management, and analytics.",
      longDescription: [
        "Engineered the official Wave Init LMS platform with complete student and trainer workflows, modular courses, and automated grading.",
        "Integrated AI-assisted proctoring and monitoring modules with secure role-based access control (RBAC).",
        "Built responsive, accessible interfaces with sub-second navigation and real-time assessment tracking.",
      ],
      tags: ["LMS Architecture", "React", "Node.js", "Proctoring Workflows", "Security & RBAC"],
      metrics: [
        { label: "Platform Role", value: "Flagship Product" },
        { label: "Access Level", value: "Multi-Role RBAC" },
        { label: "URL", value: "waveinitlms.online" },
      ],
      liveUrl: "https://www.waveinitlms.online/",
    },
    {
      id: "bone-fracture-detection",
      title: "Bone Fracture Detection System",
      subtitle: "Deep Learning & Computer Vision Analysis",
      category: "AI & Computer Vision",
      featured: true,
      description:
        "High-precision diagnostic inference pipeline using YOLO, TensorFlow, and OpenCV to detect and localize bone fractures from medical X-ray imagery.",
      longDescription: [
        "Designed an AI-powered bone fracture detection system utilizing YOLO for rapid, high-precision localization across X-ray and radiographic imaging.",
        "Implemented end-to-end deep learning pipelines using TensorFlow and OpenCV, enabling real-time diagnostic bounding-box prediction.",
        "Integrated adaptive image preprocessing, contrast enhancement, and data augmentation to improve model generalization across heterogeneous medical datasets.",
        "Constructed a modular, scalable architecture structured for clinical workflow integration to accelerate diagnostic review times.",
      ],
      tags: ["YOLO", "TensorFlow", "OpenCV", "Deep Learning", "Medical Image Processing", "Python"],
      metrics: [
        { label: "Model Architecture", value: "YOLO + CNNs" },
        { label: "Data Pipeline", value: "OpenCV Augmentation" },
        { label: "Task", value: "Fracture Localization" },
      ],
    },
    {
      id: "medicam-recognition",
      title: "Medicam — AI Medicine Recognition",
      subtitle: "Computer Vision & Multilingual Audio Accessibility",
      category: "AI & Computer Vision",
      featured: true,
      description:
        "AI-based medicine identification system pairing OpenCV camera classification with Tamil and English auditory guidance for elderly and low-literacy users.",
      longDescription: [
        "Developed an assistive computer vision system using OpenCV for real-time medicine packaging and strip identification directly from camera feed.",
        "Implemented bilingual Text-to-Speech (TTS) pipelines using gTTS, generating clear spoken dosage instructions in Tamil and English.",
        "Integrated NLTK-based natural language processing to parse structured medicine usage guidelines, warnings, and schedules.",
        "Crafted a low-friction, audio-first user interface tailored for elderly patients, visually impaired individuals, and low-literacy users.",
      ],
      tags: ["OpenCV", "NLP", "NLTK", "gTTS", "Multilingual Audio", "Accessibility"],
      metrics: [
        { label: "Audio Languages", value: "Tamil & English" },
        { label: "Input Mode", value: "Camera Stream" },
        { label: "Audience Focus", value: "Accessibility & Health" },
      ],
    },
    {
      id: "training-feedback-system",
      title: "Training Feedback Management System",
      subtitle: "Java Enterprise Architecture & Relational Persistence",
      category: "Software Architecture",
      featured: false,
      description:
        "Modular Core Java system utilizing object-oriented principles and JDBC persistence to collect and analyze multi-dimensional corporate feedback.",
      longDescription: [
        "Architected an enterprise feedback management backend in Core Java to digitize and structure feedback collection for training cohorts.",
        "Applied OOP principles including encapsulation, inheritance hierarchies, and polymorphic processors for maintainable business logic.",
        "Integrated relational database persistence via JDBC with prepared statements, transactions, and structured reporting schemas.",
      ],
      tags: ["Core Java", "JDBC", "OOP", "SQL", "Relational Database"],
      metrics: [
        { label: "Core Language", value: "Java" },
        { label: "Data Layer", value: "JDBC / SQL" },
        { label: "Paradigm", value: "Strict OOP" },
      ],
    },
  ] as Project[],

  experience: [
    {
      company: "Wave Init Solutions",
      role: "Founder & Lead Builder",
      period: "Sep 2024 – Present",
      location: "Salem, Tamil Nadu, India",
      type: "Founding",
      summary:
        "Founded technology studio delivering AI-powered software, scalable full-stack web platforms, and automated developer systems.",
      responsibilities: [
        "Directed product architecture and technological strategy across flagship projects including Wave Init LMS and client digital platforms.",
        "Designed and implemented high-concurrency cloud architectures, modern React interfaces, and intelligent automation systems.",
        "Built company presence, client relationships, and end-to-end technical delivery standards.",
      ],
      technologies: ["React", "Next.js", "TypeScript", "Python", "AI Integration", "Cloud Architecture"],
      verifiedNote: "Registered Founder & Executive Lead",
    },
    {
      company: "Expleo Solutions",
      role: "Quality Assurance Engineer",
      period: "Current Role",
      location: "India",
      type: "Employment",
      summary:
        "Engineering rigorous quality verification, automated regression pipelines, and software reliability suites across enterprise applications.",
      responsibilities: [
        "Executing functional verification, defect tracking, and systematic validation of enterprise software modules.",
        "Designing structured test methodologies to ensure system stability, compliance, and user safety.",
        "Collaborating across engineering teams to streamline delivery cycles with a quality-first engineering mindset.",
      ],
      technologies: ["Automation Testing", "Selenium WebDriver", "TestNG", "CI/CD", "ISTQB Fundamentals"],
      verifiedNote: "Current Employment (QA Discipline)",
    },
    {
      company: "Evointoo",
      role: "Deep Learning Intern",
      period: "Feb 2025 – Recent",
      location: "Remote / Hybrid",
      type: "Internship",
      summary:
        "Hands-on research and development of deep neural network architectures and computer vision pipelines.",
      responsibilities: [
        "Developed and fine-tuned deep neural network architectures using TensorFlow and PyTorch for image recognition and pattern classification.",
        "Constructed computer vision preprocessing pipelines, data augmentation routines, and model inference benchmarks.",
        "Analyzed model loss curves, hyperparameter trade-offs, and latency-accuracy balances on specialized datasets.",
      ],
      technologies: ["TensorFlow", "PyTorch", "OpenCV", "Deep Learning", "Computer Vision"],
      verifiedNote: "Evointoo Certified DL Internship",
    },
    {
      company: "TechVolt Pvt. Limited",
      role: "Machine Learning Intern",
      period: "Jul 2024 – Oct 2024",
      location: "Coimbatore, Tamil Nadu",
      type: "Internship",
      summary:
        "End-to-end machine learning engineering from exploratory data analysis to model deployment.",
      responsibilities: [
        "Executed end-to-end ML model development including data preprocessing, feature engineering, and algorithm implementation in Python.",
        "Applied regression and classification algorithms with Scikit-learn to solve real-world structured data problems.",
        "Gained hands-on experience in cross-validation, hyperparameter tuning, and metric evaluation within an Agile team structure.",
      ],
      technologies: ["Python", "Scikit-learn", "NumPy", "Pandas", "Agile SDLC"],
      verifiedNote: "TechVolt ML Certificate Credential",
    },
  ] as ExperienceItem[],

  education: [
    {
      degree: "B.Tech in Artificial Intelligence & Data Science",
      institution: "Knowledge Institute of Technology (KIOT)",
      period: "2022 – 2026",
      score: "8.25 CGPA",
      highlight: "Specialized in Deep Learning, Computer Vision, and Software Engineering",
    },
    {
      degree: "Higher Secondary Certificate (Class XII)",
      institution: "Little Flower Higher Secondary School",
      period: "2021 – 2022",
      score: "88.8%",
      highlight: "Mathematics & Physical Sciences Foundation",
    },
    {
      degree: "Secondary School Leaving Certificate (Class X)",
      institution: "Govt. High School, Chettichavadi",
      period: "2019 – 2020",
      score: "86.6%",
      highlight: "General Academic Distinction",
    },
  ] as EducationItem[],

  certifications: [
    {
      name: "Deep Learning Certificate",
      issuer: "Evointoo",
      focus: "Neural Networks & Computer Vision",
    },
    {
      name: "Machine Learning Certificate",
      issuer: "TechVolt Pvt. Limited",
      focus: "Statistical Modeling & Predictive Algorithms",
    },
    {
      name: "ISTQB Certified Tester Foundation Level",
      issuer: "ISTQB (CTFL-153711)",
      focus: "Software Testing Standards & Quality Principles",
    },
  ],

  heroStages: [
    {
      timeRange: [0.0, 1.8],
      scrollRange: [0.0, 0.18],
      title: "Lying in Darkness",
      desc: "Subtle atmospheric presence — the quiet before the inception.",
      indicator: "01 / 05",
    },
    {
      timeRange: [1.8, 3.8],
      scrollRange: [0.18, 0.38],
      title: "Two Blinks",
      desc: "Awakening consciousness — perception calibrating.",
      indicator: "02 / 05",
    },
    {
      timeRange: [3.8, 5.8],
      scrollRange: [0.38, 0.58],
      title: "Awakening",
      desc: "Focused gaze taking command of the environment.",
      indicator: "03 / 05",
    },
    {
      timeRange: [5.8, 7.8],
      scrollRange: [0.58, 0.78],
      title: "Sitting Up",
      desc: "Rising posture — transitioning intention into motion.",
      indicator: "04 / 05",
    },
    {
      timeRange: [7.8, 10.0],
      scrollRange: [0.78, 1.0],
      title: "Adjusting Tie",
      desc: "Precision and command — Sriram K, Founder of Wave Init Solutions.",
      indicator: "05 / 05",
    },
  ],
};
