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
      isMole: true,
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
  const [timeRemaining, setTimeRemaining] = useState(60);

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

    const interval = window.setInterval(randomSquare, 3000);

    // if (timeRemaining === 0) {
    //   window.clearInterval(interval);
    // }

    return () => {
      window.clearInterval(interval);
    };
  }, [squares]);

  // When we click a Mole square, the timer gets blocked for a second. How can we avoid this issue?
  useEffect(() => {
    function countDown() {
      setTimeRemaining((prev) => prev - 1);
    }

    const interval = window.setInterval(countDown, 1000);

    if (timeRemaining === 0) {
      window.clearInterval(interval);
      alert(`GAME OVER! Your final score is: ${result}`);
    }

    return () => {
      window.clearInterval(interval);
    };
  }, [result, timeRemaining]);

  function handleClick(square: Square) {
    console.log(square);

    if (square.isMole) {
      setResult((prev) => prev + 1);
    }
  }

  return (
    <div className="pt-8 h-full">
      <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Whac-a-mole
      </h2>
      <p>Score: {result}</p>
      <p>Time remaining: {timeRemaining}</p>
      <ul role="list" className="grid grid-cols-1 md:grid-cols-3 h-2/3">
        {squares.map((square) => {
          return (
            <li
              key={square.id}
              className={clsx(
                "overflow-hidden text-center border-gray-700 border",
                square.isMole
                  ? "bg-[url(/images/whac-a-mole/mole.jpg)] bg-no-repeat bg-cover"
                  : ""
              )}
            >
              <button
                onClick={() => handleClick(square)}
                className="w-full h-full"
              >
                {square.id}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
