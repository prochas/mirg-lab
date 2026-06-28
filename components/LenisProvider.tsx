'use client'

import { useEffect } from 'react'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let rafId: number

    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.08 })

      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        window.dispatchEvent(new CustomEvent('smooth-scroll', { detail: scroll }))
      })

      const raf = (time: number) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    })

    return () => cancelAnimationFrame(rafId)
  }, [])

  return <>{children}</>
}
