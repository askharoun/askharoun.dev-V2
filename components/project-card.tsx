"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import GlassmorphicPanel from "./glassmorphic-panel"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  link: string
}

export default function ProjectCard({ title, description, image, link }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Track if this is the first render to prevent animation on load
  const isFirstRender = useRef(true)

  useEffect(() => {
    isFirstRender.current = false
  }, [])

  // Handle hover state with smooth transitions
  const handleMouseEnter = () => {
    setHovered(true)
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  // Generate random circuit paths for the hover effect
  const generateCircuitPaths = () => {
    const paths = []
    const pathCount = 5 + Math.floor(Math.random() * 5)

    for (let i = 0; i < pathCount; i++) {
      const startX = Math.random() * 100
      const startY = Math.random() * 100
      const endX = Math.random() * 100
      const endY = Math.random() * 100
      const midX1 = (startX + endX) / 2 + (Math.random() - 0.5) * 30
      const midY1 = (startY + endY) / 2 + (Math.random() - 0.5) * 30

      paths.push({
        d: `M${startX},${startY} Q${midX1},${midY1} ${endX},${endY}`,
        delay: Math.random() * 0.5,
        duration: Math.random() * 1 + 0.5,
      })
    }

    return paths
  }

  const circuitPaths = useRef(generateCircuitPaths())

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      whileHover={{
        y: -10,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={link}>
        <GlassmorphicPanel
          className="h-full transition-all duration-500 relative overflow-hidden transform-gpu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Enhanced hover effect with overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 z-10 pointer-events-none"
            style={{
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* Animated border effect */}
          <div
            className="absolute inset-0 border border-cyan-400/0 rounded-xl transition-all duration-500 z-20 pointer-events-none"
            style={{
              borderColor: hovered ? "rgba(34, 211, 238, 0.3)" : "rgba(34, 211, 238, 0)",
              boxShadow: hovered ? "0 0 15px 2px rgba(34, 211, 238, 0.2)" : "none",
            }}
          />

          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0"
              style={{
                opacity: hovered ? 0.3 : 0,
                transition: "opacity 0.5s ease-in-out",
              }}
            >
              {circuitPaths.current.map((path, index) => (
                <motion.path
                  key={index}
                  d={path.d}
                  stroke="#00ffff"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    hovered
                      ? {
                          pathLength: 1,
                          opacity: 1,
                          transition: {
                            pathLength: { delay: path.delay, duration: path.duration, ease: "easeInOut" },
                            opacity: { delay: path.delay, duration: 0.2 },
                          },
                        }
                      : {
                          pathLength: 0,
                          opacity: 0,
                          transition: {
                            pathLength: { duration: 0.4 },
                            opacity: { duration: 0.2 },
                          },
                        }
                  }
                />
              ))}

              {/* Add circuit nodes */}
              {[...Array(8)].map((_, i) => (
                <motion.circle
                  key={`node-${i}`}
                  cx={`${Math.random() * 100}%`}
                  cy={`${Math.random() * 100}%`}
                  r="3"
                  fill="#00ffff"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    hovered
                      ? {
                          scale: [0, 1.5, 1],
                          opacity: [0, 1, 0.7],
                          transition: {
                            delay: Math.random() * 0.3,
                            duration: 0.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          },
                        }
                      : { scale: 0, opacity: 0, transition: { duration: 0.2 } }
                  }
                />
              ))}
            </svg>
          </div>

          <div ref={imageRef} className="relative overflow-hidden rounded-t-xl">
            <div
              className="w-full h-48 bg-cover bg-center transition-transform"
              style={{
                backgroundImage: `url(${image || "/placeholder.svg"})`,
                transform: hovered ? "scale(1.12)" : "scale(1)",
                transition: isFirstRender.current ? "none" : "transform 0.7s cubic-bezier(0.19, 1, 0.22, 1)",
              }}
            />

            {/* Animated gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-opacity duration-500"
              style={{
                opacity: hovered ? 0.9 : 1,
              }}
            />

            {/* Glitch effect on hover */}
            {hovered && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="glitch-effect"></div>
              </div>
            )}

            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white relative z-10">
                {title}
                {hovered && (
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </h3>
            </motion.div>
          </div>

          <div className="p-4 relative z-10">
            <p className="text-cyan-100">{description}</p>

            <div className="mt-4 flex justify-end overflow-hidden pr-1">
              <span
                className="text-sm text-cyan-400 flex items-center transition-all duration-300"
                style={{
                  transform: hovered ? "translateX(2px)" : "translateX(0)",
                }}
              >
                Explore
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 transition-transform duration-300"
                  style={{
                    transform: hovered ? "translateX(1px)" : "translateX(0)",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </div>

          {/* Energy pulse effect */}
          {hovered && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="energy-pulse"></div>
            </div>
          )}

          {/* Particle effect on hover */}
          {hovered && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-cyan-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.3,
                    transform: `scale(${Math.random() * 2 + 1})`,
                    boxShadow: "0 0 10px 2px rgba(34, 211, 238, 0.3)",
                    animation: `float-particle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Custom animations */}
          <style jsx>{`
            @keyframes float-particle {
              0%, 100% {
                transform: translateY(0) scale(1);
              }
              50% {
                transform: translateY(-20px) scale(1.5);
                opacity: 0.2;
              }
            }
            
            .energy-pulse {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 10px;
              height: 10px;
              background: rgba(0, 255, 255, 0.8);
              border-radius: 50%;
              transform: translate(-50%, -50%);
              box-shadow: 0 0 20px 10px rgba(0, 255, 255, 0.5);
              animation: pulse 2s ease-out infinite;
            }
            
            @keyframes pulse {
              0% {
                transform: translate(-50%, -50%) scale(0.1);
                opacity: 1;
              }
              100% {
                transform: translate(-50%, -50%) scale(5);
                opacity: 0;
              }
            }
            
            .glitch-effect {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: url(${image || "/placeholder.svg"}) center/cover;
              opacity: 0.2;
              animation: glitch 0.5s infinite;
            }
            
            @keyframes glitch {
              0% {
                transform: translate(0);
                filter: hue-rotate(0deg);
              }
              10% {
                transform: translate(-2px, 2px);
                filter: hue-rotate(90deg);
              }
              20% {
                transform: translate(2px, -2px);
                filter: hue-rotate(180deg);
              }
              30% {
                transform: translate(-2px, -2px);
                filter: hue-rotate(270deg);
              }
              40% {
                transform: translate(2px, 2px);
                filter: hue-rotate(360deg);
              }
              50% {
                transform: translate(0);
                filter: hue-rotate(0deg);
              }
              100% {
                transform: translate(0);
                filter: hue-rotate(0deg);
              }
            }
          `}</style>
        </GlassmorphicPanel>
      </Link>

      {/* Hover effect that extends outside the card */}
      {hovered && (
        <div className="absolute -inset-4 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 animate-pulse pointer-events-none" />
      )}
    </motion.div>
  )
}
