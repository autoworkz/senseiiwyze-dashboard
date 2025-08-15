"use client"
import React from 'react'

export function Header() {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">Individual Program Readiness Snapshot</h1>
      <p className="text-muted-foreground">
        Comprehensive overview of user's program readiness and skill development.
      </p>
    </div>
  )
}
