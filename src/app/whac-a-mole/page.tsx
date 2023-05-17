"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

type Square = {
  id: number;
};

const squares: Square[] = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
  {
    id: 8,
  },
  {
    id: 9,
  },
];

const MOLE_VISIBLE_TIME_MS = 1500;
const TIMER_START_SECONDS = 60;

export default function WhacAMole() {
  const [molePosition, setMolePosition] = useState(1);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(TIMER_START_SECONDS);
  const randomRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function randomSquare() {
      const randomSquare = squares[Math.floor(Math.random() * squares.length)];

      // Avoid unneccessary rerenders when the new position is the same as the current one.
      if (randomSquare.id === molePosition) {
        return;
      }

      setMolePosition(randomSquare.id);
    }

    randomRef.current = window.setInterval(randomSquare, MOLE_VISIBLE_TIME_MS);

    return () => {
      if (randomRef.current) {
        window.clearInterval(randomRef.current);
      }
    };
  }, [molePosition]);

  // The interval was getting reset every time the result changed, so that was causing a delay in the countdown timer.
  // Moving the GAME OVER logic into its own effect solved the problem.
  useEffect(() => {
    function countDown() {
      setTimeRemaining((prev) => prev - 1);
    }

    timerRef.current = window.setInterval(countDown, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  // When the GAME OVER alert shows, the player sees "time remaining: 1", even though the value is 0.
  // Browsers generally block UI updates until an alert is dismissed, so the player needs to close the alert before the value will change.
  // We might need to use a custom modal for messaging instead, or just update a string value in state. We've chosen the second option for now.
  useEffect(() => {
    if (timeRemaining === 0) {
      if (randomRef.current) {
        window.clearInterval(randomRef.current);
      }

      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }

      // alert(`GAME OVER! Your final score is: ${score}`);
      setResult(`GAME OVER! Your final score is: ${score}`);
    }
  }, [timeRemaining, score]);

  function handleClick(isMole: boolean) {
    if (timeRemaining === 0) {
      return;
    }

    if (isMole) {
      setScore((prev) => prev + 1);
    }
  }

  return (
    <div className="pt-8 h-full">
      <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Whac-a-mole
      </h2>
      <p>Score: {score}</p>
      <p>Time remaining: {timeRemaining}</p>
      <p>Result: {result}</p>
      <ul role="list" className="grid grid-cols-1 md:grid-cols-3 h-2/3">
        {squares.map((square) => {
          const isMole = square.id === molePosition;

          return (
            <li
              key={square.id}
              className={clsx(
                "overflow-hidden text-center border-gray-700 border",
                isMole
                  ? "bg-[url(/images/whac-a-mole/mole.jpg)] bg-no-repeat bg-cover"
                  : ""
              )}
            >
              <button
                onClick={() => handleClick(isMole)}
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
