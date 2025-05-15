"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// Game constants
const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const INITIAL_SPEED = 150 // ms
const SPEED_INCREMENT = 5 // ms

interface SnakeGameProps {
  hideControls?: boolean
}

export default function SnakeGame({ hideControls = false }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [highScore, setHighScore] = useState(0)

  // Game loop ref to prevent stale closures
  const gameStateRef = useRef({
    snake: INITIAL_SNAKE,
    direction: INITIAL_DIRECTION,
    food: { x: 15, y: 15 },
    gameOver: false,
    isPaused: false,
    speed: INITIAL_SPEED,
  })

  // Update ref when state changes
  useEffect(() => {
    gameStateRef.current = {
      snake,
      direction,
      food,
      gameOver,
      isPaused,
      speed,
    }
  }, [snake, direction, food, gameOver, isPaused, speed])

  // Generate random food position
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }

    // Make sure food doesn't spawn on snake
    const isOnSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)

    if (isOnSnake) {
      return generateFood()
    }

    return newFood
  }, [snake])

  // Reset game
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood(generateFood())
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    setSpeed(INITIAL_SPEED)
  }, [generateFood])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent arrow keys from scrolling
      if (e.key.startsWith("Arrow") || e.key === " ") {
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

      // Handle both arrow keys and WASD
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (gameStateRef.current.direction.y !== 1) {
            setDirection({ x: 0, y: -1 })
          }
          break
        case "ArrowDown":
        case "s":
        case "S":
          if (gameStateRef.current.direction.y !== -1) {
            setDirection({ x: 0, y: 1 })
          }
          break
        case "ArrowLeft":
        case "a":
        case "A":
          if (gameStateRef.current.direction.x !== 1) {
            setDirection({ x: -1, y: 0 })
          }
          break
        case "ArrowRight":
        case "d":
        case "D":
          if (gameStateRef.current.direction.x !== -1) {
            setDirection({ x: 1, y: 0 })
          }
          break
        case " ": // Space bar to pause
          setIsPaused((prev) => !prev)
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
    if (gameOver || isPaused) return

    const moveSnake = () => {
      const { snake, direction, food, gameOver, isPaused } = gameStateRef.current

      if (gameOver || isPaused) return

      // Calculate new head position
      const head = snake[0]
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      }

      // Check for collisions with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true)
        return
      }

      // Check for collisions with self
      if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true)
        return
      }

      // Create new snake array
      const newSnake = [newHead, ...snake]

      // Check if snake ate food
      if (newHead.x === food.x && newHead.y === food.y) {
        // Increase score
        const newScore = score + 10
        setScore(newScore)

        // Update high score if needed
        if (newScore > highScore) {
          setHighScore(newScore)
        }

        // Generate new food
        setFood(generateFood())

        // Increase speed
        setSpeed((prev) => Math.max(prev - SPEED_INCREMENT, 50))
      } else {
        // Remove tail if no food was eaten
        newSnake.pop()
      }

      setSnake(newSnake)
    }

    const gameLoop = setInterval(moveSnake, speed)
    return () => clearInterval(gameLoop)
  }, [food, gameOver, generateFood, highScore, isPaused, score, speed])

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#111"
    for (let i = 0; i < GRID_SIZE; i++) {
      // Vertical lines
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, canvas.height)
      ctx.stroke()

      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(canvas.width, i * CELL_SIZE)
      ctx.stroke()
    }

    // Draw food
    ctx.fillStyle = "#ff0066"
    ctx.shadowColor = "#ff0066"
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2)
    ctx.fill()

    // Reset shadow
    ctx.shadowBlur = 0

    // Draw snake
    snake.forEach((segment, index) => {
      // Head has different color
      if (index === 0) {
        ctx.fillStyle = "#00ffff"
        ctx.shadowColor = "#00ffff"
        ctx.shadowBlur = 10
      } else {
        // Gradient from cyan to blue for body
        const ratio = index / snake.length
        const r = 0
        const g = Math.floor(255 * (1 - ratio * 0.7))
        const b = Math.floor(255 * (0.5 + ratio * 0.5))
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.shadowBlur = 0
      }

      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
    })

    // Reset shadow
    ctx.shadowBlur = 0

    // Draw game over overlay
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "bold 24px monospace"
      ctx.fillStyle = "#ff0066"
      ctx.textAlign = "center"
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20)

      ctx.font = "16px monospace"
      ctx.fillStyle = "#00ffff"
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10)
      ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 40)
    }

    // Draw pause overlay
    if (isPaused && !gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "bold 24px monospace"
      ctx.fillStyle = "#00ffff"
      ctx.textAlign = "center"
      ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2)
    }
  }, [food, gameOver, isPaused, score, snake])

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center justify-between w-full">
        <div className="text-cyan-300 font-mono">
          <span className="text-sm">SCORE:</span>
          <span className="text-xl ml-2 text-cyan-400">{score}</span>
        </div>

        <div className="text-cyan-300 font-mono">
          <span className="text-sm">HIGH:</span>
          <span className="text-xl ml-2 text-cyan-400">{highScore}</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border-2 border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.3)]"
        />
      </div>

      {!hideControls && (
        <div className="mt-4 text-xs text-cyan-400 opacity-70">
          <p>Use arrow keys or WASD to move, Space to pause, R to reset</p>
        </div>
      )}
    </div>
  )
}
