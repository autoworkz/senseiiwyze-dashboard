'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PersonalityRadarProps {
  data: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  className?: string
}

export function PersonalityRadar({ data, className }: PersonalityRadarProps) {
  const traits = [
    { name: 'Openness', value: data.openness },
    { name: 'Conscientiousness', value: data.conscientiousness },
    { name: 'Extraversion', value: data.extraversion },
    { name: 'Agreeableness', value: data.agreeableness },
    { name: 'Neuroticism', value: data.neuroticism },
  ]
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Personality Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {traits.map((trait) => (
            <div key={trait.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{trait.name}</span>
                <span className="font-medium">{Math.round(trait.value * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${trait.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Based on your learning behavior and preferences
        </p>
      </CardContent>
    </Card>
  )
}
