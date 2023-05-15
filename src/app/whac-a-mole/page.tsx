"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Square = {
  id: number;
  isMole: boolean;
};

export default function WhacAMole() {
  const [squares, setSquares] = useState<Square[]>([
    {
      id: 1,
      isMole: false,
    },
    {
      id: 2,
      isMole: false,
    },
    {
      id: 3,
      isMole: false,
    },
    {
      id: 4,
      isMole: false,
    },
    {
      id: 5,
      isMole: false,
    },
    {
      id: 6,
      isMole: false,
    },
    {
      id: 7,
      isMole: false,
    },
    {
      id: 8,
      isMole: false,
    },
    {
      id: 9,
      isMole: false,
    },
  ]);
  const [result, setResult] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    function randomSquare() {
      const randomId = squares.map((s) => s.id)[
        Math.floor(Math.random() * squares.length)
      ];

      setSquares((prev) =>
        prev.map((square) => {
          if (square.id === randomId) {
            return {
              ...square,
              isMole: true,
            };
          }
          return {
            ...square,
            isMole: false,
          };
        })
      );
    }

    const interval = window.setInterval(randomSquare, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [squares]);

  function handleClick(square: Square) {
    alert("you clicked");
    console.log(square);
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Whac-a-mole
      </h2>
      <p>Score: {result}</p>
      <p>Time remaining: {timeRemaining}</p>
      <ul role="list" className="grid grid-cols-1 md:grid-cols-3">
        {squares.map((square) => {
          return (
            <li
              key={square.id}
              className={clsx(
                "overflow-hidden text-center border-gray-700 border",
                square.isMole ? "bg-blue-800" : ""
              )}
            >
              <button onClick={() => handleClick(square)} className="w-full">
                {square.id}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
