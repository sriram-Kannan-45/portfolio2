import React from "react";

interface TechIconProps {
  name: string;
  className?: string;
}

export function TechIcon({ name, className = "w-6 h-6" }: TechIconProps) {
  const normalized = name.toLowerCase().trim();

  // 1. Python
  if (normalized.includes("python") && !normalized.includes("pytest")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Python">
        <path
          d="M11.914 2C6.726 2 7.05 4.254 7.05 4.254l.006 2.342h5.002v.703H4.402S2 7.02 2 12.234c0 5.213 2.096 4.977 2.096 4.977h1.25V15.46s-.068-2.098 2.062-2.098h5.025s1.995.033 1.995-1.93V4.254S14.862 2 11.914 2zm-2.05 1.547a.914.914 0 1 1 0 1.828.914.914 0 0 1 0-1.828z"
          fill="#3776AB"
        />
        <path
          d="M12.086 22c5.188 0 4.864-2.254 4.864-2.254l-.006-2.342h-5.002v-.703h7.656S22 16.98 22 11.766c0-5.213-2.096-4.977-2.096-4.977h-1.25v1.751s.068 2.098-2.062 2.098h-5.025s-1.995-.033-1.995 1.93v7.177S9.138 22 12.086 22zm2.05-1.547a.914.914 0 1 1 0-1.828.914.914 0 0 1 0 1.828z"
          fill="#FFD43B"
        />
      </svg>
    );
  }

  // 2. TensorFlow
  if (normalized.includes("tensorflow")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="TensorFlow">
        <path d="M1.292 5.856L11.54 0v24l-4.095-2.397V7.876L3.34 10.23V5.856zm19.368 4.374V5.856L12.459 0v24l4.095-2.397V7.876l4.106 2.354z" fill="#FF6F00" />
      </svg>
    );
  }

  // 3. PyTorch
  if (normalized.includes("pytorch")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="PyTorch">
        <path
          d="M12.784 0c-.165 0-.33.023-.495.07a3.003 3.003 0 0 0-2.072 2.071c-.046.166-.07.33-.07.495v.023c0 .165.024.33.07.495.088.318.257.61.493.847l2.846 2.846c.467.467 1.225.467 1.692 0a1.197 1.197 0 0 0 0-1.692L13.79 3.696A1.503 1.503 0 0 1 14.85 1.13c.16-.046.326-.07.492-.07.828 0 1.5.672 1.5 1.5 0 .285-.08.558-.23.791l-4.72 4.72a3.896 3.896 0 0 0-1.144 2.76c0 2.155 1.747 3.902 3.902 3.902 2.155 0 3.902-1.747 3.902-3.902 0-1.036-.412-2.03-1.144-2.761L12.784 3.447v-.023c0-.165-.024-.33-.07-.495A3.003 3.003 0 0 0 10.642.858 2.94 2.94 0 0 0 10.147.79c-.165 0-.33.023-.495.07A3.003 3.003 0 0 0 7.58 2.93a2.94 2.94 0 0 0-.07.495v.023c0 .165.023.33.07.495.087.318.257.61.492.847l6.364 6.364c.236.236.529.406.847.493.165.046.33.07.495.07.828 0 1.5-.672 1.5-1.5 0-.398-.158-.78-.44-1.061l-5.657-5.656a.75.75 0 0 1 0-1.061.75.75 0 0 1 1.06 0l5.657 5.656A3.003 3.003 0 0 1 18.7 11.23a3.003 3.003 0 0 1-.88 2.122c-.563.563-1.326.88-2.122.88a3.003 3.003 0 0 1-2.122-.88l-6.364-6.364A4.504 4.504 0 0 1 6 3.447c0-.622.124-1.233.364-1.8A4.504 4.504 0 0 1 9.447.364 4.412 4.412 0 0 1 11.246 0h1.538z"
          fill="#EE4C2C"
        />
      </svg>
    );
  }

  // 4. Scikit-learn
  if (normalized.includes("scikit") || normalized.includes("sklearn")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Scikit-learn">
        <path d="M2.5 12a9.5 9.5 0 0 1 15.6-7.2l-3.2 4.5a4.5 4.5 0 0 0-4.9 6.7l-4.2 3.1A9.46 9.46 0 0 1 2.5 12z" fill="#F89939" />
        <path d="M21.5 12a9.5 9.5 0 0 1-15.6 7.2l3.2-4.5a4.5 4.5 0 0 0 4.9-6.7l4.2-3.1A9.46 9.46 0 0 1 21.5 12z" fill="#3499CD" />
        <circle cx="12" cy="12" r="3" fill="#2C5282" />
      </svg>
    );
  }

  // 5. OpenCV
  if (normalized.includes("opencv")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="OpenCV">
        <circle cx="12" cy="6.8" r="4.2" stroke="#E23838" strokeWidth="2.8" />
        <circle cx="6.8" cy="16" r="4.2" stroke="#59B347" strokeWidth="2.8" />
        <circle cx="17.2" cy="16" r="4.2" stroke="#2D72D9" strokeWidth="2.8" />
      </svg>
    );
  }

  // 6. NumPy
  if (normalized.includes("numpy")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="NumPy">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#013243" />
        <path d="M6 18V6h3l6 8.5V6h3v12h-3l-6-8.5V18H6z" fill="#4DABCF" />
        <circle cx="15.5" cy="8.5" r="1.2" fill="#FFD43B" />
      </svg>
    );
  }

  // 7. Pandas
  if (normalized.includes("pandas")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Pandas">
        <rect x="3" y="10" width="3.5" height="10" rx="1.5" fill="#150458" />
        <rect x="8" y="4" width="3.5" height="16" rx="1.5" fill="#FF4D4D" />
        <rect x="13" y="8" width="3.5" height="12" rx="1.5" fill="#E70488" />
        <rect x="18" y="6" width="3.5" height="14" rx="1.5" fill="#00A9E0" />
      </svg>
    );
  }

  // 8. Java
  if (normalized === "java") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Java">
        <path d="M8.8 17.6s-.9.5 0 .8c1.3.4 3.7.4 5.3 0 .9-.3 0-.8 0-.8-2.5.4-5.3 0-5.3 0z" fill="#5382A1" />
        <path d="M8 15.3s-1.2.7 0 1.1c2 .6 5.3.6 7.6 0 1.2-.4 0-1.1 0-1.1-3.6.5-7.6 0-7.6 0z" fill="#5382A1" />
        <path d="M12.5 10.7c1 .9 2.2 1.8 2.2 3.1 0 1.6-1.5 2.5-3.3 2.5-1.9 0-3-.9-3-2.1 0-.9.6-1.8 1.7-2.6 1.1-.8 1.4-1.2 1.4-2.1 0-1.2-.9-2.2-2.1-2.2-.4 0-.8.1-1.1.3 1.1-.7 2.4-.7 3.3-.2.8.5 1.3 1.3 1.3 2.2 0 1-.5 1.6-1.4 2.3z" fill="#E76F00" />
        <path d="M16.3 12.8c.8.9 1.4 1.9 1.4 2.9 0 1.9-1.9 3.2-4.9 3.2-3.1 0-5.1-1.3-5.1-3.3 0-1.2.8-2.3 2.2-3.2-1.8 1-2.4 2.2-2.4 3.3 0 2.2 2.3 3.6 5.5 3.6 3.1 0 5.1-1.4 5.1-3.5 0-1.1-.6-2.1-1.8-3z" fill="#5382A1" />
        <path d="M14.6 4.5c.6.9.7 1.8.5 2.7-.2.9-.8 1.6-1.6 2.3 1-.5 1.7-1.2 2-2 .3-.8.2-1.7-.4-2.5-.2-.2-.4-.3-.5-.5z" fill="#E76F00" />
      </svg>
    );
  }

  // 9. TypeScript
  if (normalized.includes("typescript")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="TypeScript">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M11.5 10.8V8.5H4.2v2.3h2.3v7.4h2.7v-7.4h2.3zm8.3 1.9c-.3-.5-.7-.9-1.3-1.2-.6-.3-1.4-.6-2.4-.9-.7-.2-1.2-.5-1.5-.7-.3-.2-.4-.5-.4-.9 0-.4.2-.8.5-1 .3-.3.8-.4 1.4-.4.6 0 1.1.1 1.5.4.4.3.7.7.8 1.2h2.5c-.1-.9-.6-1.8-1.4-2.4-.8-.6-1.9-.9-3.4-.9-1.4 0-2.6.4-3.4 1.1-.8.7-1.2 1.7-1.2 2.8 0 .8.3 1.5.8 2 .5.6 1.4 1 2.5 1.4.9.3 1.5.6 1.8.9.3.3.4.6.4 1 0 .5-.2.9-.6 1.2-.4.3-1 .5-1.7.5-.8 0-1.4-.2-1.9-.6-.5-.4-.7-1-.8-1.7h-2.5c.1 1.2.6 2.2 1.5 2.9.9.7 2.1 1.1 3.7 1.1 1.6 0 2.9-.4 3.8-1.1.9-.7 1.4-1.8 1.4-3.1 0-.9-.3-1.6-.9-2.2z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 10. C Language
  if (normalized === "c") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="C Language">
        <polygon points="12,1.5 22,7.2 22,18.8 12,24.5 2,18.8 2,7.2" fill="#00599C" stroke="#659AD2" strokeWidth="1.2" />
        <path d="M14.8 8.6c-.8-.6-1.8-.9-2.8-.9-2.6 0-4.5 1.9-4.5 4.5s1.9 4.5 4.5 4.5c1 .0 2-.3 2.8-.9l1.4 2.2c-1.2.8-2.6 1.2-4.2 1.2-4 0-7.2-3.1-7.2-7s3.2-7 7.2-7c1.6 0 3 .4 4.2 1.2l-1.4 2.2z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 11. SQL
  if (normalized.includes("sql")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="SQL Database">
        <ellipse cx="12" cy="5" rx="8" ry="3" fill="#336791" stroke="#4DABCF" strokeWidth="1.5" />
        <path d="M4 5v5c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="#4DABCF" strokeWidth="1.5" fill="none" />
        <path d="M4 10v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5" stroke="#4DABCF" strokeWidth="1.5" fill="none" />
        <path d="M4 15v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" stroke="#4DABCF" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  // 12. Git
  if (normalized === "git") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Git">
        <path
          d="M23.546 10.93L13.067.452a1.505 1.505 0 0 0-2.128 0L8.881 2.51l3.056 3.057a1.786 1.786 0 0 1 2.261 2.278l3.11 3.11a1.776 1.776 0 1 1-1.077 1.052l-2.887-2.887a1.784 1.784 0 0 1-2.028-.316 1.78 1.78 0 0 1-.32-2.013L7.962 3.753l-7.51 7.51a1.505 1.505 0 0 0 0 2.128l10.48 10.478a1.504 1.504 0 0 0 2.127 0l10.487-10.48a1.504 1.504 0 0 0 0-2.459"
          fill="#F05032"
        />
      </svg>
    );
  }

  // 13. GitHub
  if (normalized.includes("github")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="GitHub">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 14. Docker
  if (normalized.includes("docker")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Docker">
        <path
          d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.186.185.186m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H5.136a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H2.208a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m21.75 1.57a.978.978 0 0 0-.583-.414c-.655-.164-1.898-.106-2.98.665-.333-.238-.813-.414-1.394-.492-.857-.116-1.782.023-2.585.503-.385-.246-.867-.406-1.428-.48a7.84 7.84 0 0 0-2.316.037H.725A.725.725 0 0 0 0 13.916c0 1.258.337 2.479.97 3.535 1.517 2.528 4.208 4.093 7.195 4.186 6.822.213 12.015-4.18 13.784-7.986.721-.05 1.436-.264 2.01-.735.088-.072.164-.15.228-.235a.725.725 0 0 0-.23-.974"
          fill="#2496ED"
        />
      </svg>
    );
  }

  // 15. Jenkins
  if (normalized.includes("jenkins")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Jenkins">
        <circle cx="12" cy="10" r="6" fill="#FDE047" stroke="#D97706" strokeWidth="1.2" />
        <path d="M9 11.5c1 .5 2 0 3-.5 1 .5 2 1 3 .5-1 1.5-2 1.5-3 1s-2 .5-3-1z" fill="#451A03" />
        <circle cx="9.5" cy="8.5" r="0.8" fill="#1E293B" />
        <circle cx="14.5" cy="8.5" r="0.8" fill="#1E293B" />
        <path d="M9 17l3 1.5 3-1.5-1 3-2-1-2 1z" fill="#D24939" />
        <circle cx="12" cy="18" r="1" fill="#FFFFFF" />
      </svg>
    );
  }

  // 16. Maven
  if (normalized.includes("maven")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Apache Maven">
        <rect width="24" height="24" rx="4" fill="#18181B" />
        <path d="M5 19C7 15 11 7 19 4C18 9 14 15 9 18L5 19Z" fill="#C71A36" />
        <path d="M7 17C10 13 13 8 18 5.5" stroke="#FBBF24" strokeWidth="1.2" />
        <text x="6" y="19" fill="#3B82F6" fontWeight="900" fontSize="10" fontFamily="sans-serif">M</text>
      </svg>
    );
  }

  // 17. REST APIs
  if (normalized.includes("rest") && normalized.includes("api")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="REST APIs">
        <rect x="2" y="5" width="20" height="14" rx="4" fill="#004D40" stroke="#009688" strokeWidth="1.5" />
        <path d="M6 12h4m4 0h4M12 9v6" stroke="#4DB6AC" strokeWidth="2" strokeLinecap="round" />
        <circle cx="6" cy="12" r="1.5" fill="#80CBC4" />
        <circle cx="18" cy="12" r="1.5" fill="#80CBC4" />
        <circle cx="12" cy="9" r="1" fill="#80CBC4" />
        <circle cx="12" cy="15" r="1" fill="#80CBC4" />
      </svg>
    );
  }

  // 18. OOP
  if (normalized === "oop") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Object-Oriented Programming">
        <rect x="3" y="3" width="7" height="7" rx="2" fill="#6366F1" stroke="#818CF8" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="2" fill="#8B5CF6" stroke="#A78BFA" strokeWidth="1.5" />
        <rect x="8.5" y="14" width="7" height="7" rx="2" fill="#EC4899" stroke="#F472B6" strokeWidth="1.5" />
        <path d="M6.5 10v2a2 2 0 0 0 2 2h3.5m5.5-4v2a2 2 0 0 1-2 2h-3.5" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    );
  }

  // 19. Agile & SDLC
  if (normalized.includes("agile") || normalized.includes("sdlc")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Agile & SDLC">
        <path d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3z" fill="#10B981" />
        <path d="M12 21a9 9 0 0 1-9-9h3a6 6 0 0 0 6 6v3z" fill="#06B6D4" />
        <polygon points="21,7 24,12 18,12" fill="#10B981" />
        <polygon points="3,17 0,12 6,12" fill="#06B6D4" />
      </svg>
    );
  }

  // 20. Computer Vision
  if (normalized.includes("computer vision")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Computer Vision">
        <path d="M3 7V3h4M21 7V3h-4M3 17v4h4M21 17v4h-4" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" stroke="#10B981" strokeWidth="1.5" fill="#10B981" fillOpacity="0.15" />
        <circle cx="12" cy="12" r="3" fill="#06B6D4" />
        <circle cx="12" cy="12" r="1.2" fill="#FFFFFF" />
      </svg>
    );
  }

  // 21. Deep Learning
  if (normalized.includes("deep learning")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Deep Learning">
        <line x1="5" y1="7" x2="12" y2="5" stroke="#A855F7" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="5" y1="7" x2="12" y2="12" stroke="#A855F7" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="5" y1="7" x2="12" y2="19" stroke="#A855F7" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="5" y1="17" x2="12" y2="5" stroke="#A855F7" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="5" y1="17" x2="12" y2="12" stroke="#A855F7" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="5" y1="17" x2="12" y2="19" stroke="#A855F7" strokeWidth="1.2" strokeOpacity="0.7" />
        <line x1="12" y1="5" x2="19" y2="9" stroke="#C084FC" strokeWidth="1.2" strokeOpacity="0.8" />
        <line x1="12" y1="5" x2="19" y2="15" stroke="#C084FC" strokeWidth="1.2" strokeOpacity="0.8" />
        <line x1="12" y1="12" x2="19" y2="9" stroke="#C084FC" strokeWidth="1.2" strokeOpacity="0.8" />
        <line x1="12" y1="12" x2="19" y2="15" stroke="#C084FC" strokeWidth="1.2" strokeOpacity="0.8" />
        <line x1="12" y1="19" x2="19" y2="9" stroke="#C084FC" strokeWidth="1.2" strokeOpacity="0.8" />
        <line x1="12" y1="19" x2="19" y2="15" stroke="#C084FC" strokeWidth="1.2" strokeOpacity="0.8" />
        <circle cx="5" cy="7" r="2.2" fill="#E879F9" />
        <circle cx="5" cy="17" r="2.2" fill="#E879F9" />
        <circle cx="12" cy="5" r="2.2" fill="#A855F7" />
        <circle cx="12" cy="12" r="2.2" fill="#A855F7" />
        <circle cx="12" cy="19" r="2.2" fill="#A855F7" />
        <circle cx="19" cy="9" r="2.5" fill="#38BDF8" />
        <circle cx="19" cy="15" r="2.5" fill="#38BDF8" />
      </svg>
    );
  }

  // 22. Machine Learning
  if (normalized.includes("machine learning")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Machine Learning">
        <rect x="5" y="5" width="14" height="14" rx="3" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z" fill="#2563EB" fillOpacity="0.4" stroke="#60A5FA" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="1.5" fill="#67E8F9" />
      </svg>
    );
  }

  // 23. AI-Assisted Coding
  if (normalized.includes("ai-assisted") || normalized.includes("coding")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="AI-Assisted Coding">
        <path d="M7 8l-4 4 4 4m10-8l4 4-4 4" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#FBBF24" />
        <path d="M17 14l.7 1.3 1.3.7-1.3.7-.7 1.3-.7-1.3-1.3-.7 1.3-.7.7-1.3z" fill="#F472B6" />
      </svg>
    );
  }

  // 24. NLTK
  if (normalized.includes("nltk")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="NLTK">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#38BDF8" strokeWidth="1.5" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1.5" />
        <text x="6" y="14" fill="#38BDF8" fontWeight="bold" fontSize="6.5" fontFamily="monospace">&lt;NLP&gt;</text>
      </svg>
    );
  }

  // 25. gTTS
  if (normalized.includes("gtts")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="gTTS">
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="#4285F4" />
        <path d="M15 9a4 4 0 0 1 0 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 6.5a7.5 7.5 0 0 1 0 11" stroke="#FBBC05" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 4a11 11 0 0 1 0 16" stroke="#34A853" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 26. Selenium
  if (normalized.includes("selenium")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Selenium WebDriver">
        <rect width="24" height="24" rx="4" fill="#43B02A" />
        <text x="3" y="17" fill="#FFFFFF" fontWeight="900" fontSize="13" fontFamily="sans-serif">Se</text>
        <circle cx="19" cy="6" r="2.5" fill="#C1E7B4" />
      </svg>
    );
  }

  // 27. Playwright
  if (normalized.includes("playwright")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Playwright">
        <circle cx="8.5" cy="11.5" r="6" fill="#2EAD33" />
        <circle cx="15.5" cy="12.5" r="6" fill="#E23237" fillOpacity="0.88" />
        <circle cx="6.5" cy="10" r="1.2" fill="#FFFFFF" />
        <circle cx="10.5" cy="10" r="1.2" fill="#FFFFFF" />
        <path d="M7 13.5q1.5 1.5 3 0" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="13.5" cy="11" r="1.2" fill="#FFFFFF" />
        <circle cx="17.5" cy="11" r="1.2" fill="#FFFFFF" />
        <path d="M14 14.5q1.5 1.5 3 0" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 28. TestNG
  if (normalized.includes("testng")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="TestNG">
        <rect width="24" height="24" rx="4" fill="#CB3837" />
        <text x="3.5" y="14" fill="#FFFFFF" fontWeight="900" fontSize="8" fontFamily="sans-serif">Test</text>
        <text x="13.5" y="20" fill="#FBBF24" fontWeight="900" fontSize="9" fontFamily="sans-serif">NG</text>
      </svg>
    );
  }

  // 29. PyTest
  if (normalized.includes("pytest")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="PyTest">
        <path d="M9 3h6v3l3 7v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6l3-7V3z" fill="#0A9EDC" stroke="#0284C7" strokeWidth="1.2" />
        <path d="M8 14h8v5a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-5z" fill="#00B050" />
        <path d="M10 16.5l1.5 1.5 3-3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 30. REST Assured
  if (normalized.includes("rest assured")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="REST Assured">
        <path d="M12 2L4 5v6.5C4 16.8 7.4 21.6 12 23c4.6-1.4 8-6.2 8-11.5V5l-8-3z" fill="#1B5E20" stroke="#4CAF50" strokeWidth="1.2" />
        <path d="M8.5 12l2.5 2.5 5-5" stroke="#A5D6A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 31. ISTQB
  if (normalized.includes("istqb")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="ISTQB Fundamentals">
        <polygon points="12,1.5 22,5.5 22,12.5 12,22.5 2,12.5 2,5.5" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="1.5" />
        <text x="3" y="13.5" fill="#F59E0B" fontWeight="900" fontSize="6.5" fontFamily="sans-serif">ISTQB</text>
      </svg>
    );
  }

  // 32. Next.js
  if (normalized.includes("next")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Next.js">
        <circle cx="12" cy="12" r="10.5" fill="#000000" stroke="#FFFFFF" strokeWidth="1.2" />
        <path d="M8 7.5v9h2.3v-4.8l5.9 4.8H18v-9h-2.3v4.8L9.8 7.5H8z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 33. React
  if (normalized.includes("react")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="React">
        <ellipse cx="12" cy="12" rx="3.5" ry="9.5" stroke="#61DAFB" strokeWidth="1.4" />
        <ellipse cx="12" cy="12" rx="3.5" ry="9.5" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="3.5" ry="9.5" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
      </svg>
    );
  }

  // 34. Tailwind CSS
  if (normalized.includes("tailwind")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Tailwind CSS">
        <path
          d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
          fill="#06B6D4"
        />
      </svg>
    );
  }

  // 35. Three.js
  if (normalized.includes("three")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Three.js">
        <path d="M12 2l9 5.2v10.4L12 23 3 17.6V7.2L12 2z" stroke="#FFFFFF" strokeWidth="1.5" fill="#18181B" />
        <path d="M12 2v21M3 7.2l9 5.2 9-5.2" stroke="#FFFFFF" strokeWidth="1.2" />
      </svg>
    );
  }

  // 36. Drei
  if (normalized.includes("drei")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="React Three Drei">
        <polygon points="12,2 22,7.5 22,17 12,22.5 2,17 2,7.5" fill="#EF4444" fillOpacity="0.2" stroke="#F43F5E" strokeWidth="1.5" />
        <line x1="12" y1="2" x2="12" y2="22.5" stroke="#F43F5E" strokeWidth="1.2" />
        <line x1="2" y1="7.5" x2="12" y2="12" stroke="#F43F5E" strokeWidth="1.2" />
        <line x1="22" y1="7.5" x2="12" y2="12" stroke="#F43F5E" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // 37. GSAP
  if (normalized.includes("gsap")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="GSAP">
        <rect width="24" height="24" rx="4" fill="#0D1117" />
        <path d="M4 14c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6s-2.7 6-6 6H9" stroke="#88CE02" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="14" r="2.5" fill="#88CE02" />
      </svg>
    );
  }

  // 38. YOLO
  if (normalized.includes("yolo")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="YOLO">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#0F172A" stroke="#06B6D4" strokeWidth="1.2" />
        <path d="M5 8V5h3m8 0h3v3M5 16v3h3m8 0h3v-3" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
        <text x="12" y="15" fill="#38BDF8" fontWeight="900" fontSize="7" fontFamily="sans-serif" textAnchor="middle">YOLO</text>
      </svg>
    );
  }

  // 39. Medical Image Processing
  if (normalized.includes("medical")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Medical Image Processing">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#0C4A6E" stroke="#0284C7" strokeWidth="1.2" />
        <path d="M12 7v10M7 12h10" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="#4ADE80" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />
      </svg>
    );
  }

  // 40. Node.js
  if (normalized.includes("node")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Node.js">
        <polygon points="12,1.5 22,7.2 22,18.8 12,24.5 2,18.8 2,7.2" fill="#339933" />
        <path d="M12 5.5l7 4v7l-7 4-7-4v-7l7-4z" fill="#026E00" />
        <path d="M12 9v6m-3-4.5l6 3" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  // 41. Full-Stack
  if (normalized.includes("full-stack") || normalized.includes("fullstack")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Full-Stack">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#3B82F6" stroke="#60A5FA" strokeWidth="1" />
        <path d="M2 12l10 5 10-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 17l10 5 10-5" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 42. Enterprise Systems
  if (normalized.includes("enterprise")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Enterprise Systems">
        <rect x="3" y="6" width="11" height="16" rx="1.5" fill="#1E293B" stroke="#64748B" strokeWidth="1.2" />
        <rect x="14" y="2" width="7" height="20" rx="1.5" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
        <rect x="6" y="9" width="2" height="2" fill="#94A3B8" />
        <rect x="10" y="9" width="2" height="2" fill="#94A3B8" />
        <rect x="6" y="13" width="2" height="2" fill="#94A3B8" />
        <rect x="10" y="13" width="2" height="2" fill="#94A3B8" />
        <rect x="16.5" y="5" width="2" height="2" fill="#38BDF8" />
        <rect x="16.5" y="9" width="2" height="2" fill="#38BDF8" />
        <rect x="16.5" y="13" width="2" height="2" fill="#38BDF8" />
      </svg>
    );
  }

  // 43. LMS Architecture
  if (normalized.includes("lms")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="LMS Architecture">
        <path d="M12 3L1 9l11 6 9-4.9V17h2V9L12 3z" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
        <path d="M5 13.5v5c0 2.5 3.1 4.5 7 4.5s7-2 7-4.5v-5" stroke="#38BDF8" strokeWidth="1.5" />
      </svg>
    );
  }

  // 44. Proctoring Workflows
  if (normalized.includes("proctoring")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Proctoring Workflows">
        <path d="M12 2L4 5v6.5C4 16.8 7.4 21.6 12 23c4.6-1.4 8-6.2 8-11.5V5l-8-3z" fill="#1E293B" stroke="#10B981" strokeWidth="1.2" />
        <circle cx="12" cy="11" r="3" fill="#10B981" fillOpacity="0.4" stroke="#10B981" strokeWidth="1.2" />
        <circle cx="12" cy="11" r="1.2" fill="#FFFFFF" />
      </svg>
    );
  }

  // 45. Security & RBAC
  if (normalized.includes("security") || normalized.includes("rbac")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Security & RBAC">
        <rect x="5" y="10" width="14" height="11" rx="2.5" fill="#B45309" stroke="#F59E0B" strokeWidth="1.2" />
        <path d="M8 10V6.5a4 4 0 0 1 8 0V10" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.5" fill="#FFFFFF" />
        <path d="M12 16.5v2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 46. NLP
  if (normalized.includes("nlp")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="NLP">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#38BDF8" strokeWidth="1.5" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1.5" />
        <text x="6" y="14" fill="#38BDF8" fontWeight="bold" fontSize="6.5" fontFamily="monospace">&lt;NLP&gt;</text>
      </svg>
    );
  }

  // 47. Multilingual Audio
  if (normalized.includes("audio") || normalized.includes("multilingual")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Multilingual Audio">
        <circle cx="12" cy="12" r="10" fill="#065F46" stroke="#10B981" strokeWidth="1.2" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#34D399" strokeWidth="1.2" fill="none" />
        <path d="M9 9l3 3-3 3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 48. Accessibility
  if (normalized.includes("accessibility")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Accessibility">
        <circle cx="12" cy="12" r="10" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="1.2" />
        <circle cx="12" cy="7" r="1.8" fill="#FFFFFF" />
        <path d="M6 10h12M12 10v6l-2.5 4M12 16l2.5 4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 49. Cloud Architecture
  if (normalized.includes("cloud")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Cloud Architecture">
        <path d="M6.5 19a4.5 4.5 0 0 1-.5-8.97A7 7 0 0 1 19.5 13 4.5 4.5 0 0 1 18 21H6.5z" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.2" />
      </svg>
    );
  }

  // 50. CI/CD
  if (normalized.includes("ci/cd") || normalized.includes("cicd")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="CI/CD">
        <path d="M12 3a9 9 0 0 1 9 9h-3a6 6 0 0 0-6-6V3z" fill="#06B6D4" />
        <path d="M12 21a9 9 0 0 1-9-9h3a6 6 0 0 0 6 6v3z" fill="#10B981" />
        <polygon points="21,7 24,12 18,12" fill="#06B6D4" />
        <polygon points="3,17 0,12 6,12" fill="#10B981" />
      </svg>
    );
  }

  // 51. Automation Testing
  if (normalized.includes("automation")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Automation Testing">
        <rect width="24" height="24" rx="4" fill="#15803D" />
        <path d="M7 12l3.5 3.5 7-7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 52. JDBC / Relational Database
  if (normalized.includes("jdbc") || normalized.includes("relational")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" role="img" aria-label="Database Connector">
        <ellipse cx="12" cy="5" rx="8" ry="3" fill="#336791" stroke="#4DABCF" strokeWidth="1.5" />
        <path d="M4 5v5c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="#4DABCF" strokeWidth="1.5" fill="none" />
        <path d="M4 10v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5" stroke="#4DABCF" strokeWidth="1.5" fill="none" />
        <path d="M4 15v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" stroke="#4DABCF" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  // Default fallback code icon
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
