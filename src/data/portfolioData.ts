export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "AI & Computer Vision" | "Enterprise Platform" | "Software Architecture" | "E-Commerce";
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
  type: "Freelance" | "Trainee" | "Employment" | "Internship";
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
    title: "Trainee at Expleo | AI & Software Builder",
    heroHeadline: "ENGINEERING INTELLIGENT SOFTWARE & DIGITAL EXPERIENCES",
    subheadline: "AI & Data Science graduate building computer vision systems, enterprise web platforms, and intelligent workflows — turning complex algorithms into production software.",
    aboutBio:
      "I'm Sriram K, an AI & Data Science graduate and Trainee at Expleo. My background includes 2 Months of freelance software development associated with Wave Init Solutions. I work at the intersection of artificial intelligence, software development and emerging technologies, turning ideas into practical digital experiences.",
    location: "Salem, Tamil Nadu, India",
    portrait: "/sriram_portrait.jpg",
    portraitLarge: "/sriram_photo_large.jpg",
    status: {
      available: true,
      text: "Trainee at Expleo",
    },
  },

  links: {
    expleoSolutions: "https://expleo.com/global/en/",
    lms: "https://www.waveinitlms.online/",
    waveInitSolutions: "https://www.waveinitsolutions.online/",
    waveInitLinkedIn: "https://www.linkedin.com/company/wave-init",
    personalLinkedIn: "https://www.linkedin.com/in/sriram-k-486bb4343/",
    linkedin: "https://www.linkedin.com/in/sriram-k-486bb4343/",
    github: "https://github.com/sriram-Kannan-45",
    email: "sriram.waveinti@gmail.com",
    phone: "+91 6381102874",
    phoneTel: "+916381102874",
    resumePdf: "/SRIRAMK_RESUME.pdf",
  },

  professionalSpotlights: [
    {
      id: "expleo",
      pill: "01 // PROFESSIONAL EXPERIENCE",
      title: "PROFESSIONAL EXPERIENCE — EXPLEO",
      role: "Trainee — Expleo",
      period: "October 2026 – Present",
      experienceType: "Trainee",
      quote: "Developing practical technical knowledge through professional training at Expleo.",
      companyName: "Expleo",
      companyDescription:
        "Currently undergoing professional training at Expleo, developing practical technical knowledge, understanding industry-standard software development practices, and gaining exposure to professional engineering and testing workflows.",
      logo: "/expleo-logo.png",
      brandLabel: "Expleo",
      principlesLabel: "Professional Training Focus",
      actions: [
        { id: "expleo-visit-site-cta", label: "Expleo Site", href: "https://expleo.com/global/en/" },
        { id: "expleo-experience-cta", label: "View Experience", href: "#experience" },
        { id: "expleo-linkedin-cta", label: "LinkedIn Profile", href: "https://www.linkedin.com/in/sriram-k-486bb4343/" },
      ],
      keyPillars: [
        { title: "Professional Training", desc: "Currently undergoing professional training at Expleo." },
        { title: "Technical Knowledge", desc: "Developing practical technical knowledge through training." },
        { title: "Development Practices", desc: "Understanding industry-standard software development practices." },
        { title: "Engineering & Testing", desc: "Gaining exposure to professional engineering and testing workflows." },
      ],
    },
    {
      id: "founder",
      pill: "02 // FREELANCE EXPERIENCE",
      role: "Freelance Software Developer",
      period: "2 Months",
      experienceType: "Freelance",
      title: "FREELANCE EXPERIENCE — WAVE INIT SOLUTIONS",
      quote:
        "Contributed to modern software development projects through freelance work associated with Wave Init Solutions, focusing on practical development, AI-assisted workflows, and building effective digital solutions.",
      companyName: "Wave Init Solutions",
      brandLabel: "Official Enterprise Branding",
      principlesLabel: "Core Engineering Principles",
      actions: [
        { id: "founder-visit-site-cta", label: "Wave Init Solutions Site", href: "https://www.waveinitsolutions.online/" },
        { id: "founder-launch-lms-cta", label: "Launch Wave Init LMS", href: "https://www.waveinitlms.online/" },
        { id: "founder-linkedin-cta", label: "Company LinkedIn", href: "https://www.linkedin.com/company/wave-init" },
      ],
      companyDescription:
        "Wave Init Solutions builds modern full-stack applications, AI-powered products, GenAI solutions, web platforms and intelligent automation using advanced AI-assisted development workflows. We engineer architectures capable of sub-second execution, enterprise-grade security, and modular scaling.",
      logo: "/waveinit-official-logo.jpg",
      logoHorizontal: "/waveinit-official-logo.jpg",
      logoSvg: "/waveinit-official-logo.jpg",
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
  ],

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
      subtitle: "Freelance Software Development",
      category: "Enterprise Platform",
      featured: true,
      description:
        "Contributed to software development projects through freelance work associated with Wave Init Solutions, focusing on practical development, AI-assisted workflows, and effective digital solutions.",
      longDescription: [
        "Contributed as a Freelance Software Developer associated with Wave Init Solutions for 2 Months.",
        "Architected scalable web infrastructure utilizing modern React ecosystems, microservices, and AI-assisted engineering pipelines.",
        "Engineered reliable business workflows, context-aware AI tools, and enterprise interfaces serving real business throughput.",
      ],
      tags: ["Full-Stack", "AI Engineering", "GenAI Architecture", "Next.js", "Enterprise Systems"],
      metrics: [
        { label: "Experience Type", value: "Freelance" },
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
      id: "achu-boutique",
      title: "Achu Boutique",
      subtitle: "Designer Ethnic Wear Store",
      category: "E-Commerce",
      featured: true,
      description:
        "Online boutique showcasing sarees, designer kurtis, anarkalis, and festive ethnic wear, with collection browsing and WhatsApp enquiries.",
      longDescription: [
        "Product collections showcasing handcrafted sarees, designer kurtis, and festive ethnic wear.",
        "Collection search, new-arrival browsing, and a shopping bag interface for exploring boutique products.",
        "WhatsApp enquiries for connecting with the boutique about its collections.",
      ],
      tags: ["Next.js", "E-Commerce", "Product Catalog", "WhatsApp Enquiries"],
      metrics: [
        { label: "Project Type", value: "Boutique Store" },
        { label: "Core Feature", value: "Product Collections" },
        { label: "Website", value: "achuboutique.store" },
      ],
      liveUrl: "https://achuboutique.store/",
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
  ] as Project[],

  experience: [
    {
      company: "Expleo",
      role: "Trainee",
      period: "October 2026 – Present",
      location: "India",
      type: "Trainee",
      summary:
        "Currently undergoing professional training at Expleo, developing practical technical knowledge, understanding industry-standard software development practices, and gaining exposure to professional engineering and testing workflows.",
      responsibilities: [],
      technologies: [],
    },
    {
      company: "Wave Init Solutions",
      role: "Freelance Software Developer",
      period: "2 Months",
      location: "Salem, Tamil Nadu, India",
      type: "Freelance",
      summary:
        "Contributed to modern software development projects through freelance work associated with Wave Init Solutions, focusing on practical development, AI-assisted workflows, and building effective digital solutions.",
      responsibilities: [
        "Contributed to practical software development projects associated with Wave Init Solutions.",
        "Used AI-assisted development workflows to support effective digital solutions.",
      ],
      technologies: ["React", "Next.js", "TypeScript", "Python", "AI Integration", "Cloud Architecture"],
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
      desc: "Precision and command — Sriram K, Trainee at Expleo.",
      indicator: "05 / 05",
    },
  ],
};
