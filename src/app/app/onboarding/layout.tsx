import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Started - SenseiiWyze',
  description: 'Set up your organization with SenseiiWyze AI-powered learning platform',
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
