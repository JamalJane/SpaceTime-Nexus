'use client'

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ className }: SplineSceneProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }} />
  )
}
