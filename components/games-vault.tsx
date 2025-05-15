"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Check, Info, Settings } from "lucide-react"
import GlassmorphicPanel from "./glassmorphic-panel"
import SnakeGame from "./snake-game"
import TetrisGame from "./tetris-game"
import CarRacingGame from "./car-racing-game"

// Game data
const games = [
  {
    id: 1,
    name: "Snake",
    component: SnakeGame,
    description: "Navigate the snake to collect food while avoiding walls and your own tail.",
    controls: "Arrow keys or WASD to move, Space to pause, R to reset",
  },
  {
    id: 2,
    name: "Tetris",
    component: TetrisGame,
    description: "Arrange falling blocks to create complete lines that clear from the board.",
    controls: "Arrow keys or WASD to move/rotate, D for hard drop, Space to pause, R to reset",
  },
  {
    id: 3,
    name: "Car Racing",
    component: CarRacingGame,
    description: "Dodge oncoming traffic and survive as long as possible.",
    controls: "Left/Right arrows or A/D to move, Space to pause, R to reset",
  },
]

export default function GamesVault() {
  const [isNavVisible, setIsNavVisible] = useState(false)
  const [isVaultOpen, setIsVaultOpen] = useState(false)
  const [isPasscodeCorrect, setIsPasscodeCorrect] = useState(false)
  const [selectedGame, setSelectedGame] = useState<(typeof games)[0] | null>(null)
  const [passcodeDigits, setPasscodeDigits] = useState<string[]>(["", "", "", ""])
  const [activeDigit, setActiveDigit] = useState(0)
  const [showGameInfo, setShowGameInfo] = useState(false)
  const correctPasscode = "2005"
  const gameContainerRef = useRef<HTMLDivElement>(null)

  // Show nav item after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNavVisible(true)
    }, 10000) // Show after 10 seconds

    return () => clearTimeout(timer)
  }, [])

  // Handle passcode input
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) return

    const newPasscodeDigits = [...passcodeDigits]
    newPasscodeDigits[index] = value
    setPasscodeDigits(newPasscodeDigits)

    // Move to next input if value is entered
    if (value && index < 3) {
      setActiveDigit(index + 1)
    }

    // Check if passcode is complete and correct
    const newPasscode = newPasscodeDigits.join("")
    if (newPasscode.length === 4 && newPasscode === correctPasscode) {
      setIsPasscodeCorrect(true)
    }
  }

  // Handle backspace
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Prevent arrow keys from scrolling the page when games are active
    if (e.key.startsWith("Arrow")) {
      e.preventDefault()
    }
    if (e.key === "Backspace" && !passcodeDigits[index] && index > 0) {
      setActiveDigit(index - 1)
    }
  }

  // Handle game selection
  const openGame = (game: (typeof games)[0]) => {
    setSelectedGame(game)
    setShowGameInfo(false)
  }

  // Close game
  const closeGame = () => {
    setSelectedGame(null)
  }

  // Reset passcode
  const resetPasscode = () => {
    setPasscodeDigits(["", "", "", ""])
    setActiveDigit(0)
    setIsPasscodeCorrect(false)
  }

  // Toggle game info
  const toggleGameInfo = () => {
    setShowGameInfo(!showGameInfo)
  }

  return (
    <>
      {/* Hidden Games Button - More subtle and hidden */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            whileHover={{ opacity: 0.8 }}
            className="fixed bottom-4 right-4 z-50 mix-blend-screen"
          >
            <motion.button
              onClick={() => setIsVaultOpen(true)}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Subtle circuit pattern */}
              <svg className="absolute inset-0 w-8 h-8 opacity-60" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" stroke="#00ffff" strokeWidth="0.5" fill="none" opacity="0.2" />
                <circle cx="20" cy="20" r="12" stroke="#00ffff" strokeWidth="0.5" fill="none" opacity="0.2" />
                <path
                  d="M20,2 L20,8 M2,20 L8,20 M20,38 L20,32 M38,20 L32,20"
                  stroke="#00ffff"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </svg>

              {/* Almost invisible button */}
              <div className="w-8 h-8 rounded-full bg-transparent border border-cyan-500/10 flex items-center justify-center overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-cyan-500/30"></div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vault Modal */}
      <AnimatePresence>
        {isVaultOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md"
            >
              <GlassmorphicPanel className="p-6">
                <button
                  onClick={() => {
                    setIsVaultOpen(false)
                    resetPasscode()
                  }}
                  className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                  <span className="sr-only">Close</span>
                </button>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-900 to-blue-900 border border-cyan-500/50 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-cyan-300">Hidden Arcade</h2>
                  <p className="text-cyan-200/80 mt-2">Enter passcode to access</p>
                  <p className="text-xs text-cyan-400/60 mt-1">
                    Hint: Check below my résumé for the year I was established
                  </p>
                </div>

                {!isPasscodeCorrect ? (
                  <div className="space-y-6">
                    <div className="flex justify-center space-x-3">
                      {passcodeDigits.map((digit, index) => (
                        <div key={index} className="relative">
                          <input
                            type="text"
                            value={digit}
                            onChange={(e) => handleDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={() => setActiveDigit(index)}
                            autoFocus={index === activeDigit}
                            maxLength={1}
                            className={`w-14 h-16 text-center text-2xl rounded-lg 
                              ${digit ? "bg-cyan-900/50" : "bg-black/50"} 
                              ${index === activeDigit ? "border-2 border-cyan-400" : "border border-cyan-500/30"} 
                              text-white focus:outline-none transition-all duration-200`}
                          />
                          <div
                            className={`absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 transform transition-transform duration-300 ${
                              digit ? "scale-x-100" : "scale-x-0"
                            }`}
                          ></div>
                        </div>
                      ))}
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            if (activeDigit < 4) {
                              handleDigitChange(activeDigit, num.toString())
                            }
                          }}
                          className={`w-full py-3 rounded-lg 
                            ${num === 0 ? "col-start-2" : ""} 
                            bg-gradient-to-br from-cyan-900/50 to-blue-900/50 
                            hover:from-cyan-800/50 hover:to-blue-800/50 
                            border border-cyan-500/20 text-cyan-300 text-xl font-mono
                            transition-colors shadow-md hover:shadow-cyan-500/20`}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        onClick={resetPasscode}
                        className="col-start-3 row-start-4 w-full py-3 rounded-lg bg-red-900/50 border border-red-500/20 text-red-300 hover:bg-red-800/50 transition-colors"
                      >
                        <X className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-900/30 to-green-700/30 border border-green-500/50 flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-400" />
                      </div>
                    </div>

                    <h3 className="text-xl text-center font-bold text-cyan-300 mb-4">Access Granted</h3>
                    <p className="text-center text-cyan-200/70 text-sm mb-4">Select a game to play</p>
                    <p className="text-center text-cyan-200/70 text-xs mb-6">
                      Use keyboard controls only: Arrow keys or WASD
                    </p>

                    <div className="space-y-3">
                      {games.map((game) => (
                        <motion.button
                          key={game.id}
                          onClick={() => game.component && openGame(game)}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-4 rounded-lg bg-gradient-to-br from-cyan-900/40 to-blue-900/40 hover:from-cyan-800/40 hover:to-blue-800/40 text-cyan-300 border border-cyan-500/20 transition-all duration-200 flex items-center justify-between group"
                        >
                          <span className="font-medium">{game.name}</span>
                          <span className="text-xs text-cyan-500/50 group-hover:text-cyan-400 transition-colors">
                            Keyboard only
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </GlassmorphicPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Modal - Simplified with no on-screen controls */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center p-8"
            >
              {/* Minimal game container */}
              <div ref={gameContainerRef} className="relative w-full max-w-4xl h-auto max-h-[90vh] overflow-hidden">
                {/* Minimal top bar */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent">
                  <h3 className="text-lg font-bold text-cyan-300">{selectedGame.name}</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleGameInfo}
                      className="p-2 rounded-full bg-black/30 border border-cyan-500/20 text-cyan-400/50 hover:text-cyan-400 transition-colors"
                    >
                      {showGameInfo ? <Settings className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={closeGame}
                      className="p-2 rounded-full bg-black/30 border border-red-500/20 text-red-400/50 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <GlassmorphicPanel className="w-full h-full pt-14 pb-4 px-4">
                  <AnimatePresence mode="wait">
                    {showGameInfo ? (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full flex flex-col items-center justify-center p-4"
                      >
                        <h3 className="text-xl font-bold text-cyan-300 mb-4">{selectedGame.name}</h3>

                        <div className="bg-black/30 rounded-lg border border-cyan-500/20 p-4 mb-6 w-full max-w-md">
                          <h4 className="text-cyan-400 font-medium mb-2 flex items-center">
                            <Info className="w-4 h-4 mr-2" />
                            Description
                          </h4>
                          <p className="text-cyan-200/80 mb-4">{selectedGame.description}</p>

                          <h4 className="text-cyan-400 font-medium mb-2 flex items-center">
                            <Settings className="w-4 h-4 mr-2" />
                            Controls
                          </h4>
                          <p className="text-cyan-200/80">{selectedGame.controls}</p>
                        </div>

                        <button
                          onClick={toggleGameInfo}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:from-cyan-500 hover:to-blue-500 transition-colors"
                        >
                          Back to Game
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="game"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="h-full w-full flex items-center justify-center overflow-visible"
                      >
                        <div className="bg-black/50 p-6 rounded-lg border border-cyan-500/20 shadow-[0_0_25px_rgba(0,255,255,0.2)] overflow-visible w-full max-w-full h-auto flex items-center justify-center">
                          <div className="w-full h-full scale-100 transform-gpu">
                            {selectedGame.component && <selectedGame.component hideControls={true} />}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassmorphicPanel>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
