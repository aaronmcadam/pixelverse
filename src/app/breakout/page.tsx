"use client";
import { useEffect, useReducer, useRef, useState } from "react";

// Constants
const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 20;
const BOARD_WIDTH = 560;
const BOARD_HEIGHT = 300;
const BALL_DIAMETER = 20;
const PADDLE_START = [230, 10];
const PADDLE_STEP = 20;
const BALL_START = [270, 30];
const INITIAL_SPEED = 4;
const GAME_LOOP_INTERVAL = 20;

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

  hit(x: number, y: number) {
    const [left, right, top, bottom] = [
      this.bottomLeft[0],
      this.bottomRight[0],
      this.topLeft[1],
      this.bottomLeft[1],
    ];

    return x >= left && x <= right && y >= bottom && y <= top;
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

const initialState = {
  blocks: initialBlocks,
  paddlePosition: PADDLE_START,
  ballPosition: BALL_START,
  xDirection: INITIAL_SPEED,
  yDirection: INITIAL_SPEED,
  score: 0,
  result: "",
};

type State = typeof initialState;
type ActionType =
  | "MOVE_PADDLE"
  | "UPDATE_BALL_POSITION"
  | "CHANGE_X_DIRECTION"
  | "CHANGE_Y_DIRECTION"
  | "REMOVE_BLOCK"
  | "INCREMENT_SCORE"
  | "SET_RESULT";
type Action = {
  type: ActionType;
  payload?: any;
};

// Reducer to manage game state
function gameReducer(state: State, action: Action) {
  switch (action.type) {
    case "MOVE_PADDLE": {
      const nextPosition = state.paddlePosition[0] + action.payload;

      // Check that the paddle isn't moving off the board
      if (nextPosition < 0 || nextPosition > BOARD_WIDTH - BLOCK_WIDTH) {
        return state;
      }

      return {
        ...state,
        paddlePosition: [nextPosition, state.paddlePosition[1]],
      };
    }
    case "UPDATE_BALL_POSITION":
      return { ...state, ballPosition: action.payload };
    case "CHANGE_X_DIRECTION":
      return { ...state, xDirection: -state.xDirection };
    case "CHANGE_Y_DIRECTION":
      return { ...state, yDirection: -state.yDirection };
    case "REMOVE_BLOCK":
      return {
        ...state,
        blocks: state.blocks.filter((_, index) => index !== action.payload),
      };
    case "INCREMENT_SCORE":
      return { ...state, score: state.score + 1 };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function Breakout() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Moving the player
  useEffect(() => {
    function movePlayer(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowLeft":
          dispatch({
            type: "MOVE_PADDLE",
            payload: -PADDLE_STEP,
          });
          break;
        case "ArrowRight":
          dispatch({
            type: "MOVE_PADDLE",
            payload: PADDLE_STEP,
          });
          break;
      }
    }

    document.addEventListener("keydown", movePlayer);

    return () => document.removeEventListener("keydown", movePlayer);
  }, []);

  // Game Loop
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const [ballXAxis, ballYAxis] = state.ballPosition;
      const nextXAxis = ballXAxis + state.xDirection;
      const nextYAxis = ballYAxis + state.yDirection;

      dispatch({
        type: "UPDATE_BALL_POSITION",
        payload: [nextXAxis, nextYAxis],
      });
    }, GAME_LOOP_INTERVAL);

    if (state.result === "GAME_OVER") {
      window.clearInterval(intervalId);
    }

    return () => window.clearInterval(intervalId);
  }, [state]);

  // Change Ball Direction if Hit the Wall
  useEffect(() => {
    const [ballXAxis, ballYAxis] = state.ballPosition;

    if (ballXAxis >= BOARD_WIDTH - BALL_DIAMETER || ballXAxis <= 0) {
      dispatch({ type: "CHANGE_X_DIRECTION" });
    }

    if (ballYAxis >= BOARD_HEIGHT - BALL_DIAMETER || ballYAxis <= 0) {
      dispatch({ type: "CHANGE_Y_DIRECTION" });
    }
  }, [state.ballPosition]);

  // Remove Block and Update Score if Hit
  useEffect(() => {
    const [ballXAxis, ballYAxis] = state.ballPosition;

    for (let i = 0; i < state.blocks.length; ++i) {
      let block = state.blocks[i];

      if (block.hit(ballXAxis, ballYAxis)) {
        dispatch({ type: "REMOVE_BLOCK", payload: i });
        dispatch({ type: "CHANGE_Y_DIRECTION" });
        dispatch({ type: "INCREMENT_SCORE" });
      }
    }
  }, [state.ballPosition, state.blocks]);

  // Change Ball Direction if Hit Paddle
  useEffect(() => {
    const [ballXAxis, ballYAxis] = state.ballPosition;
    const [paddleXAxis, paddleYAxis] = state.paddlePosition;

    if (
      ballXAxis + state.xDirection > paddleXAxis &&
      ballXAxis + state.xDirection < paddleXAxis + BLOCK_WIDTH &&
      ballYAxis + state.yDirection > paddleYAxis &&
      ballYAxis + state.yDirection < paddleYAxis + BLOCK_HEIGHT
    ) {
      dispatch({ type: "CHANGE_Y_DIRECTION" });
    }
  }, [state]);

  // Game Over if Ball Hits Bottom of the Board
  useEffect(() => {
    const [, ballYAxis] = state.ballPosition;

    if (ballYAxis <= 0) {
      dispatch({ type: "SET_RESULT", payload: "GAME_OVER" });
    }
  }, [state.ballPosition]);

  // Game Won if All Blocks are Removed
  useEffect(() => {
    if (state.blocks.length === 0) {
      dispatch({ type: "SET_RESULT", payload: "GAME_WON" });
    }
  }, [state.blocks.length]);

  return (
    <div className="py-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Breakout
      </h2>
      <div>Score: {state.score}</div>
      <div>Result: {state.result}</div>
      <div className="relative h-[300px] w-[560px]">
        {state.blocks.map((block, index) => (
          <div
            key={index}
            className="w-[100px] h-[20px] bg-blue-400 absolute"
            style={{
              left: state.blocks[index].bottomLeft[0],
              bottom: state.blocks[index].bottomLeft[1],
            }}
          ></div>
        ))}
        <div
          className="w-[100px] h-[20px] bg-purple-400 absolute"
          style={{
            left: state.paddlePosition[0],
            bottom: state.paddlePosition[1],
          }}
        ></div>
        <div
          className="w-[20px] h-[20px] rounded-full bg-red-400 absolute"
          style={{
            left: state.ballPosition[0],
            bottom: state.ballPosition[1],
          }}
        ></div>
      </div>
    </div>
  );
}
