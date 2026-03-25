'use client'

import { useEffect, useRef } from 'react'

interface Props { baseColor?: number; accentColor?: number }

export default function ProductCanvas({ baseColor = 0x0d0020, accentColor = 0xC6FF00 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el || !window.THREE) return
    const THREE = window.THREE
    const W = el.clientWidth || 320, H = el.clientHeight || 300

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, W/H, 0.1, 50)
    camera.position.set(0, 0.4, 5.2)

    scene.add(new THREE.AmbientLight(0x111122, 0.6))
    
    // FIX: Properly set light positions instead of using Object.assign
    const key = new THREE.PointLight(accentColor, 3.5, 16)
    key.position.set(3, 3, 3)
    scene.add(key)

    const fill = new THREE.PointLight(0xFF3D00, 2, 12)
    fill.position.set(-3, -1, 2)
    scene.add(fill)

    const group = new THREE.Group()
    const uMat  = new THREE.MeshStandardMaterial({ color: baseColor,   roughness: 0.07, metalness: 0.92 })
    const mMat  = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.15, emissive: accentColor, emissiveIntensity: 0.14 })
    const soleM = new THREE.MeshStandardMaterial({ color: 0x111111,    roughness: 0.35, metalness: 0.6 })

    const sole = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.24, 1.1), soleM)
    sole.position.y = -0.62; group.add(sole)
    const mid = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 0.94), mMat)
    mid.position.y = -0.32; group.add(mid)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.1, 1.24, 9, 1, false, Math.PI*0.13, Math.PI*1.12), uMat)
    body.position.set(-0.26, 0.28, 0); body.rotation.z = 0.28; body.scale.set(1.75, 0.86, 0.72); group.add(body)
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.58, 12, 9), uMat)
    toe.position.set(1.04, -0.1, 0); toe.scale.set(1, 0.64, 0.64); group.add(toe)
    
    for (let i = 0; i < 4; i++) {
      const lace = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.76),
        new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 0.55 }))
      lace.position.set(-0.46+i*0.26, 0.32, 0); group.add(lace)
    }
    scene.add(group)

    let velX = 0, velY = 0.003, isDrag = false, lx = 0, ly = 0
    const onDown = (e: PointerEvent) => { isDrag = true; lx = e.clientX; ly = e.clientY }
    const onUp   = () => { isDrag = false }
    const onMove = (e: PointerEvent) => {
      if (!isDrag) return
      velY = (e.clientX-lx)*0.0056; velX = (e.clientY-ly)*0.0056; lx = e.clientX; ly = e.clientY
    }
    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    let t = Math.random()*100, animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate); t += 0.01
      velX *= 0.952; velY *= 0.952
      if (!isDrag) velY += 0.0028
      group.rotation.x += velX; group.rotation.y += velY
      group.position.y = Math.sin(t)*0.1
      key.position.x = Math.sin(t*0.6)*3
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [baseColor, accentColor])

  return <div ref={mountRef} className="w-full h-full" style={{ cursor: 'grab' }} />
}