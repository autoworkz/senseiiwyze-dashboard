'use client'

import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Download, FileText, Presentation, Settings, MoreHorizontal } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2">
        <FileText className="h-4 w-4" />
        Export Report
      </Button>
      
      <Button variant="outline" size="sm" className="gap-2">
        <Presentation className="h-4 w-4" />
        Present
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2">
            <Download className="h-4 w-4" />
            Download Data
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Settings className="h-4 w-4" />
            Dashboard Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <FileText className="h-4 w-4" />
            Schedule Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

