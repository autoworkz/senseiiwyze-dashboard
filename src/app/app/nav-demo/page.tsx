'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export default function NavigationDemoPage() {
  const [iconRoundness, setIconRoundness] = useState(8) // 0.5rem default
  const [logoRoundness, setLogoRoundness] = useState(8)

  // Convert to rem (each unit is 0.0625rem)
  const iconRoundnessRem = iconRoundness * 0.0625
  const logoRoundnessRem = logoRoundness * 0.0625

  // Apply CSS variables globally
  const updateCSSVariables = () => {
    const nav = document.querySelector('.sliding-navigation') as HTMLElement
    if (nav) {
      nav.style.setProperty('--icon-roundness', `${iconRoundnessRem}rem`)
    }

    const logoIcon = document.querySelector('.nav-logo-icon') as HTMLElement
    if (logoIcon) {
      logoIcon.style.borderRadius = `${logoRoundnessRem}rem`
    }
  }

  // Update on change
  useState(() => {
    updateCSSVariables()
  })

  const presets = [
    { name: 'Square', icon: 0, logo: 0 },
    { name: 'Subtle', icon: 2, logo: 2 },
    { name: 'Rounded', icon: 4, logo: 4 },
    { name: 'Default', icon: 8, logo: 8 },
    { name: 'Smooth', icon: 12, logo: 12 },
    { name: 'Pill', icon: 16, logo: 16 },
    { name: 'Circle', icon: 999, logo: 999 },
    { name: 'Mixed', icon: 4, logo: 16 },
  ]

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Navigation Design Lab</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Icon Roundness Controls</CardTitle>
          <CardDescription>
            Experiment with different roundness values for navigation icons and logo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Icon Roundness */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="icon-roundness">Navigation Icons</Label>
              <span className="text-sm text-muted-foreground">
                {iconRoundness === 999 ? 'Full' : `${iconRoundnessRem}rem`}
              </span>
            </div>
            <Slider
              id="icon-roundness"
              min={0}
              max={32}
              step={1}
              value={[iconRoundness === 999 ? 32 : iconRoundness]}
              onValueChange={(value) => {
                setIconRoundness(value[0])
                updateCSSVariables()
              }}
              className="w-full"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIconRoundness(999)
                updateCSSVariables()
              }}
            >
              Full Circle
            </Button>
          </div>

          {/* Logo Roundness */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="logo-roundness">Logo Icon</Label>
              <span className="text-sm text-muted-foreground">
                {logoRoundness === 999 ? 'Full' : `${logoRoundnessRem}rem`}
              </span>
            </div>
            <Slider
              id="logo-roundness"
              min={0}
              max={32}
              step={1}
              value={[logoRoundness === 999 ? 32 : logoRoundness]}
              onValueChange={(value) => {
                setLogoRoundness(value[0])
                updateCSSVariables()
              }}
              className="w-full"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLogoRoundness(999)
                updateCSSVariables()
              }}
            >
              Full Circle
            </Button>
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <Label>Quick Presets</Label>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIconRoundness(preset.icon)
                    setLogoRoundness(preset.logo)
                    updateCSSVariables()
                  }}
                  className="text-xs"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSS Values</CardTitle>
          <CardDescription>
            Copy these values to make them permanent in your navigation.css
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`.sliding-navigation {
  --icon-roundness: ${iconRoundness === 999 ? '9999px' : `${iconRoundnessRem}rem`};
}

.nav-logo-icon {
  border-radius: ${logoRoundness === 999 ? '9999px' : `${logoRoundnessRem}rem`};
}`}</code>
          </pre>
        </CardContent>
      </Card>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          💡 Tip: Try hovering over the navigation items to see the sliding indicator and glow
          effects!
        </p>
        <p>🎨 The mouse glow effect follows your cursor position in the navigation bar.</p>
      </div>
    </div>
  )
}
