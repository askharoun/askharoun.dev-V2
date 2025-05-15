"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GlassmorphicPanelProps {
  children: ReactNode
  className?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function GlassmorphicPanel({
  children,
  className = "",
  onMouseEnter,
  onMouseLeave,
}: GlassmorphicPanelProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-md border border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Glassmorphic shine effect */}
      <div className="absolute -inset-[500px] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none group-hover:animate-shine" />

      {/* Inner glow */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
      </div>

      {children}
    </motion.div>
  )
}
