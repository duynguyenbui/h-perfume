import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import WearYourStory from '@/components/WearYourStory'
import PortfolioGrid from '@/components/PortfolioGrid'
import FeatureCarousel from '@/components/FeatureCarousel'
import Marquee from '@/components/Marquee'

export default function Page() {
  return (
    <>
      <Hero />
      <WearYourStory />
      <FeatureCarousel />
      <PortfolioGrid />
      <Marquee />
      <Footer />
    </>
  )
}
