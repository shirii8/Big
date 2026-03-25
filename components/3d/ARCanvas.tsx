'use client'

import { useEffect, useRef } from 'react'

interface Props { baseColor?: number; accentColor?: number }

export default function ARCanvas({ baseColor = 0x0d0020, accentColor = 0xC6FF00 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el || !window.THREE) return
    const THREE = window.THREE
    const W = el.clientWidth || 480, H = el.clientHeight || 480

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.shadowMap.enabled = true
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(44, W/H, 0.1, 50)
    camera.position.set(0, 2.4, 6.5); camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight(0x111122, 0.4))
    const spot = new THREE.SpotLight(accentColor, 5, 22, Math.PI/6, 0.3, 2)
    spot.position.set(3, 7, 4); spot.castShadow = true
    spot.shadow.mapSize.width = spot.shadow.mapSize.height = 1024
    scene.add(spot)
    const fill = new THREE.PointLight(0xFF3D00, 2.2, 14)
    fill.position.set(-3, 2, 2); scene.add(fill)

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0x0a0a14, roughness: 0.85, transparent: true, opacity: 0.65 }))
    floor.rotation.x = -Math.PI/2; floor.position.y = -1.1; floor.receiveShadow = true; scene.add(floor)

    const grid = new THREE.GridHelper(10, 24, 0xC6FF00, 0x111122)
    grid.position.y = -1.09; grid.material.transparent = true; grid.material.opacity = 0.28; scene.add(grid)

    const shadowBlob = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 }))
    shadowBlob.rotation.x = -Math.PI/2; shadowBlob.position.y = -1.08; scene.add(shadowBlob)

    const group = new THREE.Group()
    const uMat  = new THREE.MeshStandardMaterial({ color: baseColor,   roughness: 0.07, metalness: 0.93 })
    const mMat  = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.14, emissive: accentColor, emissiveIntensity: 0.14 })
    const soleM = new THREE.MeshStandardMaterial({ color: 0x111111,    roughness: 0.32, metalness: 0.65 })

    const sole = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.26, 1.16), soleM)
    sole.position.y = -0.7; sole.castShadow = true; group.add(sole)
    const mid = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.32, 0.98), mMat)
    mid.position.y = -0.36; mid.castShadow = true; group.add(mid)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.2, 1.32, 9, 1, false, Math.PI*0.14, Math.PI*1.12), uMat)
    body.position.set(-0.28, 0.3, 0); body.rotation.z = 0.28; body.scale.set(1.8, 0.88, 0.74); body.castShadow = true; group.add(body)
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.62, 14, 10), uMat)
    toe.position.set(1.12, -0.12, 0); toe.scale.set(1, 0.65, 0.65); toe.castShadow = true; group.add(toe)
    for (let i = 0; i < 5; i++) {
      const lace = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.044, 0.82),
        new THREE.MeshStandardMaterial({ color: accentColor, emissive: accentColor, emissiveIntensity: 0.6 }))
      lace.position.set(-0.58+i*0.26, 0.34, 0); group.add(lace)
    }
    scene.add(group)

    let velX = 0, velY = 0.004, isDrag = false, lx = 0, ly = 0
    const onDown = (e: PointerEvent) => { isDrag = true; lx = e.clientX; ly = e.clientY }
    const onUp   = () => { isDrag = false }
    const onMove = (e: PointerEvent) => {
      if (!isDrag) return
      velY = (e.clientX-lx)*0.0055; velX = (e.clientY-ly)*0.0055; lx = e.clientX; ly = e.clientY
    }
    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight
      camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let t = 0, animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate); t += 0.009
      velX *= 0.95; velY *= 0.95
      if (!isDrag) velY += 0.003
      group.rotation.x += velX; group.rotation.y += velY
      const bob = Math.sin(t)*0.1
      group.position.y = bob
      const s = Math.max(0.6, 1-bob*0.12)
      shadowBlob.scale.set(s, s, s)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [baseColor, accentColor])

  return <div ref={mountRef} className="w-full h-full" style={{ cursor: 'grab' }} />
}