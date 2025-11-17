import EverlastNavigation from '@/components/navigation/EverlastNavigation';
import { 
  HeroSection, 
  VideoSubmissionSection, 
  FeaturesSection, 
  StatsSection, 
  FinalCtaSection, 
  Footer 
} from './home/components';

export default function HomePage() {
  return (
    <>
      <EverlastNavigation />
      <HeroSection />
      <VideoSubmissionSection />
      <FeaturesSection />
      <StatsSection />
      <FinalCtaSection />
      <Footer />
    </>
  );
}