"use client";
import { useEffect, useState } from "react";

interface Card {
  name: string;
  img: string;
  id: number;
  isFlipped: boolean;
}

function generateCardArray(): Card[] {
  const cardNames = [
    "fries",
    "cheeseburger",
    "ice-cream",
    "pizza",
    "milkshake",
    "hotdog",
  ];
  const cardPairs = cardNames.map((name) => ({
    name,
    img: `images/${name}.png`,
  }));
  const cardArray = [...cardPairs, ...cardPairs].map((card, index) => ({
    ...card,
    id: index,
    isFlipped: false,
  }));

  return shuffle(cardArray);
}

function shuffle(array: Card[]) {
  return array.sort(() => 0.5 - Math.random());
}

// We do this imperatively first and then refactor to a React way of doing things.
// Instead of setting attributes, we should update the state so things rerender instead.
export default function MemoryGame() {
  const [cardArray, setCardArray] = useState<Card[]>(generateCardArray());
  const [cardsChosen, setCardsChosen] = useState<number[]>([]);
  const [cardsMatched, setCardsMatched] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);

  function checkForMatch() {
    const [optionOneId, optionTwoId] = cardsChosen;
    const cardOne = cardArray.find((card) => card.id === optionOneId);
    const cardTwo = cardArray.find((card) => card.id === optionTwoId);

    if (cardOne && cardTwo && cardOne.name === cardTwo.name) {
      alert("You found a match!");
      setCardsMatched([...cardsMatched, optionOneId, optionTwoId]);
    } else {
      // flip the cards back over
      const newCardArray = cardArray.map((card) => {
        // find the matching cards and flip them
        if (card.id === optionOneId || card.id === optionTwoId) {
          return {
            ...card,
            isFlipped: false,
          };
        } else {
          return card;
        }
      });

      setCardArray(newCardArray);
      alert("Sorry try again!");
    }

    setCardsChosen([]);
  }

  useEffect(() => {
    // calculate number of matched pairs
    const matchedCount = cardsMatched.length / 2;
    setResult(matchedCount.toString());

    // if number of matched pairs equals half of the array, we know all pairs have been matched
    if (matchedCount === cardArray.length / 2) {
      setResult("Congratulations, you found them all!");
    }
  }, [cardsMatched, cardArray.length]);

  function flipCard(cardId: number) {
    if (cardsChosen.length === 2 || cardsChosen.includes(cardId)) {
      return alert("You chose the same card!");
    }

    const newCardArray = cardArray.map((card) => {
      if (card.id === cardId) {
        return { ...card, isFlipped: true };
      } else {
        return card;
      }
    });

    setCardArray(newCardArray);
    setCardsChosen([...cardsChosen, cardId]);
  }

  useEffect(() => {
    if (cardsChosen.length === 2) {
      setTimeout(checkForMatch, 500);
    }
  }, [cardsChosen, checkForMatch]);

  return (
    <main className="min-h-screen p-24">
      <h1>Memory Game</h1>
      <p>Score: {result}</p>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {cardArray.map((card) => (
          <li
            key={card.id}
            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg overflow-hidden bg-white text-center shadow"
          >
            <img
              onClick={() => flipCard(card.id)}
              alt="card"
              src={
                card.isFlipped || cardsMatched.includes(card.id)
                  ? card.img
                  : "images/blank.png"
              }
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
