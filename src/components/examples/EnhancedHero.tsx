'use client'

import { ArrowRight, Play, Sparkles } from 'lucide-react'
import {
  BlobAnimation,
  GradientBackground,
  GradientButton,
  GradientText,
  GridPattern,
} from '@/components/effects'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

/**
 * EnhancedHero - Example of integrating visual effects into a real component
 * Shows how to use the effects system to create engaging hero sections
 */
export function EnhancedHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <GradientBackground variant="astral" intensity="subtle" direction="radial" />

      {/* Subtle Grid Pattern */}
      <GridPattern variant="dots" size="lg" intensity="subtle" className="opacity-40" />

      {/* Animated Blobs */}
      <BlobAnimation
        variant="primary"
        size="xl"
        className="top-10 -left-32 animate-float"
        speed="slow"
        intensity="subtle"
      />
      <BlobAnimation
        variant="secondary"
        size="lg"
        className="bottom-20 -right-20 animate-float"
        speed="medium"
        intensity="subtle"
        style={{ animationDelay: '2s' }}
      />
      <BlobAnimation
        variant="accent"
        size="md"
        className="top-1/3 right-1/4 animate-float"
        speed="fast"
        intensity="subtle"
        style={{ animationDelay: '4s' }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 glass-card px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Learning Platform
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <GradientText variant="brand" size="3xl" animate>
              Predict Training Success
            </GradientText>
            <br />
            <span className="text-foreground">Before It Begins</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            SenseiiWyze uses our proprietary{' '}
            <GradientText variant="neural" size="xl">
              Readiness Index
            </GradientText>{' '}
            to predict learning outcomes with 87% accuracy, delivering{' '}
            <GradientText variant="warmth" size="xl">
              2-3x faster skill acquisition
            </GradientText>{' '}
            for your team.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <GradientButton variant="brand" size="xl" animated glow className="group">
              Start Free Assessment
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </GradientButton>

            <Button variant="outline" size="lg" className="glass-card group">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="outline" className="glass-card px-4 py-2">
              87% Prediction Accuracy
            </Badge>
            <Badge variant="outline" className="glass-card px-4 py-2">
              2-3x Faster Learning
            </Badge>
            <Badge variant="outline" className="glass-card px-4 py-2">
              40% Better Pass Rates
            </Badge>
            <Badge variant="outline" className="glass-card px-4 py-2">
              24/7 AI Coaching
            </Badge>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { value: '87%', label: 'Success Prediction Accuracy', gradient: 'brand' },
            { value: '2-3x', label: 'Faster Skill Acquisition', gradient: 'neural' },
            { value: '40%', label: 'Better Certification Rates', gradient: 'warmth' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg glass-card hover:shadow-glow-primary transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <GradientText variant={stat.gradient as any} size="2xl">
                  {stat.value}
                </GradientText>
              </div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
