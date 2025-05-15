"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import ScrollSection from "@/components/scroll-section"
import ProjectCard from "@/components/project-card"
import GamesVault from "@/components/games-vault"
import { FileDown } from "lucide-react"
import ExperienceTimeline from "@/components/experience-timeline"

// Dynamic imports for better performance
const ParallaxEffect = dynamic(() => import("@/components/parallax-effect"), {
  ssr: false,
})

const CyberBackground = dynamic(() => import("@/components/cyber-background"), {
  ssr: false,
})

// Update the import for the contact section components
import ContactForm from "@/components/contact-form"
import SocialLinks from "@/components/social-links"
import InteractiveAbout from "@/components/interactive-about"

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null)

  // Scroll to content
  const scrollToContent = () => {
    mainRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Silicon Wafer Landing Scene */}
      <div className="h-screen relative overflow-hidden">
        {/* Replace the ImprovedSiliconWafer component with this background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20"></div>
          <CyberBackground />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Thomas Askharoun
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-cyan-300 font-light">
              Electrical Engineering Student @ Penn State
            </p>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-0 right-0 z-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <button onClick={scrollToContent} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            <span className="text-sm">Scroll to explore</span>
          </button>
        </motion.div>
      </div>

      {/* Main Content */}
      <main ref={mainRef} className="relative z-20">
        {/* About Section */}
        <ScrollSection id="about" title="About Me" subtitle="The human behind the interface">
          <InteractiveAbout />
        </ScrollSection>

        {/* Projects Section */}
        <ScrollSection
          id="projects"
          title="Projects"
          subtitle=""
          quote={{
            text: "Turning caffeine into finished builds.",
            author: "",
          }}
          className="font-sans" // Ensure proper font rendering for the letter "j"
        >
          <div className="max-w-7xl mx-auto px-4 rounded-xl border border-cyan-500/20 bg-black/30 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ParallaxEffect>
                <ProjectCard
                  title="Neural Interface"
                  description="A direct brain-computer interface using quantum entanglement principles."
                  image="/placeholder.svg?height=300&width=400"
                  link="#"
                />
              </ParallaxEffect>

              <ParallaxEffect>
                <ProjectCard
                  title="Quantum Compiler"
                  description="Translating classical algorithms into quantum-ready instructions."
                  image="/placeholder.svg?height=300&width=400"
                  link="#"
                />
              </ParallaxEffect>

              <ParallaxEffect>
                <ProjectCard
                  title="Digital Consciousness"
                  description="Exploring the boundaries between artificial and human intelligence."
                  image="/placeholder.svg?height=300&width=400"
                  link="#"
                />
              </ParallaxEffect>
            </div>
          </div>
        </ScrollSection>

        {/* Experience Section */}
        <ScrollSection id="experience" title="Experience">
          <div className="max-w-5xl mx-auto px-4">
            <ExperienceTimeline />
          </div>
        </ScrollSection>

        {/* Contact Section */}
        <ScrollSection id="contact" title="Contact" subtitle="">
          <div className="flex flex-col gap-8 max-w-4xl mx-auto px-4">
            <ContactForm />
            <SocialLinks />
          </div>
        </ScrollSection>

        {/* Hidden Games Vault */}
        <GamesVault />
        {/* Footer */}
        <footer className="relative z-20 mt-20 border-t border-cyan-900/30 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">askharoun.dev</h3>
                <p className="text-sm text-cyan-200/70">Electrical Engineering Student @ Penn State</p>
                <p className="text-sm text-cyan-200/70 mt-2">&copy; {new Date().getFullYear()} All rights reserved.</p>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <a
                    href="#"
                    download="Thomas_Askharoun_Resume.pdf"
                    className="group relative px-6 py-3 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    {/* Background animation */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>

                    {/* Text and icon */}
                    <span className="relative flex items-center">
                      PDF Résumé
                      <FileDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
                    </span>
                  </a>
                  <span className="text-[10px] text-cyan-500/40 mt-1 font-mono">est. 2005</span>
                </div>
              </div>

              <div className="md:text-right">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-cyan-200/70">
                    <span className="block">Email: contact@example.com</span>
                  </li>
                  <li className="text-sm text-cyan-200/70">
                    <span className="block">Phone: +1 (123) 456-7890</span>
                  </li>
                  <li className="text-sm text-cyan-200/70">
                    <span className="block">University Park, PA</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-cyan-900/30 text-center">
              <p className="text-xs text-cyan-200/50">
                This site was designed with the future in mind. All trademarks and registered trademarks are the
                property of their respective owners.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
