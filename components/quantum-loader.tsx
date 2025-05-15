"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function QuantumLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Quantum packet class
    class QuantumPacket {
      x: number
      y: number
      size: number
      color: string
      speed: number
      angle: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, ${Math.random() * 30 + 50}%)`
        this.speed = Math.random() * 1.5 + 0.5
        this.angle = Math.random() * Math.PI * 2
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) {
          this.angle = Math.PI - this.angle
          this.x = Math.max(0, Math.min(this.x, canvas.width))
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.angle = -this.angle
          this.y = Math.max(0, Math.min(this.y, canvas.height))
        }
      }

      draw() {
        if (!ctx) return

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Add glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color
      }
    }

    // Create quantum packets
    const packetCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000))
    const packets: QuantumPacket[] = []

    for (let i = 0; i < packetCount; i++) {
      packets.push(new QuantumPacket())
    }

    // Matrix-like characters
    const characters = "01"
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return

      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw matrix rain
      ctx.fillStyle = "#0fa"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i += 2) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }

      // Draw quantum packets
      ctx.shadowBlur = 0
      for (const packet of packets) {
        packet.update()
        packet.draw()
      }

      // Draw connections between nearby packets
      ctx.strokeStyle = "rgba(0, 255, 255, 0.1)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < packets.length; i += 2) {
        for (let j = i + 1; j < packets.length; j += 2) {
          const dx = packets[i].x - packets[j].x
          const dy = packets[i].y - packets[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(packets[i].x, packets[i].y)
            ctx.lineTo(packets[j].x, packets[j].y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    let animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            transition: {
              duration: 2.5,
              times: [0, 0.2, 0.8, 1],
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 0.3,
            },
          }}
          className="text-cyan-400 text-2xl font-mono"
        >
          INITIALIZING SYSTEM
        </motion.div>
      </div>
    </div>
  )
}
