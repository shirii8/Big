'use client'

import { useEffect, useRef } from 'react'

declare global { interface Window { THREE: any } }

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el || !window.THREE) return
    const THREE = window.THREE
    const W = el.clientWidth, H = el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.shadowMap.enabled = true
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 100)
    camera.position.set(0, 0, 8)

    scene.add(new THREE.AmbientLight(0x111122, 0.55))
    const keyLight = new THREE.PointLight(0xC6FF00, 3.2, 22)
    keyLight.position.set(4, 4, 4); scene.add(keyLight)
    const fillLight = new THREE.PointLight(0xFF3D00, 2.1, 18)
    fillLight.position.set(-4, -2, 3); scene.add(fillLight)
    const rim = new THREE.DirectionalLight(0xE8E8FF, 0.85)
    rim.position.set(0, 5, 5); scene.add(rim)
    scene.add(new THREE.HemisphereLight(0x08000F, 0x001100, 0.28))

    const pCount = 2200
    const pPos   = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5)*32
      pPos[i*3+1] = (Math.random()-0.5)*22
      pPos[i*3+2] = (Math.random()-0.5)*22-6
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xC6FF00, size: 0.028, transparent: true, opacity: 0.38 })))

    const group = new THREE.Group()
    const uMat  = new THREE.MeshStandardMaterial({ color: 0x0d0020, roughness: 0.07, metalness: 0.92 })
    const midM  = new THREE.MeshStandardMaterial({ color: 0xC6FF00, roughness: 0.15, metalness: 0.1, emissive: 0xC6FF00, emissiveIntensity: 0.12 })
    const soleM = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.7 })
    const laceM = new THREE.MeshStandardMaterial({ color: 0xC6FF00, emissive: 0xC6FF00, emissiveIntensity: 0.6 })
    const logoM = new THREE.MeshStandardMaterial({ color: 0xFF3D00, emissive: 0xFF3D00, emissiveIntensity: 0.35, metalness: 0.5 })

    const sole = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.28, 1.18), soleM)
    sole.position.y = -0.72; sole.castShadow = true; group.add(sole)
    const mid = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.34, 1.0), midM)
    mid.position.y = -0.38; mid.castShadow = true; group.add(mid)
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.22, 1.38, 9, 1, false, Math.PI*0.14, Math.PI*1.12), uMat)
    upper.position.set(-0.28, 0.32, 0); upper.rotation.z = 0.28; upper.scale.set(1.82, 0.88, 0.74); upper.castShadow = true; group.add(upper)
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.66, 14, 10), uMat)
    toe.position.set(1.15, -0.12, 0); toe.scale.set(1, 0.66, 0.66); toe.castShadow = true; group.add(toe)
    const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.66, 1.08, 11), uMat)
    heel.position.set(-1.24, 0.1, 0); heel.castShadow = true; group.add(heel)
    for (let i = 0; i < 5; i++) {
      const lace = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.045, 0.82), laceM)
      lace.position.set(-0.58+i*0.26, 0.36, 0); group.add(lace)
    }
    const logo = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.09, 0.38), logoM)
    logo.position.set(-0.52, -0.35, 0.5); group.add(logo)
    group.scale.setScalar(0.84); group.position.set(2.2, -0.4, 0); scene.add(group)

    let velX = 0, velY = 0.0028, isDragging = false, lastX = 0, lastY = 0
    const onDown = (e: PointerEvent) => { isDragging = true; lastX = e.clientX; lastY = e.clientY }
    const onUp = () => { isDragging = false }
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return
      velY = (e.clientX-lastX)*0.0052; velX = (e.clientY-lastY)*0.0052
      lastX = e.clientX; lastY = e.clientY
      if (midM.emissiveIntensity < 0.38) midM.emissiveIntensity = 0.35
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
      velX *= 0.955; velY *= 0.955
      if (!isDragging) velY += 0.0026
      group.rotation.x += velX; group.rotation.y += velY
      group.position.y = -0.4 + Math.sin(t)*0.16
      if (midM.emissiveIntensity > 0.12) midM.emissiveIntensity -= 0.008
      keyLight.position.x = Math.sin(t*0.65)*5; keyLight.position.y = Math.cos(t*0.48)*3+2
      fillLight.position.x = Math.cos(t*0.38)*4
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
  }, [])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{ cursor: 'grab' }} />
}



// 'use client'

// import { useEffect, useRef } from 'react'
// import * as THREE from 'three'

// export default function HeroCanvas() {
//   const mountRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const el = mountRef.current
//     if (!el) return

//     const W = el.clientWidth
//     const H = el.clientHeight

//     /* ── Renderer ── */
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//       powerPreference: 'high-performance',
//     })
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//     renderer.setSize(W, H)
//     renderer.shadowMap.enabled = true
//     renderer.toneMapping = THREE.ACESFilmicToneMapping
//     renderer.toneMappingExposure = 1.15
//     el.appendChild(renderer.domElement)

//     /* ── Scene & Camera ── */
//     const scene  = new THREE.Scene()
//     const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 100)
//     camera.position.set(0, 0, 8)

//     /* ── Lights ── */
//     scene.add(new THREE.AmbientLight(0x111122, 0.55))

//     const keyLight = new THREE.PointLight(0xC6FF00, 3.2, 22)
//     keyLight.position.set(4, 4, 4)
//     scene.add(keyLight)

//     const fillLight = new THREE.PointLight(0xFF3D00, 2.1, 18)
//     fillLight.position.set(-4, -2, 3)
//     scene.add(fillLight)

//     const rim = new THREE.DirectionalLight(0xE8E8FF, 0.85)
//     rim.position.set(0, 5, 5)
//     scene.add(rim)

//     scene.add(new THREE.HemisphereLight(0x08000F, 0x001100, 0.28))

//     /* ── Background particle field ── */
//     const pCount = 2200
//     const pPos   = new Float32Array(pCount * 3)
//     for (let i = 0; i < pCount; i++) {
//       pPos[i * 3]     = (Math.random() - 0.5) * 32
//       pPos[i * 3 + 1] = (Math.random() - 0.5) * 22
//       pPos[i * 3 + 2] = (Math.random() - 0.5) * 22 - 6
//     }
//     const pGeo = new THREE.BufferGeometry()
//     pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
//     scene.add(
//       new THREE.Points(
//         pGeo,
//         new THREE.PointsMaterial({
//           color: 0xC6FF00,
//           size: 0.028,
//           transparent: true,
//           opacity: 0.38,
//         })
//       )
//     )

//     /* ── Sneaker geometry ── */
//     const group = new THREE.Group()

//     const uMat = new THREE.MeshStandardMaterial({
//       color: 0x0d0020,
//       roughness: 0.07,
//       metalness: 0.92,
//     })
//     const midM = new THREE.MeshStandardMaterial({
//       color: 0xC6FF00,
//       roughness: 0.15,
//       metalness: 0.1,
//       emissive: new THREE.Color(0xC6FF00),
//       emissiveIntensity: 0.12,
//     })
//     const soleM = new THREE.MeshStandardMaterial({
//       color: 0x111111,
//       roughness: 0.3,
//       metalness: 0.7,
//     })
//     const laceM = new THREE.MeshStandardMaterial({
//       color: 0xC6FF00,
//       emissive: new THREE.Color(0xC6FF00),
//       emissiveIntensity: 0.6,
//     })
//     const logoM = new THREE.MeshStandardMaterial({
//       color: 0xFF3D00,
//       emissive: new THREE.Color(0xFF3D00),
//       emissiveIntensity: 0.35,
//       metalness: 0.5,
//     })

//     // Sole
//     const sole = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.28, 1.18), soleM)
//     sole.position.y = -0.72
//     sole.castShadow = true
//     group.add(sole)

//     // Midsole
//     const mid = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.34, 1.0), midM)
//     mid.position.y = -0.38
//     mid.castShadow = true
//     group.add(mid)

//     // Upper body
//     const upper = new THREE.Mesh(
//       new THREE.CylinderGeometry(0, 1.22, 1.38, 9, 1, false, Math.PI * 0.14, Math.PI * 1.12),
//       uMat
//     )
//     upper.position.set(-0.28, 0.32, 0)
//     upper.rotation.z = 0.28
//     upper.scale.set(1.82, 0.88, 0.74)
//     upper.castShadow = true
//     group.add(upper)

//     // Toe box
//     const toe = new THREE.Mesh(new THREE.SphereGeometry(0.66, 14, 10), uMat)
//     toe.position.set(1.15, -0.12, 0)
//     toe.scale.set(1, 0.66, 0.66)
//     toe.castShadow = true
//     group.add(toe)

//     // Heel counter
//     const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.66, 1.08, 11), uMat)
//     heel.position.set(-1.24, 0.1, 0)
//     heel.castShadow = true
//     group.add(heel)

//     // Laces
//     for (let i = 0; i < 5; i++) {
//       const lace = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.045, 0.82), laceM)
//       lace.position.set(-0.58 + i * 0.26, 0.36, 0)
//       group.add(lace)
//     }

//     // Logo mark
//     const logo = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.09, 0.38), logoM)
//     logo.position.set(-0.52, -0.35, 0.5)
//     group.add(logo)

//     group.scale.setScalar(0.84)
//     group.position.set(2.2, -0.4, 0)
//     scene.add(group)

//     /* ── Pointer drag interaction ── */
//     let velX = 0
//     let velY = 0.0028
//     let isDragging = false
//     let lastX = 0
//     let lastY = 0

//     const onDown = (e: PointerEvent) => {
//       isDragging = true
//       lastX = e.clientX
//       lastY = e.clientY
//     }
//     const onUp = () => { isDragging = false }
//     const onMove = (e: PointerEvent) => {
//       if (!isDragging) return
//       velY = (e.clientX - lastX) * 0.0052
//       velX = (e.clientY - lastY) * 0.0052
//       lastX = e.clientX
//       lastY = e.clientY
//       if (midM.emissiveIntensity < 0.38) midM.emissiveIntensity = 0.35
//     }

//     renderer.domElement.addEventListener('pointerdown', onDown)
//     renderer.domElement.addEventListener('pointermove', onMove)
//     window.addEventListener('pointerup', onUp)

//     /* ── Resize handler ── */
//     const onResize = () => {
//       const w = el.clientWidth
//       const h = el.clientHeight
//       camera.aspect = w / h
//       camera.updateProjectionMatrix()
//       renderer.setSize(w, h)
//     }
//     window.addEventListener('resize', onResize)

//     /* ── Animation loop ── */
//     let t = 0
//     let animId: number

//     const animate = () => {
//       animId = requestAnimationFrame(animate)
//       t += 0.009

//       velX *= 0.955
//       velY *= 0.955
//       if (!isDragging) velY += 0.0026

//       group.rotation.x += velX
//       group.rotation.y += velY
//       group.position.y = -0.4 + Math.sin(t) * 0.16

//       if (midM.emissiveIntensity > 0.12) midM.emissiveIntensity -= 0.008

//       keyLight.position.x = Math.sin(t * 0.65) * 5
//       keyLight.position.y = Math.cos(t * 0.48) * 3 + 2
//       fillLight.position.x = Math.cos(t * 0.38) * 4

//       renderer.render(scene, camera)
//     }
//     animate()

//     /* ── Cleanup ── */
//     return () => {
//       cancelAnimationFrame(animId)
//       renderer.domElement.removeEventListener('pointerdown', onDown)
//       renderer.domElement.removeEventListener('pointermove', onMove)
//       window.removeEventListener('pointerup', onUp)
//       window.removeEventListener('resize', onResize)
//       renderer.dispose()
//       if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
//     }
//   }, [])

//   return (
//     <div
//       ref={mountRef}
//       className="absolute inset-0 w-full h-full"
//       style={{ cursor: 'grab' }}
//     />
//   )
// }