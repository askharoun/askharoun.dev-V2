"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"

interface ScrollSectionProps {
  id: string
  title: string
  subtitle: string
  children: React.ReactNode
  quote?: {
    text: string
    author: string
  }
  className?: string
}

export default function ScrollSection({ id, title, subtitle, children, quote, className = "" }: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 }) // Reduced threshold to trigger earlier
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <section id={id} ref={ref} className="min-h-screen py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`text-center mb-16 pt-10 pb-4 ${className}`} // Added padding to ensure visibility
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            {title}
          </h2>
          {subtitle && <p className="text-xl text-cyan-300">{subtitle}</p>}
        </motion.div>

        {quote && (
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 },
            }}
            initial="hidden"
            animate={controls}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <blockquote className="italic text-xl md:text-2xl text-cyan-200">
              "{quote.text}"{quote.author && <footer className="mt-2 text-sm text-cyan-400">— {quote.author}</footer>}
            </blockquote>
          </motion.div>
        )}

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
