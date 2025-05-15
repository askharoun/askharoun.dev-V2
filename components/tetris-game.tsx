"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// Game constants
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 800 // ms
const SPEED_INCREMENT = 50 // ms

// Tetromino shapes
const TETROMINOES = [
  // I
  {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#00ffff",
  },
  // J
  {
    shape: [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0],
    ],
    color: "#0066ff",
  },
  // L
  {
    shape: [
      [0, 0, 3],
      [3, 3, 3],
      [0, 0, 0],
    ],
    color: "#00ccff",
  },
  // O
  {
    shape: [
      [4, 4],
      [4, 4],
    ],
    color: "#00ffaa",
  },
  // S
  {
    shape: [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ],
    color: "#00ff66",
  },
  // T
  {
    shape: [
      [0, 6, 0],
      [6, 6, 6],
      [0, 0, 0],
    ],
    color: "#66ffff",
  },
  // Z
  {
    shape: [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ],
    color: "#ff66ff",
  },
]

interface TetrisGameProps {
  hideControls?: boolean
}

export default function TetrisGame({ hideControls = false }: TetrisGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [board, setBoard] = useState<number[][]>(createEmptyBoard())
  const [currentTetromino, setCurrentTetromino] = useState(getRandomTetromino())
  const [nextTetromino, setNextTetromino] = useState(getRandomTetromino())
  const [position, setPosition] = useState({ x: 3, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState(INITIAL_SPEED)
  const [highScore, setHighScore] = useState(0)

  // Game loop ref to prevent stale closures
  const gameStateRef = useRef({
    board,
    currentTetromino,
    nextTetromino,
    position,
    gameOver,
    isPaused,
    speed,
    score,
    level,
  })

  // Update ref when state changes
  useEffect(() => {
    gameStateRef.current = {
      board,
      currentTetromino,
      nextTetromino,
      position,
      gameOver,
      isPaused,
      speed,
      score,
      level,
    }
  }, [board, currentTetromino, nextTetromino, position, gameOver, isPaused, speed, score, level])

  // Create empty board
  function createEmptyBoard() {
    return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
  }

  // Get random tetromino
  function getRandomTetromino() {
    return TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)]
  }

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentTetromino(getRandomTetromino())
    setNextTetromino(getRandomTetromino())
    setPosition({ x: 3, y: 0 })
    setGameOver(false)
    setScore(0)
    setLevel(1)
    setIsPaused(false)
    setSpeed(INITIAL_SPEED)
  }, [])

  // Check collision
  const checkCollision = useCallback(
    (tetromino = gameStateRef.current.currentTetromino, pos = gameStateRef.current.position) => {
      for (let y = 0; y < tetromino.shape.length; y++) {
        for (let x = 0; x < tetromino.shape[y].length; x++) {
          if (tetromino.shape[y][x] !== 0) {
            const boardX = pos.x + x
            const boardY = pos.y + y

            // Check if out of bounds
            if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
              return true
            }

            // Check if already filled
            if (boardY >= 0 && gameStateRef.current.board[boardY][boardX] !== 0) {
              return true
            }
          }
        }
      }
      return false
    },
    [],
  )

  // Rotate tetromino
  const rotateTetromino = useCallback(() => {
    const { currentTetromino, position } = gameStateRef.current
    const newTetromino = { ...currentTetromino }

    // Create rotated shape
    const rotatedShape = newTetromino.shape[0].map((_, index) => newTetromino.shape.map((row) => row[index]).reverse())

    newTetromino.shape = rotatedShape

    // Check if rotation is valid
    if (!checkCollision(newTetromino, position)) {
      setCurrentTetromino(newTetromino)
    }
  }, [checkCollision])

  // Move tetromino
  const moveTetromino = useCallback(
    (dx: number, dy: number) => {
      const newPos = { x: gameStateRef.current.position.x + dx, y: gameStateRef.current.position.y + dy }

      if (!checkCollision(gameStateRef.current.currentTetromino, newPos)) {
        setPosition(newPos)
        return true
      }
      return false
    },
    [checkCollision],
  )

  // Hard drop
  const hardDrop = useCallback(() => {
    let newY = gameStateRef.current.position.y
    while (
      !checkCollision(gameStateRef.current.currentTetromino, { x: gameStateRef.current.position.x, y: newY + 1 })
    ) {
      newY++
    }
    setPosition({ ...gameStateRef.current.position, y: newY })
  }, [checkCollision])

  // Merge tetromino with board
  const mergeTetromino = useCallback(() => {
    const { currentTetromino, position, board } = gameStateRef.current
    const newBoard = [...board.map((row) => [...row])]

    for (let y = 0; y < currentTetromino.shape.length; y++) {
      for (let x = 0; x < currentTetromino.shape[y].length; x++) {
        if (currentTetromino.shape[y][x] !== 0) {
          const boardY = position.y + y
          const boardX = position.x + x
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentTetromino.shape[y][x]
          }
        }
      }
    }

    setBoard(newBoard)
  }, [])

  // Check for completed lines
  const checkLines = useCallback(() => {
    const { board, score, level } = gameStateRef.current
    const newBoard = [...board]
    let linesCleared = 0

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        // Remove the line
        newBoard.splice(y, 1)
        // Add empty line at top
        newBoard.unshift(Array(BOARD_WIDTH).fill(0))
        linesCleared++
        y++ // Check the same line again
      }
    }

    if (linesCleared > 0) {
      // Calculate score based on lines cleared
      const linePoints = [40, 100, 300, 1200]
      const newScore = score + linePoints[linesCleared - 1] * level
      setScore(newScore)

      // Update high score if needed
      if (newScore > highScore) {
        setHighScore(newScore)
      }

      // Update level
      const newLevel = Math.floor(newScore / 1000) + 1
      if (newLevel > level) {
        setLevel(newLevel)
        setSpeed(Math.max(INITIAL_SPEED - (newLevel - 1) * SPEED_INCREMENT, 100))
      }

      setBoard(newBoard)
    }
  }, [highScore])

  // Spawn new tetromino
  const spawnTetromino = useCallback(() => {
    setCurrentTetromino(gameStateRef.current.nextTetromino)
    setNextTetromino(getRandomTetromino())
    setPosition({ x: 3, y: 0 })

    // Check if game over
    if (checkCollision(gameStateRef.current.nextTetromino, { x: 3, y: 0 })) {
      setGameOver(true)
    }
  }, [checkCollision])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent arrow keys from scrolling
      if (e.key.startsWith("Arrow") || e.key === " " || e.key === "d" || e.key === "r") {
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
          moveTetromino(-1, 0)
          break
        case "ArrowRight":
        case "d":
        case "D":
          moveTetromino(1, 0)
          break
        case "ArrowDown":
        case "s":
        case "S":
          moveTetromino(0, 1)
          break
        case "ArrowUp":
        case "w":
        case "W":
          rotateTetromino()
          break
        case " ": // Space bar
          if (e.target === document.body) {
            e.preventDefault() // Prevent page scroll
            if (gameStateRef.current.gameOver) {
              resetGame()
            } else {
              setIsPaused((prev) => !prev)
            }
          }
          break
        case "r":
        case "R": // R key to reset
          resetGame()
          break
        case "d":
        case "D": // D key for hard drop
          hardDrop()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [hardDrop, moveTetromino, resetGame, rotateTetromino])

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return

    const moveDown = () => {
      const { gameOver, isPaused } = gameStateRef.current
      if (gameOver || isPaused) return

      // Try to move down
      if (!moveTetromino(0, 1)) {
        // If can't move down, merge with board
        mergeTetromino()
        // Check for completed lines
        checkLines()
        // Spawn new tetromino
        spawnTetromino()
      }
    }

    const gameLoop = setInterval(moveDown, speed)
    return () => clearInterval(gameLoop)
  }, [checkLines, gameOver, isPaused, mergeTetromino, moveTetromino, spawnTetromino, speed])

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
    for (let i = 0; i <= BOARD_WIDTH; i++) {
      // Vertical lines
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE)
      ctx.stroke()
    }

    for (let i = 0; i <= BOARD_HEIGHT; i++) {
      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(BOARD_WIDTH * CELL_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x] !== 0) {
          const colorIndex = board[y][x]
          ctx.fillStyle = TETROMINOES[colorIndex - 1].color
          ctx.shadowColor = TETROMINOES[colorIndex - 1].color
          ctx.shadowBlur = 5
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)
          ctx.shadowBlur = 0
        }
      }
    }

    // Draw current tetromino
    if (!gameOver) {
      for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
          if (currentTetromino.shape[y][x] !== 0) {
            const boardX = position.x + x
            const boardY = position.y + y

            if (boardY >= 0) {
              ctx.fillStyle = currentTetromino.color
              ctx.shadowColor = currentTetromino.color
              ctx.shadowBlur = 5
              ctx.fillRect(boardX * CELL_SIZE, boardY * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)
              ctx.shadowBlur = 0
            }
          }
        }
      }

      // Draw ghost piece (where the tetromino will land)
      let ghostY = position.y
      while (!checkCollision(currentTetromino, { x: position.x, y: ghostY + 1 })) {
        ghostY++
      }

      for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
          if (currentTetromino.shape[y][x] !== 0) {
            const boardX = position.x + x
            const boardY = ghostY + y

            if (boardY >= 0 && boardY < BOARD_HEIGHT) {
              ctx.fillStyle = `${currentTetromino.color}33` // 20% opacity
              ctx.fillRect(boardX * CELL_SIZE, boardY * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)
            }
          }
        }
      }
    }

    // Draw next tetromino preview
    const nextCanvas = document.getElementById("next-tetromino") as HTMLCanvasElement
    if (nextCanvas) {
      const nextCtx = nextCanvas.getContext("2d")
      if (nextCtx) {
        nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height)
        nextCtx.fillStyle = "#000"
        nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height)

        const offsetX = (nextCanvas.width - nextTetromino.shape[0].length * CELL_SIZE) / 2
        const offsetY = (nextCanvas.height - nextTetromino.shape.length * CELL_SIZE) / 2

        for (let y = 0; y < nextTetromino.shape.length; y++) {
          for (let x = 0; x < nextTetromino.shape[y].length; x++) {
            if (nextTetromino.shape[y][x] !== 0) {
              nextCtx.fillStyle = nextTetromino.color
              nextCtx.shadowColor = nextTetromino.color
              nextCtx.shadowBlur = 5
              nextCtx.fillRect(offsetX + x * CELL_SIZE, offsetY + y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)
              nextCtx.shadowBlur = 0
            }
          }
        }
      }
    }

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
  }, [board, checkCollision, currentTetromino, gameOver, isPaused, nextTetromino, position, score])

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex items-center justify-between w-full">
          <div className="text-cyan-300 font-mono">
            <div className="text-sm">SCORE:</div>
            <div className="text-xl text-cyan-400">{score}</div>
          </div>

          <div className="text-cyan-300 font-mono ml-8">
            <div className="text-sm">LEVEL:</div>
            <div className="text-xl text-cyan-400">{level}</div>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={BOARD_WIDTH * CELL_SIZE}
            height={BOARD_HEIGHT * CELL_SIZE}
            className="border-2 border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="text-cyan-300 font-mono text-center">NEXT</div>
        <canvas
          id="next-tetromino"
          width={6 * CELL_SIZE}
          height={6 * CELL_SIZE}
          className="border-2 border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.3)]"
        />

        {!hideControls && (
          <div className="text-xs text-cyan-400 opacity-70 text-center mt-4">
            <p>Arrow keys or WASD to move/rotate</p>
            <p>Space to pause, R to reset</p>
          </div>
        )}
      </div>
    </div>
  )
}
