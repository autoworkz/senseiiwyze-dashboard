'use client'

import {
  InteractiveButton,
  InteractiveCard,
  InteractiveCardContent,
  InteractiveCardHeader,
  InteractiveCardTitle,
  InteractiveInput,
  useInteractive,
} from '@/components/interactive'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function InteractiveDemoPage() {
  // Example of using the hook programmatically
  const { className: buttonHookClass } = useInteractive({
    type: 'button',
    effect: 'glow',
    intensity: 'strong',
  })

  const { className: cardHookClass } = useInteractive({
    type: 'card',
    effect: 'lift',
    clickable: true,
  })

  const { className: badgeClass } = useInteractive({
    type: 'generic',
    effect: 'scale',
  })

  return (
    <div className="container mx-auto p-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Interactive Micro-Interactions Demo</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the three ways to add micro-interactions to shadcn/ui components without modifying
          the original components.
        </p>
      </div>

      {/* Wrapper Components Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">1. Interactive Wrapper Components</h2>
        <p className="text-muted-foreground">
          Enhanced versions of shadcn components with built-in micro-interactions.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Interactive Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Interactive Buttons</h3>
            <div className="space-y-3">
              <InteractiveButton variant="default">Default Button</InteractiveButton>
              <InteractiveButton variant="outline" effect="scale">
                Scale Effect
              </InteractiveButton>
              <InteractiveButton variant="secondary" effect="glow" intensity="strong">
                Strong Glow
              </InteractiveButton>
              <InteractiveButton variant="destructive" effect="pulse">
                Pulse Effect
              </InteractiveButton>
            </div>
          </div>

          {/* Interactive Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Interactive Cards</h3>
            <InteractiveCard effect="lift" clickable>
              <InteractiveCardHeader>
                <InteractiveCardTitle>Lift Card</InteractiveCardTitle>
              </InteractiveCardHeader>
              <InteractiveCardContent>
                <p className="text-sm text-muted-foreground">
                  This card lifts on hover with enhanced shadow.
                </p>
              </InteractiveCardContent>
            </InteractiveCard>

            <InteractiveCard effect="scale" intensity="subtle">
              <InteractiveCardHeader>
                <InteractiveCardTitle>Scale Card</InteractiveCardTitle>
              </InteractiveCardHeader>
              <InteractiveCardContent>
                <p className="text-sm text-muted-foreground">Subtle scale effect on interaction.</p>
              </InteractiveCardContent>
            </InteractiveCard>
          </div>

          {/* Interactive Inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Interactive Inputs</h3>
            <div className="space-y-3">
              <InteractiveInput placeholder="Default interactive input" />
              <InteractiveInput placeholder="Glow effect on focus" effect="glow" />
              <InteractiveInput placeholder="Lift effect" effect="lift" intensity="strong" />
              <InteractiveInput placeholder="Focus ring effect" effect="focus-ring" />
            </div>
          </div>
        </div>
      </section>

      {/* Utility Classes Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">2. Utility Classes</h2>
        <p className="text-muted-foreground">
          Add micro-interactions to any element using CSS utility classes.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Scale Effects</h3>
            <div className="space-y-3">
              <Button className="interactive-scale">Scale on Hover</Button>
              <Badge className="interactive-scale">Interactive Badge</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Lift Effects</h3>
            <div className="space-y-3">
              <Card className="interactive-lift cursor-pointer">
                <CardHeader>
                  <CardTitle>Lift Effect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Hover to see the lift effect.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Intensity Variations</h3>
            <div className="space-y-3">
              <Button className="interactive-subtle">Subtle Animation</Button>
              <Button className="interactive-strong">Strong Animation</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hook Usage Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">3. useInteractive Hook</h2>
        <p className="text-muted-foreground">
          Programmatically add micro-interactions using the React hook.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Button with Hook</h3>
            <Button className={buttonHookClass}>Hook-Enhanced Button</Button>
            <p className="text-xs text-muted-foreground">
              Uses: effect=&quot;glow&quot;, intensity=&quot;strong&quot;
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Card with Hook</h3>
            <Card className={cardHookClass}>
              <CardHeader>
                <CardTitle>Hook-Enhanced Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card uses the useInteractive hook.
                </p>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground">
              Uses: effect=&quot;lift&quot;, clickable=true
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Generic Element</h3>
            <div className={badgeClass}>
              <Badge>Hook Badge</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Uses: type=&quot;generic&quot;, effect=&quot;scale&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Floating Effects Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Special Effects</h2>
        <p className="text-muted-foreground">Explore floating and pulsing animations.</p>

        <div className="flex flex-wrap gap-6">
          <InteractiveButton effect="float" variant="outline">
            Floating Button
          </InteractiveButton>

          <InteractiveCard effect="float" className="w-64">
            <InteractiveCardHeader>
              <InteractiveCardTitle>Floating Card</InteractiveCardTitle>
            </InteractiveCardHeader>
            <InteractiveCardContent>
              <p className="text-sm text-muted-foreground">
                This card has a gentle floating animation.
              </p>
            </InteractiveCardContent>
          </InteractiveCard>

          <Badge className="interactive-pulse">Pulsing Badge</Badge>
        </div>
      </section>

      {/* Code Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Usage Examples</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Wrapper Component</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {`<InteractiveButton 
  variant="default"
  effect="glow"
  intensity="strong"
>
  Click me
</InteractiveButton>`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Utility Class</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {`<Button 
  className="interactive-scale"
>
  Click me
</Button>`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">useInteractive Hook</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {`const { className } = useInteractive({
  type: 'button',
  effect: 'glow'
})
<Button className={className}>
  Click me
</Button>`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
