"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Cpu, Zap, Code, CircuitBoardIcon as Circuit, Lightbulb, Coffee } from "lucide-react"
import GlassmorphicPanel from "./glassmorphic-panel"

interface SkillCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const SkillCard = ({ icon, title, description }: SkillCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          p-5 rounded-xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 
          border border-cyan-500/20 h-full transition-all duration-500
          ${isHovered ? "shadow-lg shadow-cyan-500/20" : ""}
        `}
      >
        <div className="flex items-center mb-3">
          <div
            className={`
              p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 
              text-cyan-400 transition-all duration-500
              ${isHovered ? "text-cyan-300 scale-110" : ""}
            `}
          >
            {icon}
          </div>
          <h3 className="ml-3 text-lg font-semibold text-cyan-300">{title}</h3>
        </div>
        <p className="text-cyan-100/80 text-sm">{description}</p>

        {/* Animated border on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: isHovered ? "0 0 0 1px rgba(0, 255, 255, 0.3)" : "none",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

export default function InteractiveAbout() {
  const [activeTab, setActiveTab] = useState("skills")

  const skills = [
    {
      icon: <Circuit className="w-5 h-5" />,
      title: "PCB Design",
      description: "Creating custom circuit boards for specialized electronic applications and prototypes.",
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Microcontrollers",
      description: "Programming Arduino, ESP32, and STM32 for IoT and embedded systems projects.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Signal Processing",
      description: "Analyzing and manipulating electrical signals for data acquisition and control systems.",
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Software Development",
      description: "Building applications that bridge the gap between hardware and user interfaces.",
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Quantum Computing",
      description: "Exploring quantum principles and their applications in next-gen electronic systems.",
    },
    {
      icon: <Coffee className="w-5 h-5" />,
      title: "Caffeine Engineering",
      description: "Converting excessive amounts of coffee into functional electronic designs.",
    },
  ]

  return (
    <div className="space-y-8">
      <GlassmorphicPanel className="max-w-4xl mx-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-6">
            <p className="text-lg text-cyan-100">
              I'm an <span className="text-cyan-400 font-semibold">Electrical Engineering student</span> with a passion
              for pushing the boundaries of what's possible. My journey through the quantum realm of circuits and
              systems has led me to explore the fascinating intersection of hardware and software.
            </p>
            <p className="text-lg text-cyan-100">
              By day, I'm decoding the language of electrons, designing circuits that breathe life into silicon. By
              night, I transform into a digital architect, crafting immersive experiences that challenge conventional
              thinking.
            </p>

            {/* Interactive tabs */}
            <div className="pt-4">
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "skills"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-transparent text-cyan-400/70 hover:text-cyan-300"
                  }`}
                >
                  Skills & Expertise
                </button>
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "personal"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-transparent text-cyan-400/70 hover:text-cyan-300"
                  }`}
                >
                  Personal
                </button>
              </div>

              {/* Skills tab content */}
              {activeTab === "skills" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {skills.map((skill, index) => (
                    <SkillCard key={index} {...skill} />
                  ))}
                </motion.div>
              )}

              {/* Personal tab content */}
              {activeTab === "personal" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <p className="text-cyan-100">
                    When I'm not soldering components or debugging code, you might find me reverse-engineering gadgets
                    or contemplating the future of human-machine interfaces over a cup of highly caffeinated tea.
                  </p>

                  <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-4 mt-4">
                    <h4 className="text-cyan-300 font-medium mb-2">Fun Facts:</h4>
                    <ul className="space-y-2 text-cyan-100/80">
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        I've built a robot that makes perfect toast based on humidity levels
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        My desk has more blinking LEDs than a spacecraft control panel
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>I can explain quantum entanglement, but still can't
                        find matching socks
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        I've memorized the resistor color code better than my own phone number
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </GlassmorphicPanel>
    </div>
  )
}
