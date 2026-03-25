'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
    
  const mxRef  = useRef(0)
  const myRef  = useRef(0)
  const rxRef  = useRef(0)
  const ryRef  = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const dot  = document.getElementById('cursor-dot')
    const ring = document.getElementById('cursor-ring')
    const bar  = document.getElementById('progress-bar')

    const onMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.closest('button, a')) dot?.classList.add('grow');
};
const onMouseOut = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.closest('button, a')) dot?.classList.remove('grow');
};

document.addEventListener('mouseover', onMouseOver);
document.addEventListener('mouseout', onMouseOut);

    const onMove = (e: MouseEvent) => {
      mxRef.current = e.clientX
      myRef.current = e.clientY
      if (dot) {
        dot.style.left = e.clientX + 'px'
        dot.style.top  = e.clientY + 'px'
      }
    }

    const lerp = () => {
      rxRef.current += (mxRef.current - rxRef.current) * 0.11
      ryRef.current += (myRef.current - ryRef.current) * 0.11
      if (ring) {
        ring.style.left = rxRef.current + 'px'
        ring.style.top  = ryRef.current + 'px'
      }
      rafRef.current = requestAnimationFrame(lerp)
    }
    lerp()

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (bar) bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const grow   = () => dot?.classList.add('grow')
    const shrink = () => dot?.classList.remove('grow')

    const attachGrow = () => {
      document.querySelectorAll('button, a').forEach((el) => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
        el.addEventListener('mouseenter', grow)
        el.addEventListener('mouseleave', shrink)
      })
    }
    attachGrow()
    const mo = new MutationObserver(attachGrow)
    mo.observe(document.body, { childList: true, subtree: true })

    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    const watchReveals = () =>
      document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el))
    watchReveals()
    const revealMo = new MutationObserver(watchReveals)
    revealMo.observe(document.body, { childList: true, subtree: true })

    

    document.addEventListener('mousemove', onMove)

    return () => {
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
      mo.disconnect()
      revealObs.disconnect()
      revealMo.disconnect()
    }
  }, [])

  return (
    <>
      <div id="progress-bar" />
      <div id="cursor-dot" />
      <div id="cursor-ring" />
    </>
  )
}