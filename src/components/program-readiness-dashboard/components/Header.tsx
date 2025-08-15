"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'

export function Header() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Eye className="w-8 h-8" />
          <h1 className="text-3xl font-bold tracking-tight">Individual Program Readiness Snapshot</h1>
        </div>
        <p className="text-muted-foreground">
          Comprehensive overview of user's program readiness and skill development.
        </p>
      </div>
      <Link href="/app/dashboard/executive" passHref>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          Main Dashboard
        </Button>
      </Link>
    </div>
  )
}
