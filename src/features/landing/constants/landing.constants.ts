import { 
  WalletIcon, 
  CalendarIcon, 
  PhotoIcon, 
  HeartIcon,
  VideoCameraIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export const HERO_SECTION = {
  DEFAULT_TITLE: 'Empower Your Family Life',
  DEFAULT_SUBTITLE: 'Stay connected, organized, and in control with Family-Hub!',
  CTA_TEXT: 'Get Started',
  SECONDARY_CTA_TEXT: 'Login',
};

export const FEATURES = [
  {
    title: 'Expense Tracker',
    description: 'Stay on top of your family\'s spending. Set budgets, track expenses, and gain financial insights effortlessly.',
    icon: WalletIcon,
    features: [
      'Real-time expense tracking',
      'Categorized spending reports',
      'Monthly budget reminders'
    ]
  },
  {
    title: 'Smart Family Calendar',
    description: 'Never miss a special moment or important event! Sync schedules, set reminders, and coordinate effortlessly.',
    icon: CalendarIcon,
    features: [
      'Shared family calendar',
      'Automated reminders',
      'Birthday & event notifications'
    ]
  },
  {
    title: 'Memory Vault',
    description: 'Cherish and relive your best family moments. Securely store photos, videos, and personal notes.',
    icon: PhotoIcon,
    features: [
      'Private family photo gallery',
      'AI-powered memory organization',
      'Secure cloud backup'
    ]
  },
  {
    title: 'Family Wellness Tracker',
    description: 'Monitor health habits and encourage well-being. Set fitness goals, track daily habits, and stay healthy together.',
    icon: HeartIcon,
    features: [
      'Daily activity tracking',
      'Health & wellness reminders',
      'Personalized fitness insights'
    ]
  },
  {
    title: 'Stay Connected Instantly',
    description: 'Video Call & Chat with Family Anytime! Strengthen bonds no matter the distance.',
    icon: VideoCameraIcon,
    features: [
      'High-quality video calls',
      'Secure family chat rooms',
      'AI-powered conversation summaries'
    ]
  },
  {
    title: 'AI-Powered Learning Hub',
    description: 'Access 100+ AI tools for learning & growth. Enhance your skills with cutting-edge AI-powered tools.',
    icon: SparklesIcon,
    features: [
      'AI-based study resources',
      'Personalized recommendations',
      'Productivity boosters'
    ]
  }
];

export const ANIMATION_CONFIG = {
  BACKGROUND: {
    DEFAULT_COLOR: '#8B5CF6',
    PARTICLE_DENSITY: 50,
    ANIMATION_SPEED: 1,
  },
  MODEL: {
    ROTATION_SPEED: 0.5,
    CAMERA_POSITION: [0, 0, 15],
    FOV: 45,
  },
};
