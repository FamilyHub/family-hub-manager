export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  secondaryCtaText?: string;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  animationDelay?: number;
}

export interface BackgroundAnimationProps {
  color?: string;
  density?: number;
  speed?: number;
}
