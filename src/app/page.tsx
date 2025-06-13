import EndCTA from '@/components/layout/landing/end-cta';
import Feature from '@/components/layout/landing/feature';
import Footer from '@/components/layout/landing/footer';
import Header from '@/components/layout/landing/header';
import Hero from '@/components/layout/landing/hero';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Separator />
      <Feature />
      <EndCTA />
      <Footer />
    </>
  );
}
