"use client";
import clsx from "clsx";
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

const blocks = [
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
  const [paddlePosition, setPaddlePosition] = useState(paddleStart);
  const [ballPosition, setBallPosition] = useState(ballStart);
  const [result, setResult] = useState("");
  const ballAnimationRef = useRef<number | null>(null);

  const xDirectionRef = useRef(2);
  const yDirectionRef = useRef(2);

  useEffect(() => {
    function movePlayer(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowLeft":
          setPaddlePosition((prev) => {
            const nextPosition = prev[0] - 10;

            // Don't let the paddle go off the board
            if (nextPosition > 0) {
              return [nextPosition, prev[1]];
            }

            return prev;
          });
          break;

        case "ArrowRight":
          setPaddlePosition((prev) => {
            const nextPosition = prev[0] + 10;

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
  }, []);

  useEffect(() => {
    ballAnimationRef.current = window.setInterval(() => {
      setBallPosition((prev) => {
        const [xAxis, yAxis] = prev;
        const nextXAxis = xAxis + xDirectionRef.current;
        const nextYAxis = yAxis + yDirectionRef.current;

        // Check for wall collisions
        if (nextXAxis >= BOARD_WIDTH - BALL_DIAMETER || nextXAxis <= 0) {
          xDirectionRef.current = -xDirectionRef.current;
        }

        if (nextYAxis >= BOARD_HEIGHT - BALL_DIAMETER || nextYAxis <= 0) {
          yDirectionRef.current = -yDirectionRef.current;
        }

        return [nextXAxis, nextYAxis];
      });
    }, 30);

    return () => {
      if (ballAnimationRef.current) {
        window.clearInterval(ballAnimationRef.current);
      }
    };
  }, []);

  // handle game over
  useEffect(() => {
    const [_xAxis, yAxis] = ballPosition;

    if (yAxis <= 0) {
      if (ballAnimationRef.current) {
        window.clearInterval(ballAnimationRef.current);
      }

      // reset game state
      setResult("Game Over");
      // TODO: disable paddle
    }
  }, [ballPosition]);

  return (
    <div className="py-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Breakout
      </h2>
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
