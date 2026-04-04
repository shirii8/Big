'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Float } from '@react-three/drei'
import * as THREE from 'three'

export default function TesschShoe() {
  const masterGroup = useRef<THREE.Group>(null)
  const upperRef = useRef<THREE.Group>(null)
  const soleRef = useRef<THREE.Group>(null)
  const scroll = useScroll()

  // Your exact materials from HeroCanvas
  const baseColor = 0x0d0020
  const accentColor = 0xC6FF00
  const accentColorObj = new THREE.Color(accentColor)
  const logoColorObj = new THREE.Color(0xFF3D00)

  useFrame((state) => {
    if (!masterGroup.current || !upperRef.current || !soleRef.current) return

    // r1 goes from 0 to 1 as you scroll down
    const r1 = scroll.offset 

    // Hero Spin (spins the whole shoe as you scroll)
    masterGroup.current.rotation.y = THREE.MathUtils.lerp(
      masterGroup.current.rotation.y, 
      r1 * Math.PI * 4, 
      0.1
    )

    // Exploded View Math (The "Break")
    // Sin wave creates a curve that separates the parts in the middle of the scroll and brings them back
    const breakAmount = Math.max(0, Math.sin(r1 * Math.PI)) 

    // Move the upper half UP, and the sole half DOWN
    upperRef.current.position.y = THREE.MathUtils.lerp(upperRef.current.position.y, breakAmount * 2.5, 0.1)
    soleRef.current.position.y = THREE.MathUtils.lerp(soleRef.current.position.y, -breakAmount * 1.5, 0.1)

    // 4th Wall Break Zoom at the very end of the scroll
    if (r1 > 0.8) {
      const zoomIn = (r1 - 0.8) * 5
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 8 - zoomIn * 15, 0.1)
    } else {
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 8, 0.1)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      {/* Master Group - scales and positions the whole shoe just like your HeroCanvas */}
      <group ref={masterGroup} scale={0.84} position={[0, -0.4, 0]}>
        
        {/* === SOLE GROUP (Bottom Half) === */}
        <group ref={soleRef}>
          {/* Sole */}
          <mesh position={[0, -0.72, 0]} castShadow>
            <boxGeometry args={[3.2, 0.28, 1.18]} />
            <meshStandardMaterial color={0x111111} roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Midsole */}
          <mesh position={[0, -0.38, 0]} castShadow>
            <boxGeometry args={[3.0, 0.34, 1.0]} />
            <meshStandardMaterial 
              color={accentColor} 
              roughness={0.15} 
              metalness={0.1} 
              emissive={accentColorObj} 
              emissiveIntensity={0.12} 
            />
          </mesh>
        </group>

        {/* === UPPER GROUP (Top Half - separates on scroll) === */}
        <group ref={upperRef}>
          {/* Upper Body */}
          <mesh 
            position={[-0.28, 0.32, 0]} 
            rotation={[0, 0, 0.28]} 
            scale={[1.82, 0.88, 0.74]} 
            castShadow
          >
            <cylinderGeometry args={[0, 1.22, 1.38, 9, 1, false, Math.PI * 0.14, Math.PI * 1.12]} />
            <meshStandardMaterial color={baseColor} roughness={0.07} metalness={0.92} />
          </mesh>

          {/* Toe Box */}
          <mesh position={[1.15, -0.12, 0]} scale={[1, 0.66, 0.66]} castShadow>
            <sphereGeometry args={[0.66, 14, 10]} />
            <meshStandardMaterial color={baseColor} roughness={0.07} metalness={0.92} />
          </mesh>

          {/* Heel Counter */}
          <mesh position={[-1.24, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.54, 0.66, 1.08, 11]} />
            <meshStandardMaterial color={baseColor} roughness={0.07} metalness={0.92} />
          </mesh>

          {/* Laces Array */}
          {[...Array(5)].map((_, i) => (
            <mesh key={`lace-${i}`} position={[-0.58 + i * 0.26, 0.36, 0]}>
              <boxGeometry args={[0.022, 0.045, 0.82]} />
              <meshStandardMaterial 
                color={accentColor} 
                emissive={accentColorObj} 
                emissiveIntensity={0.6} 
              />
            </mesh>
          ))}

          {/* Logo Mark */}
          <mesh position={[-0.52, -0.35, 0.5]}>
            <boxGeometry args={[0.52, 0.09, 0.38]} />
            <meshStandardMaterial 
              color={0xFF3D00} 
              emissive={logoColorObj} 
              emissiveIntensity={0.35} 
              metalness={0.5} 
            />
          </mesh>
        </group>

      </group>
    </Float>
  )
}