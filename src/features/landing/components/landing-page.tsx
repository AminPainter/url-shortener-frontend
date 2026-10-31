import { PlansTeaser } from '@/features/subscription/components/plans-teaser'
import { FeatureBento } from './feature-bento'
import { LandingHero } from './landing-hero'

export function LandingPage() {
  return (
    <>
      <LandingHero />
      <FeatureBento />
      <PlansTeaser />
    </>
  )
}
