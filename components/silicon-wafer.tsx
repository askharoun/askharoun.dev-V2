"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

// Silicon Wafer Component
function Wafer({ exploded }: { exploded: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  // Chip positions
  const [chips, setChips] = useState<{ position: [number, number, number]; rotation: [number, number, number] }[]>([])

  // Generate chip positions
  useEffect(() => {
    const newChips = []
    const waferRadius = 5
    const chipSize = 0.4
    const spacing = 0.1
    const gridSize = Math.floor((waferRadius * 2) / (chipSize + spacing))

    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let y = -gridSize / 2; y < gridSize / 2; y++) {
        const posX = x * (chipSize + spacing)
        const posY = y * (chipSize + spacing)
        const distFromCenter = Math.sqrt(posX * posX + posY * posY)

        // Only place chips within the wafer circle
        if (distFromCenter < waferRadius - chipSize) {
          newChips.push({
            position: [posX, posY, 0] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
          })
        }
      }
    }

    setChips(newChips)
  }, [])

  // Animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Base wafer */}
      <mesh ref={meshRef} position={[0, 0, -0.1]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.1, 64]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} emissive="#003" emissiveIntensity={0.2} />
      </mesh>

      {/* Chips */}
      {chips.map((chip, i) => (
        <Chip key={i} position={chip.position} rotation={chip.rotation} exploded={exploded} index={i} />
      ))}
    </group>
  )
}

// Individual Chip Component
function Chip({
  position,
  rotation,
  exploded,
  index,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  exploded: boolean
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [originalPosition] = useState(position)

  // Animation
  useFrame((state, delta) => {
    if (!meshRef.current) return

    if (exploded) {
      // Explode outward
      const direction = new THREE.Vector3(originalPosition[0], originalPosition[1], originalPosition[2]).normalize()

      meshRef.current.position.x = originalPosition[0] + direction.x * 10
      meshRef.current.position.y = originalPosition[1] + direction.y * 10
      meshRef.current.position.z = originalPosition[2] + direction.z * 5

      // Random rotation
      meshRef.current.rotation.x += delta * ((index % 3) - 1)
      meshRef.current.rotation.y += delta * ((index % 2) - 0.5)
      meshRef.current.rotation.z += delta * ((index % 4) - 2)
    } else {
      // Return to original position
      meshRef.current.position.x = originalPosition[0]
      meshRef.current.position.y = originalPosition[1]
      meshRef.current.position.z = originalPosition[2]

      // Reset rotation
      meshRef.current.rotation.x = rotation[0]
      meshRef.current.rotation.y = rotation[1]
      meshRef.current.rotation.z = rotation[2]
    }

    // Hover effect
    if (hovered) {
      meshRef.current.scale.set(1.2, 1.2, 1.2)
    } else {
      meshRef.current.scale.set(1, 1, 1)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.4, 0.4, 0.05]} />
      <meshStandardMaterial
        color={hovered ? "#00ffff" : "#444"}
        metalness={0.7}
        roughness={0.3}
        emissive={hovered ? "#00ffff" : "#003366"}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
    </mesh>
  )
}

// Scene Component
function Scene() {
  const [exploded, setExploded] = useState(false)
  const controlsRef = useRef<any>(null)

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={7}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />

      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />

      <Wafer exploded={exploded} />

      {/* Interaction plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={() => setExploded(!exploded)} visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  )
}

// Main Component
export default function SiliconWafer() {
  return (
    <div className="absolute inset-0">
      <Canvas shadows>
        <Scene />
      </Canvas>

      <div className="absolute bottom-4 left-4 text-xs text-cyan-400 opacity-50">
        Click to explode | Drag to rotate | Scroll to zoom
      </div>
    </div>
  )
}
