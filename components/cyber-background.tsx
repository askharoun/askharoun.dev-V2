"use client"

import { useEffect, useRef } from "react"

export default function CyberBackground() {
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

    // Grid properties
    const gridSize = 40
    const lineWidth = 1
    const primaryColor = "#00ffff"
    const secondaryColor = "#0066ff"

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = Math.random() > 0.5 ? primaryColor : secondaryColor
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
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

    // Create particles
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000))
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return

      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.lineWidth = lineWidth
      ctx.shadowBlur = 0

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)

        // Gradient for lines
        const gradient = ctx.createLinearGradient(0, y, canvas.width, y)
        gradient.addColorStop(0, "rgba(0, 102, 255, 0.1)")
        gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.2)")
        gradient.addColorStop(1, "rgba(0, 102, 255, 0.1)")

        ctx.strokeStyle = gradient
        ctx.stroke()
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)

        // Gradient for lines
        const gradient = ctx.createLinearGradient(x, 0, x, canvas.height)
        gradient.addColorStop(0, "rgba(0, 102, 255, 0.1)")
        gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.2)")
        gradient.addColorStop(1, "rgba(0, 102, 255, 0.1)")

        ctx.strokeStyle = gradient
        ctx.stroke()
      }

      // Draw and update particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections between nearby particles
      ctx.shadowBlur = 0
      particles.forEach((particleA, indexA) => {
        for (let indexB = indexA + 1; indexB < particles.length; indexB++) {
          const particleB = particles[indexB]
          const dx = particleA.x - particleB.x
          const dy = particleA.y - particleB.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particleA.x, particleA.y)
            ctx.lineTo(particleB.x, particleB.y)

            // Opacity based on distance
            const opacity = 1 - distance / 150
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.2})`
            ctx.stroke()
          }
        }
      })

      // Add some random data points that appear and disappear
      if (Math.random() > 0.95) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 3 + 1

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = Math.random() > 0.5 ? primaryColor : secondaryColor
        ctx.fill()

        // Add pulse effect
        ctx.beginPath()
        ctx.arc(x, y, size * 2, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 255, 255, 0.5)`
        ctx.stroke()
      }

      animationId = requestAnimationFrame(animate)
    }

    let animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}
