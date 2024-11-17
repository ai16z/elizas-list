import { 
  SiJavascript, SiTypescript, SiPython, SiRust, SiGo, SiSolidity,
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiSvelte,
  SiDocker, SiKubernetes, SiAws, SiTensorflow, SiEthereum,
  SiOpenai, SiPostgresql, SiMongodb, SiRedis, SiGraphql
} from 'react-icons/si';
import { 
  FaRobot, FaDatabase, FaBrain, FaMobile, FaCloud, FaLock,
  FaTools, FaCode, FaGamepad, FaGlobe, FaPalette, FaMicrochip
} from 'react-icons/fa';

// Keep existing PROJECT_TAGS structure for compatibility
export const PROJECT_TAGS = {
  LANGUAGES: [
    'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Solidity',
    'C++', 'Java', 'Kotlin', 'Swift', 'PHP', 'Ruby'
  ],
  FRAMEWORKS: [
    'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Express',
    'Django', 'Flask', 'Spring Boot', 'Laravel'
  ],
  WEB3: [
    'Ethereum', 'Solana', 'DeFi', 'NFT', 'Smart Contracts', 'Web3',
    'Cryptocurrency', 'Blockchain', 'DEX', 'DAO'
  ],
  AI_ML: [
    'AI', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    'Neural Networks', 'LLM', 'GPT', 'Stable Diffusion', 'MLOps'
  ],
  TOOLS: [
    'CLI', 'VSCode Extension', 'Chrome Extension', 'SDK', 'API',
    'Database', 'ORM', 'Testing', 'Analytics', 'Monitoring'
  ]
};

// Optional metadata for enhanced features
export const TAG_METADATA = {
  'JavaScript': { icon: SiJavascript, color: '#F7DF1E' },
  'TypeScript': { icon: SiTypescript, color: '#3178C6' },
  'Python': { icon: SiPython, color: '#3776AB' },
  'React': { icon: SiReact, color: '#61DAFB' },
  'Next.js': { icon: SiNextdotjs, color: '#000000' },
  'AI': { icon: FaBrain, color: '#FF6B6B' },
  'Machine Learning': { icon: FaRobot, color: '#FF6B6B' }
};

export const getTagCategory = (tag: string): string | null => {
  for (const [category, tags] of Object.entries(PROJECT_TAGS)) {
    if (tags.includes(tag)) {
      return category;
    }
  }
  return null;
};

export const getAllTags = () => {
  return Object.values(PROJECT_TAGS).flat();
}; 