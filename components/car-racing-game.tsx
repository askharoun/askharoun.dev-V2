"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// Game constants
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const ROAD_WIDTH = 300
const LANE_COUNT = 3
const LANE_WIDTH = ROAD_WIDTH / LANE_COUNT
const CAR_WIDTH = 40
const CAR_HEIGHT = 70
const OBSTACLE_WIDTH = 40
const OBSTACLE_HEIGHT = 70
const INITIAL_SPEED = 5
const SPEED_INCREMENT = 0.0005
const OBSTACLE_SPAWN_RATE = 0.015

interface CarRacingGameProps {
  hideControls?: boolean
}

export default function CarRacingGame({ hideControls = false }: CarRacingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [playerLane, setPlayerLane] = useState(1) // 0, 1, 2 for left, middle, right

  // Game state ref to prevent stale closures
  const gameStateRef = useRef({
    score,
    gameOver,
    isPaused,
    speed,
    playerLane,
    obstacles: [] as { x: number; y: number; lane: number; type: number }[],
    roadOffset: 0,
    animationId: 0,
  })

  // Update ref when state changes
  useEffect(() => {
    gameStateRef.current = {
      ...gameStateRef.current,
      score,
      gameOver,
      isPaused,
      speed,
      playerLane,
    }
  }, [score, gameOver, isPaused, speed, playerLane])

  // Reset game
  const resetGame = useCallback(() => {
    gameStateRef.current.obstacles = []
    gameStateRef.current.roadOffset = 0
    setScore(0)
    setGameOver(false)
    setIsPaused(false)
    setSpeed(INITIAL_SPEED)
    setPlayerLane(1)
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent arrow keys from scrolling
      if (e.key.startsWith("Arrow") || e.key === " " || e.key === "r") {
        e.preventDefault()
      }

      if (gameStateRef.current.gameOver) {
        if (e.key === "r" || e.key === "R") resetGame()
        return
      }

      if (gameStateRef.current.isPaused) {
        if (e.key === " ") setIsPaused(false)
        return
      }

      // Support both arrow keys and WASD
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          if (gameStateRef.current.playerLane > 0) {
            setPlayerLane(gameStateRef.current.playerLane - 1)
          }
          break
        case "ArrowRight":
        case "d":
        case "D":
          if (gameStateRef.current.playerLane < LANE_COUNT - 1) {
            setPlayerLane(gameStateRef.current.playerLane + 1)
          }
          break
        case " ": // Space bar to pause
          setIsPaused(true)
          break
        case "r":
        case "R": // R key to reset
          resetGame()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resetGame])

  // Game loop
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Load images
    const playerCarImg = new Image()
    playerCarImg.src = "/placeholder.svg?height=70&width=40"
    playerCarImg.crossOrigin = "anonymous"

    const obstacleCarImgs = [new Image(), new Image(), new Image()]
    obstacleCarImgs[0].src = "/placeholder.svg?height=70&width=40"
    obstacleCarImgs[1].src = "/placeholder.svg?height=70&width=40"
    obstacleCarImgs[2].src = "/placeholder.svg?height=70&width=40"
    obstacleCarImgs.forEach((img) => (img.crossOrigin = "anonymous"))

    // Animation loop
    const animate = () => {
      if (gameStateRef.current.gameOver || gameStateRef.current.isPaused) {
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update road offset (for moving road effect)
      gameStateRef.current.roadOffset += gameStateRef.current.speed
      if (gameStateRef.current.roadOffset >= 40) {
        gameStateRef.current.roadOffset = 0
      }

      // Draw road
      ctx.fillStyle = "#222"
      ctx.fillRect((canvas.width - ROAD_WIDTH) / 2, 0, ROAD_WIDTH, canvas.height)

      // Draw lane markings
      ctx.strokeStyle = "#ffff00"
      ctx.setLineDash([20, 20])
      ctx.lineWidth = 2

      for (let i = 1; i < LANE_COUNT; i++) {
        const x = (canvas.width - ROAD_WIDTH) / 2 + i * LANE_WIDTH
        ctx.beginPath()
        ctx.moveTo(x, -20 + gameStateRef.current.roadOffset)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw road edges with glow
      ctx.shadowBlur = 10
      ctx.shadowColor = "#00ffff"
      ctx.strokeStyle = "#00ffff"
      ctx.lineWidth = 3
      ctx.setLineDash([])

      // Left edge
      ctx.beginPath()
      ctx.moveTo((canvas.width - ROAD_WIDTH) / 2, 0)
      ctx.lineTo((canvas.width - ROAD_WIDTH) / 2, canvas.height)
      ctx.stroke()

      // Right edge
      ctx.beginPath()
      ctx.moveTo((canvas.width - ROAD_WIDTH) / 2 + ROAD_WIDTH, 0)
      ctx.lineTo((canvas.width - ROAD_WIDTH) / 2 + ROAD_WIDTH, canvas.height)
      ctx.stroke()

      ctx.shadowBlur = 0

      // Spawn obstacles
      if (Math.random() < OBSTACLE_SPAWN_RATE) {
        // Check existing obstacles to avoid impossible situations
        const existingLanes = gameStateRef.current.obstacles
          .filter((obs) => obs.y < 0 || (obs.y < OBSTACLE_HEIGHT * 2 && obs.y > -OBSTACLE_HEIGHT))
          .map((obs) => obs.lane)

        // Find available lanes
        const availableLanes = [0, 1, 2].filter((lane) => !existingLanes.includes(lane))

        // Only spawn if there's at least one available lane
        if (availableLanes.length > 0) {
          const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)]
          const type = Math.floor(Math.random() * 3) // 3 types of obstacle cars
          const x = (canvas.width - ROAD_WIDTH) / 2 + lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_WIDTH) / 2
          const y = -OBSTACLE_HEIGHT

          gameStateRef.current.obstacles.push({ x, y, lane, type })
        }
      }

      // Update and draw obstacles
      const newObstacles = []
      for (const obstacle of gameStateRef.current.obstacles) {
        obstacle.y += gameStateRef.current.speed

        // Draw obstacle
        ctx.shadowBlur = 5
        ctx.shadowColor = "#ff0066"
        ctx.drawImage(obstacleCarImgs[obstacle.type], obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT)
        ctx.shadowBlur = 0

        // Check if obstacle is still on screen
        if (obstacle.y < canvas.height) {
          newObstacles.push(obstacle)
        } else {
          // Increment score when obstacle passes
          setScore((prev) => prev + 1)
        }
      }
      gameStateRef.current.obstacles = newObstacles

      // Draw player car
      const playerX =
        (canvas.width - ROAD_WIDTH) / 2 + gameStateRef.current.playerLane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2
      const playerY = canvas.height - CAR_HEIGHT - 20

      ctx.shadowBlur = 10
      ctx.shadowColor = "#00ffff"
      ctx.drawImage(playerCarImg, playerX, playerY, CAR_WIDTH, CAR_HEIGHT)
      ctx.shadowBlur = 0

      // Check for collisions
      for (const obstacle of gameStateRef.current.obstacles) {
        if (
          playerY < obstacle.y + OBSTACLE_HEIGHT &&
          playerY + CAR_HEIGHT > obstacle.y &&
          playerX < obstacle.x + OBSTACLE_WIDTH &&
          playerX + CAR_WIDTH > obstacle.x
        ) {
          setGameOver(true)
          if (gameStateRef.current.score > highScore) {
            setHighScore(gameStateRef.current.score)
          }
          return
        }
      }

      // Increase speed over time
      setSpeed((prev) => prev + SPEED_INCREMENT)

      // Continue animation
      gameStateRef.current.animationId = requestAnimationFrame(animate)
    }

    // Start animation
    gameStateRef.current.animationId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(gameStateRef.current.animationId)
    }
  }, [highScore, resetGame])

  // Draw game over or paused overlay
  useEffect(() => {
    if (!canvasRef.current) return
    if (!gameOver && !isPaused) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = "bold 24px monospace"
    ctx.textAlign = "center"

    if (gameOver) {
      ctx.fillStyle = "#ff0066"
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20)

      ctx.font = "16px monospace"
      ctx.fillStyle = "#00ffff"
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10)
      ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 40)
    } else if (isPaused) {
      ctx.fillStyle = "#00ffff"
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2)
    }
  }, [gameOver, isPaused, score])

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center justify-between w-full">
        <div className="text-cyan-300 font-mono">
          <div className="text-sm">SCORE:</div>
          <div className="text-xl text-cyan-400">{score}</div>
        </div>

        <div className="text-cyan-300 font-mono">
          <div className="text-sm">SPEED:</div>
          <div className="text-xl text-cyan-400">{Math.floor(speed * 10)}</div>
        </div>

        <div className="text-cyan-300 font-mono">
          <div className="text-sm">HIGH:</div>
          <div className="text-xl text-cyan-400">{highScore}</div>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.3)]"
        />
      </div>

      {!hideControls && (
        <div className="mt-4 text-xs text-cyan-400 opacity-70">
          <p>Left/Right arrows or A/D to move, Space to pause, R to reset</p>
        </div>
      )}
    </div>
  )
}
