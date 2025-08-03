'use client'

import { useState } from 'react'
import {
  BlobAnimation,
  GradientBackground,
  GradientButton,
  GradientText,
  GridPattern,
} from '@/components/effects'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * EffectsDemo component showcases all the visual effects
 * This can be used for testing and as a reference for developers
 */
export function EffectsDemo() {
  const [activeBackground, setActiveBackground] = useState<string>('none')

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      {activeBackground === 'astral' && (
        <GradientBackground variant="astral" intensity="subtle" direction="radial" />
      )}
      {activeBackground === 'cosmic' && (
        <GradientBackground variant="cosmic" intensity="medium" direction="radial" />
      )}
      {activeBackground === 'aurora' && (
        <GradientBackground variant="aurora" intensity="subtle" direction="radial" />
      )}
      {activeBackground === 'mesh' && (
        <GradientBackground variant="mesh" intensity="subtle" direction="radial" />
      )}

      {/* Grid Pattern Overlay */}
      {activeBackground !== 'none' && (
        <GridPattern variant="dots" size="md" intensity="subtle" className="opacity-30" />
      )}

      {/* Floating Blobs */}
      <BlobAnimation
        variant="primary"
        size="lg"
        className="top-20 left-20 animate-float"
        speed="slow"
      />
      <BlobAnimation
        variant="secondary"
        size="md"
        className="bottom-20 right-20 animate-float"
        speed="medium"
        style={{ animationDelay: '1s' }}
      />
      <BlobAnimation
        variant="accent"
        size="sm"
        className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        speed="fast"
        style={{ animationDelay: '2s' }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <GradientText variant="brand" size="3xl" animate className="mb-4">
            SenseiiWyze Visual Effects
          </GradientText>
          <GradientText variant="subtle" size="lg" className="mb-8">
            Sophisticated visual enhancements for modern web applications
          </GradientText>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <GradientButton
              variant="brand"
              size="lg"
              animated
              glow
              onClick={() => setActiveBackground('astral')}
            >
              Astral Theme
            </GradientButton>
            <GradientButton
              variant="vibrant"
              size="lg"
              animated
              onClick={() => setActiveBackground('cosmic')}
            >
              Cosmic Theme
            </GradientButton>
            <GradientButton
              variant="warmth"
              size="lg"
              animated
              onClick={() => setActiveBackground('aurora')}
            >
              Aurora Theme
            </GradientButton>
            <GradientButton
              variant="glass"
              size="lg"
              animated
              onClick={() => setActiveBackground('mesh')}
            >
              Mesh Theme
            </GradientButton>
            <Button variant="outline" size="lg" onClick={() => setActiveBackground('none')}>
              Clear
            </Button>
          </div>
        </div>

        <Tabs defaultValue="components" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="utilities">Utilities</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>
                  <GradientText variant="neural">Gradient Components</GradientText>
                </CardTitle>
                <CardDescription>
                  Text and button components with sophisticated gradient effects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Gradient Text Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <GradientText variant="brand" size="xl">
                        Brand Gradient
                      </GradientText>
                      <GradientText variant="vibrant" size="xl">
                        Vibrant Gradient
                      </GradientText>
                      <GradientText variant="neural" size="xl">
                        Neural Gradient
                      </GradientText>
                      <GradientText variant="warmth" size="xl">
                        Warmth Gradient
                      </GradientText>
                      <GradientText variant="rainbow" size="xl" animate>
                        Rainbow Animated
                      </GradientText>
                    </div>
                    <div className="space-y-2">
                      <GradientText variant="subtle" size="lg">
                        Subtle variant for body text
                      </GradientText>
                      <GradientText variant="brand" size="2xl">
                        Large headings
                      </GradientText>
                      <GradientText variant="vibrant" size="sm">
                        Small accents
                      </GradientText>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Gradient Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <GradientButton variant="brand" animated glow>
                      Brand Button
                    </GradientButton>
                    <GradientButton variant="vibrant" animated>
                      Vibrant Button
                    </GradientButton>
                    <GradientButton variant="neural" size="lg">
                      Neural Button
                    </GradientButton>
                    <GradientButton variant="warmth" size="sm">
                      Warmth Small
                    </GradientButton>
                    <GradientButton variant="glass" animated>
                      Glass Morphism
                    </GradientButton>
                    <GradientButton variant="subtle">Subtle Style</GradientButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backgrounds" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>
                  <GradientText variant="neural">Background Effects</GradientText>
                </CardTitle>
                <CardDescription>
                  Full-page gradient backgrounds with multiple variants and directions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['astral', 'neural', 'warmth', 'cosmic', 'aurora', 'mesh'].map((variant) => (
                    <Card
                      key={variant}
                      className="p-4 cursor-pointer hover:shadow-glow-primary transition-all"
                    >
                      <div className="h-24 rounded-md mb-3 relative overflow-hidden">
                        <GradientBackground
                          variant={variant as any}
                          intensity="medium"
                          direction="radial"
                          className="relative"
                        />
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {variant}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>
                  <GradientText variant="neural">Grid Patterns</GradientText>
                </CardTitle>
                <CardDescription>Subtle geometric patterns for texture and depth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['dots', 'lines', 'squares', 'hexagon'].map((pattern) => (
                    <Card key={pattern} className="p-4 relative overflow-hidden">
                      <GridPattern
                        variant={pattern as any}
                        size="md"
                        intensity="medium"
                        className="absolute inset-0"
                      />
                      <div className="relative z-10">
                        <Badge variant="secondary" className="capitalize">
                          {pattern}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="utilities" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>
                  <GradientText variant="neural">Utility Classes</GradientText>
                </CardTitle>
                <CardDescription>CSS utility classes for quick styling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Background Utilities</h4>
                    <div className="space-y-2">
                      <div className="p-4 rounded-md bg-mesh-gradient">
                        <code>.bg-mesh-gradient</code>
                      </div>
                      <div className="p-4 rounded-md bg-cosmic-gradient">
                        <code>.bg-cosmic-gradient</code>
                      </div>
                      <div className="p-4 rounded-md bg-aurora-gradient">
                        <code>.bg-aurora-gradient</code>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Glass Effects</h4>
                    <div className="space-y-2">
                      <div className="p-4 rounded-md glass-card">
                        <code>.glass-card</code>
                      </div>
                      <div className="p-4 rounded-md glass-nav">
                        <code>.glass-nav</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Shadow Effects</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 shadow-glow-primary">
                      <code>.shadow-glow-primary</code>
                    </Card>
                    <Card className="p-4 shadow-glow-accent">
                      <code>.shadow-glow-accent</code>
                    </Card>
                    <Card className="p-4 shadow-glow-success">
                      <code>.shadow-glow-success</code>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
