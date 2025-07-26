'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, Video, ExternalLink } from 'lucide-react'

interface Recommendation {
  title: string
  type: 'course' | 'article' | 'video'
  reason: string
}

interface RecommendedContentProps {
  recommendations: Recommendation[]
}

export function RecommendedContent({ recommendations }: RecommendedContentProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />
      case 'article':
        return <FileText className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      course: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      article: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      video: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    }
    
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.course}>
        {type}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(rec.type)}
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                </div>
                {getTypeBadge(rec.type)}
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">
                {rec.reason}
              </p>
              
              <Button size="sm" variant="outline" className="w-full gap-2">
                <ExternalLink className="h-3 w-3" />
                View Content
              </Button>
            </div>
          ))}
        </div>
        
        {recommendations.length === 0 && (
          <div className="text-center py-6">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No recommendations available
            </p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" size="sm" className="w-full">
            View All Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

