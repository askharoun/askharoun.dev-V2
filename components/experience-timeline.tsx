"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import GlassmorphicPanel from "./glassmorphic-panel"
import { Calendar, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

// Experience data
const experiences = [
  {
    id: 1,
    title: "Electrical Engineering Intern",
    company: "Quantum Innovations",
    location: "San Francisco, CA",
    period: "May 2024 - Present",
    description: [
      "Developing advanced circuit designs for next-generation quantum computing interfaces",
      "Collaborating with cross-functional teams to optimize power consumption in experimental hardware",
      "Implementing signal processing algorithms for noise reduction in quantum measurements",
      "Assisting in the development of testing protocols for quantum circuit components",
    ],
    technologies: ["Circuit Design", "Signal Processing", "Quantum Computing", "FPGA Programming"],
    link: "#",
  },
  {
    id: 2,
    title: "Research Assistant",
    company: "Penn State Electrical Engineering Department",
    location: "University Park, PA",
    period: "Jan 2023 - May 2024",
    description: [
      "Conducted research on novel microcontroller architectures for IoT applications",
      "Designed and implemented experimental PCB layouts for testing new sensor configurations",
      "Analyzed performance data and contributed to two published research papers",
      "Mentored undergraduate students in circuit design and embedded systems programming",
    ],
    technologies: ["PCB Design", "Embedded Systems", "Data Analysis", "Technical Writing"],
    link: "#",
  },
  {
    id: 3,
    title: "Technical Project Lead",
    company: "Engineering Student Society",
    location: "University Park, PA",
    period: "Sep 2022 - Dec 2023",
    description: [
      "Led a team of 5 students in designing and building an autonomous robot for campus competitions",
      "Managed project timeline, resource allocation, and technical documentation",
      "Implemented sensor fusion algorithms for improved navigation accuracy",
      "Presented project progress and results to faculty advisors and potential sponsors",
    ],
    technologies: ["Project Management", "Robotics", "Sensor Integration", "Team Leadership"],
    link: "#",
  },
]

interface ExperienceCardProps {
  experience: (typeof experiences)[0]
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <GlassmorphicPanel className="mb-6 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-cyan-300">{experience.title}</h3>
            <p className="text-lg text-cyan-100 mt-1">{experience.company}</p>
            <div className="flex items-center text-cyan-400/70 text-sm mt-2">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{experience.period}</span>
              <span className="mx-2">•</span>
              <span>{experience.location}</span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-cyan-900/30 hover:bg-cyan-800/40 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-cyan-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-cyan-400" />
            )}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : "0px", opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 space-y-4">
            <ul className="space-y-2">
              {experience.description.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-cyan-400 mr-2 mt-1">•</span>
                  <span className="text-cyan-100/90">{item}</span>
                </li>
              ))}
            </ul>

            <div>
              <h4 className="text-sm font-semibold text-cyan-400 mb-2">Technologies & Skills</h4>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-900/30 text-cyan-300 text-xs rounded-full border border-cyan-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {experience.link && (
              <div className="pt-2">
                <a
                  href={experience.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View more details
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </GlassmorphicPanel>
  )
}

export default function ExperienceTimeline() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-400/30 to-transparent"></div>

      <div className="space-y-8">
        {experiences.map((experience, index) => (
          <div key={experience.id} className="flex">
            <div className="relative mr-6 pt-6">
              <div className="absolute left-0 top-0 w-16 h-16 flex items-center justify-center">
                <div className="absolute w-6 h-6 rounded-full bg-cyan-900/50 border-2 border-cyan-400"></div>
                <div className="absolute w-12 h-12 rounded-full bg-cyan-500/5 animate-pulse-slow"></div>
              </div>
              <div className="absolute top-8 left-3 bottom-0 w-px bg-gradient-to-b from-cyan-400/50 to-transparent"></div>
            </div>
            <div className="flex-1 pt-6">
              <ExperienceCard experience={experience} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
