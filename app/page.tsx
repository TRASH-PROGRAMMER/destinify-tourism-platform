import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { DestinationsSection } from "@/components/destinations-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { VideoSection } from "@/components/video-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DestinationsSection />
      <HowItWorksSection />
      <VideoSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
