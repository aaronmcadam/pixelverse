"use client";
import { useEffect, useRef, useState } from "react";

const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 20;
const BOARD_WIDTH = 560;
const BOARD_HEIGHT = 300;
const BALL_DIAMETER = 20;
const paddleStart = [230, 10];
const ballStart = [270, 30];

class Block {
  bottomLeft: [number, number];
  bottomRight: [number, number];
  topRight: [number, number];
  topLeft: [number, number];

  constructor(xAxis: number, yAxis: number) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + BLOCK_WIDTH, yAxis];
    this.topLeft = [xAxis, yAxis + BLOCK_HEIGHT];
    this.topRight = [xAxis + BLOCK_WIDTH, yAxis + BLOCK_HEIGHT];
  }
}

const initialBlocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),

  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),

  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

export default function Breakout() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [paddlePosition, setPaddlePosition] = useState(paddleStart);
  const [ballPosition, setBallPosition] = useState(ballStart);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState("");
  const gameLoopRef = useRef<number | null>(null);
  const xDirectionRef = useRef(-2);
  const yDirectionRef = useRef(2);

  useEffect(() => {
    function movePlayer(event: KeyboardEvent) {
      if (result === "GAME_OVER" || result === "GAME_WON") {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          setPaddlePosition((prev) => {
            const nextPosition = prev[0] - 20;

            // Don't let the paddle go off the board
            if (nextPosition > 0) {
              return [nextPosition, prev[1]];
            }

            return prev;
          });
          break;

        case "ArrowRight":
          setPaddlePosition((prev) => {
            const nextPosition = prev[0] + 20;

            // Don't let the paddle go off the board
            if (nextPosition < BOARD_WIDTH - BLOCK_WIDTH) {
              return [nextPosition, prev[1]];
            }

            return prev;
          });
          break;
      }
    }

    document.addEventListener("keydown", movePlayer);

    return () => {
      document.removeEventListener("keydown", movePlayer);
    };
  }, [result]);

  useEffect(() => {
    gameLoopRef.current = window.setInterval(() => {
      setBallPosition((prev) => {
        const [xAxis, yAxis] = prev;
        const nextXAxis = xAxis + xDirectionRef.current;
        const nextYAxis = yAxis + yDirectionRef.current;

        return [nextXAxis, nextYAxis];
      });
    }, 20);

    return () => {
      if (gameLoopRef.current) {
        window.clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  // change direction
  // ensure that the direction change occurs only once per collision.
  useEffect(() => {
    const [xAxis, yAxis] = ballPosition;

    // Change ball direction if the ball hits a wall
    if (xAxis >= BOARD_WIDTH - BALL_DIAMETER || xAxis <= 0) {
      xDirectionRef.current = -xDirectionRef.current;
    }

    if (yAxis >= BOARD_HEIGHT - BALL_DIAMETER || yAxis <= 0) {
      yDirectionRef.current = -yDirectionRef.current;
    }
  }, [ballPosition]);

  // remove the block if we hit it
  useEffect(() => {
    const [xAxis, yAxis] = ballPosition;

    for (let i = 0; i < blocks.length; ++i) {
      const block = blocks[i];
      const [left, right, top, bottom] = [
        block.bottomLeft[0],
        block.bottomRight[0],
        block.topLeft[1],
        block.bottomLeft[1],
      ];

      const ballRadius = BALL_DIAMETER / 2;

      const isColliding =
        xAxis + ballRadius >= left &&
        xAxis - ballRadius <= right &&
        yAxis + ballRadius >= bottom &&
        yAxis - ballRadius <= top;

      if (isColliding) {
        // Change direction based on where the ball hits the block
        const hitFromLeft = Math.abs(xAxis + ballRadius - left);
        const hitFromRight = Math.abs(xAxis - ballRadius - right);
        const hitFromTop = Math.abs(yAxis - ballRadius - top);
        const hitFromBottom = Math.abs(yAxis + ballRadius - bottom);

        const minHit = Math.min(
          hitFromLeft,
          hitFromRight,
          hitFromTop,
          hitFromBottom
        );

        switch (minHit) {
          case hitFromLeft:
          case hitFromRight:
            xDirectionRef.current = -xDirectionRef.current;
            break;
          case hitFromTop:
          case hitFromBottom:
            yDirectionRef.current = -yDirectionRef.current;
            break;
        }

        setBlocks((prev) => prev.filter((_block, index) => index !== i));
        setScore((prev) => prev + 1);

        break; // exit the loop after the first hit
      }
    }
  }, [ballPosition, blocks]);

  // check for paddle collision
  useEffect(() => {
    const [ballXAxis, ballYAxis] = ballPosition;
    const [paddleXAxis, paddleYAxis] = paddlePosition;

    // try to stop the ball getting stuck in the paddle
    if (
      ballXAxis + xDirectionRef.current > paddleXAxis &&
      ballXAxis + xDirectionRef.current < paddleXAxis + BLOCK_WIDTH &&
      ballYAxis + yDirectionRef.current > paddleYAxis &&
      ballYAxis + yDirectionRef.current < paddleYAxis + BLOCK_HEIGHT
    ) {
      yDirectionRef.current = -yDirectionRef.current;
    }
  }, [ballPosition, paddlePosition]);

  // handle game over
  useEffect(() => {
    const [_xAxis, yAxis] = ballPosition;

    if (yAxis <= 0) {
      if (gameLoopRef.current) {
        window.clearInterval(gameLoopRef.current);
      }

      // reset game state
      setResult("GAME_OVER");
    }
  }, [ballPosition]);

  // handle win
  useEffect(() => {
    if (blocks.length === 0) {
      if (gameLoopRef.current) {
        window.clearInterval(gameLoopRef.current);
      }

      // reset game state
      setResult("GAME_WON");
    }
  }, [blocks.length]);

  return (
    <div className="py-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Breakout
      </h2>
      <div>Score: {score}</div>
      <div>Result: {result}</div>
      <div className="relative h-[300px] w-[560px]">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="w-[100px] h-[20px] bg-blue-400 absolute"
            style={{
              left: blocks[index].bottomLeft[0],
              bottom: blocks[index].bottomLeft[1],
            }}
          ></div>
        ))}
        <div
          className="w-[100px] h-[20px] bg-purple-400 absolute"
          style={{
            left: paddlePosition[0],
            bottom: paddlePosition[1],
          }}
        ></div>
        <div
          className="w-[20px] h-[20px] rounded-full bg-red-400 absolute"
          style={{
            left: ballPosition[0],
            bottom: ballPosition[1],
          }}
        ></div>
      </div>
    </div>
  );
}
