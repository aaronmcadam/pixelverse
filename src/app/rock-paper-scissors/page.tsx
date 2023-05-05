"use client";
import { useState } from "react";

export default function Home() {
  const [computerChoice, setComputerChoice] = useState<string>();
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setPlayerChoice(event.currentTarget.value);
    setComputerChoice(generateComputerChoice());
  };

  function generateComputerChoice() {
    const possibleChoiceCount = 3;
    const randomNumber = Math.floor(Math.random() * possibleChoiceCount);

    // These rules are entirely arbitrary
    if (randomNumber === 1) {
      return "rock";
    }

    if (randomNumber === 2) {
      return "scissors";
    }

    return "paper";
  }

  function getResult() {
    if (computerChoice === "rock" && playerChoice === "paper") {
      return "You win!";
    }

    if (computerChoice === "rock" && playerChoice === "scissors") {
      return "You lost!";
    }

    if (computerChoice === "paper" && playerChoice === "scissors") {
      return "You win!";
    }

    if (computerChoice === "paper" && playerChoice === "rock") {
      return "You lose!";
    }

    if (computerChoice === "scissors" && playerChoice === "rock") {
      return "You win!";
    }

    if (computerChoice === "scissors" && playerChoice === "paper") {
      return "You lose!";
    }

    return "It's a draw!";
  }

  return (
    <main className="min-h-screen p-24">
      <h1>Rock Paper Scissors</h1>
      <h2>Computer choice: {computerChoice}</h2>
      <h2>Player choice: {playerChoice}</h2>
      <div className="flex gap-2">
        <button
          onClick={handleClick}
          value="rock"
          type="button"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Rock
        </button>
        <button
          onClick={handleClick}
          value="paper"
          type="button"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Paper
        </button>
        <button
          onClick={handleClick}
          value="scissors"
          type="button"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Scissors
        </button>
      </div>
      {playerChoice ? <div>Result: {getResult()}</div> : null}
    </main>
  );
}
