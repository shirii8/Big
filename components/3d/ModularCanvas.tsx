'use client'

import { useEffect, useRef } from 'react'

const PALETTES = [
  { base: 0x0d0020, accent: 0xC6FF00 },
  { base: 0x001a0a, accent: 0x99FF00 },
  { base: 0x1a1a30, accent: 0xE8E8FF },
  { base: 0x1a0a00, accent: 0xFF6D00 },
]

interface Props { step?: number }

export default function ModularCanvas({ step = 0 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const stepRef  = useRef(step)
  useEffect(() => { stepRef.current = step }, [step])

  useEffect(() => {
    const el = mountRef.current
    if (!el || !window.THREE) return
    const THREE = window.THREE
    const W = el.clientWidth || 460, H = el.clientHeight || 460

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W/H, 0.1, 50)
    camera.position.set(0, 0.8, 6.5); camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight(0x111122, 0.6))
    const key = new THREE.PointLight(0xC6FF00, 3.5, 18)
    key.position.set(3, 4, 4); scene.add(key)

    const soleM = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.7 })
    const sole  = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.26, 1.1), soleM)
    sole.position.y = -0.65; scene.add(sole)

    const midM    = new THREE.MeshStandardMaterial({ color: 0xC6FF00, roughness: 0.15, emissive: 0xC6FF00, emissiveIntensity: 0.12 })
    const midMesh = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.30, 0.96), midM)
    midMesh.position.y = -0.34; scene.add(midMesh)

    const buildUpper = (pal: typeof PALETTES[0]) => {
      const g    = new THREE.Group()
      const uMat = new THREE.MeshStandardMaterial({ color: pal.base, roughness: 0.07, metalness: 0.92 })
      const lMat = new THREE.MeshStandardMaterial({ color: pal.accent, emissive: pal.accent, emissiveIntensity: 0.55 })
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.18, 1.28, 9, 1, false, Math.PI*0.14, Math.PI*1.12), uMat)
      body.position.set(-0.26, 0.28, 0); body.rotation.z = 0.28; body.scale.set(1.78, 0.86, 0.72); g.add(body)
      const toe = new THREE.Mesh(new THREE.SphereGeometry(0.6, 13, 9), uMat)
      toe.position.set(1.08, -0.1, 0); toe.scale.set(1, 0.64, 0.64); g.add(toe)
      const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.63, 1.04, 10), uMat)
      heel.position.set(-1.18, 0.08, 0); g.add(heel)
      for (let i = 0; i < 5; i++) {
        const lace = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.78), lMat)
        lace.position.set(-0.56+i*0.24, 0.32, 0); g.add(lace)
      }
      return g
    }

    let upperGroup = buildUpper(PALETTES[0])
    scene.add(upperGroup)

    let swapping = false, swapDir = 1, swapAlpha = 0, pendingPal = 0, lastStep = stepRef.current
    let velY = 0.004, isDrag = false, lx = 0
    const onDown = (e: PointerEvent) => { isDrag = true; lx = e.clientX }
    const onUp   = () => { isDrag = false }
    const onMove = (e: PointerEvent) => { if (!isDrag) return; velY = (e.clientX-lx)*0.006; lx = e.clientX }
    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    let t = 0, animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate); t += 0.009
      const newStep = stepRef.current
      if (newStep !== lastStep && !swapping) {
        lastStep = newStep; pendingPal = newStep % PALETTES.length
        swapping = true; swapDir = 1; swapAlpha = 0
      }
      if (swapping) {
        swapAlpha += 0.035
        if (swapDir === 1) {
          upperGroup.position.y = swapAlpha * 3
          upperGroup.children.forEach((c: any) => {
            if (c.material) { c.material.transparent = true; c.material.opacity = Math.max(0, 1-swapAlpha) }
          })
          if (swapAlpha >= 1) {
            scene.remove(upperGroup)
            upperGroup.traverse((o: any) => { if (o.isMesh) o.geometry.dispose() })
            const pal = PALETTES[pendingPal]
            upperGroup = buildUpper(pal)
            upperGroup.position.y = -3
            upperGroup.children.forEach((c: any) => {
              if (c.material) { c.material.transparent = true; c.material.opacity = 0 }
            })
            scene.add(upperGroup)
            midM.color.set(pal.accent); midM.emissive.set(pal.accent)
            swapDir = -1; swapAlpha = 0
          }
        } else {
          upperGroup.position.y = -3 + swapAlpha * 3
          upperGroup.children.forEach((c: any) => {
            if (c.material) c.material.opacity = Math.min(1, swapAlpha)
          })
          if (swapAlpha >= 1) {
            upperGroup.position.y = 0
            upperGroup.children.forEach((c: any) => {
              if (c.material) { c.material.transparent = false; c.material.opacity = 1 }
            })
            swapping = false
          }
        }
      }
      velY *= 0.96
      if (!isDrag) velY += 0.003
      upperGroup.rotation.y += velY
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
  }, [])

  return <div ref={mountRef} className="w-full h-full" style={{ cursor: 'grab' }} />
}