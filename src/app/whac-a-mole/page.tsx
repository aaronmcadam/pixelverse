"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const squares = Array.from({ length: 9 }, (_, index) => index + 1);
const MOLE_VISIBLE_TIME_MILLISECONDS = 1500;
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

      setMolePosition((currentPosition) => {
        // Avoid unneccessary rerenders when the new position is the same as the current one.
        if (randomSquare === currentPosition) {
          return currentPosition;
        }

        return randomSquare;
      });
    }

    randomRef.current = window.setInterval(
      randomSquare,
      MOLE_VISIBLE_TIME_MILLISECONDS
    );

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
    <div className="py-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Whac-a-mole
      </h2>
      <p>Score: {score}</p>
      <p>Time remaining: {timeRemaining}</p>
      <p>Result: {result}</p>
      <ul
        role="list"
        className="grid grid-cols-3 flex-grow border-gray-700 border"
      >
        {squares.map((square) => {
          const isMole = square === molePosition;
          // We want to avoid double borders in the grid, so we use
          // these values to conditionally apply right and bottom borders.
          const isLastColumn = square % 3 === 0;
          const isLastRow = square > 6;

          return (
            <li
              key={square}
              className={clsx("overflow-hidden text-center border-gray-700", {
                "bg-[url(/images/whac-a-mole/mole.jpg)] bg-no-repeat bg-cover":
                  isMole,
                "border-r": !isLastColumn,
                "border-b": !isLastRow,
              })}
            >
              <button
                onClick={() => handleClick(isMole)}
                className="w-full h-full"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
