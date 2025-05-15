"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Github, Instagram, Linkedin, Mail, Phone } from "lucide-react"
import GlassmorphicPanel from "./glassmorphic-panel"

interface SocialLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  delay: number
}

const SocialLink = ({ href, icon, label, delay }: SocialLinkProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center group"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center transition-all duration-300 relative">
        {/* Icon */}
        <div className="transition-all duration-300 group-hover:scale-110 group-hover:text-white">{icon}</div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cyan-400 blur-md -z-10"></div>
      </div>
      <span className="mt-2 text-sm text-cyan-300 transition-colors duration-300 group-hover:text-cyan-100">
        {label}
      </span>

      {/* Custom styles for fast return animation */}
      <style jsx>{`
        .group {
          transition-duration: 0.3s;
        }
        .group:not(:hover) {
          transition-duration: 0.1s;
        }
      `}</style>
    </motion.a>
  )
}

export default function SocialLinks() {
  // Social links in the requested order: LinkedIn, Instagram, GitHub, Email, Phone
  const socialLinks = [
    {
      href: "https://linkedin.com/",
      icon: <Linkedin className="w-6 h-6 text-white" />,
      label: "LinkedIn",
    },
    {
      href: "https://instagram.com/",
      icon: <Instagram className="w-6 h-6 text-white" />,
      label: "Instagram",
    },
    {
      href: "https://github.com/",
      icon: <Github className="w-6 h-6 text-white" />,
      label: "GitHub",
    },
    {
      href: "mailto:contact@example.com",
      icon: <Mail className="w-6 h-6 text-white" />,
      label: "Email",
    },
    {
      href: "tel:+1234567890",
      icon: <Phone className="w-6 h-6 text-white" />,
      label: "Phone",
    },
  ]

  return (
    <GlassmorphicPanel className="w-full mx-auto">
      <div className="p-4">
        <h3 className="text-lg text-center font-bold text-cyan-300 mb-4">Connect with me</h3>

        <div className="flex flex-wrap justify-center gap-6">
          {socialLinks.map((link, index) => (
            <SocialLink key={link.label} href={link.href} icon={link.icon} label={link.label} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </GlassmorphicPanel>
  )
}
