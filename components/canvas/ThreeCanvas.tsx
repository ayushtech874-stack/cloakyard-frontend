'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment, useGLTF, useTexture, Decal, Center } from '@react-three/drei'
import * as THREE from 'three'

function Shirt() {
  // Using the widely available shirt_baked.glb from pmndrs
  const { nodes, materials } = useGLTF('/shirt_baked.glb') as any
  const logoTexture = useTexture('/logo-cropped.png')
  
  // Ref for rotation
  const group = useRef<THREE.Group>(null!)
  
  useFrame((state, delta) => {
    if (group.current) {
      // Gentle floating rotation
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  // We ensure the logo looks right
  logoTexture.anisotropy = 16

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh
          castShadow
          geometry={nodes.T_Shirt_male.geometry}
          material={materials.lambert1}
          material-roughness={1}
          dispose={null}
        >
          {/* Black material for the shirt */}
          <meshStandardMaterial color="#111111" roughness={0.8} />
          
          {/* Logo Decal placed on the chest */}
          <Decal 
            position={[0, 0.04, 0.15]} 
            rotation={[0, 0, 0]} 
            scale={0.15} 
            map={logoTexture} 
            map-anisotropy={16}
          />
        </mesh>
      </Float>
    </group>
  )
}

export function ThreeCanvas() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-transparent">
      <Canvas 
        camera={{ position: [0, 0, 0.7], fov: 35 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#dddddd" />
        
        <Environment preset="city" />
        
        <Center>
          <Shirt />
        </Center>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2 - 0.2} 
          maxPolarAngle={Math.PI / 2 + 0.2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}
