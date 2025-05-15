"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface ParallaxEffectProps {
  children: ReactNode
}

export default function ParallaxEffect({ children }: ParallaxEffectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  // Motion values for tracking mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth out the mouse movement
  const springConfig = { damping: 20, stiffness: 300 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Transform mouse position to rotation values
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate normalized mouse position (-0.5 to 0.5)
    const normalizedX = (e.clientX - centerX) / rect.width
    const normalizedY = (e.clientY - centerY) / rect.height

    mouseX.set(normalizedX)
    mouseY.set(normalizedY)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
      className="relative"
    >
      <motion.div
        style={{
          rotateX: hovered ? rotateX : 0,
          rotateY: hovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
        className="w-full h-full"
      >
        {children}

        {/* Shine effect */}
        {hovered && (
          <motion.div
            style={{
              opacity: 0.4,
              background: "linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              transformStyle: "preserve-3d",
              rotateX: rotateX,
              rotateY: rotateY,
            }}
            className="rounded-xl"
          />
        )}
      </motion.div>
    </motion.div>
  )
}
