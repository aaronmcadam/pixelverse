"use client";
import { useEffect, useState } from "react";

type Card = {
  name: string;
  img: string;
  id: number;
  isFlipped: boolean;
};

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
    img: `images/memory-game/${name}.png`,
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

export default function MemoryGame() {
  const [cardArray, setCardArray] = useState<Card[]>(generateCardArray());
  const [cardsChosen, setCardsChosen] = useState<number[]>([]);
  const [cardsMatched, setCardsMatched] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // calculate number of matched pairs
    const matchedCount = cardsMatched.length / 2;
    setResult(matchedCount.toString());

    // if number of matched pairs equals half of the array, we know all pairs have been matched
    if (matchedCount === cardArray.length / 2) {
      setResult("Congratulations, you found them all!");
    }
  }, [cardsMatched, cardArray.length]);

  useEffect(() => {
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
    if (cardsChosen.length === 2) {
      setTimeout(checkForMatch, 500);
    }
  }, [cardArray, cardsChosen, cardsMatched]);

  function flipCard(cardId: number) {
    if (cardsMatched.includes(cardId)) {
      // Card has already been matched, ignore click event
      return;
    }

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

  const backImage = "/images/back.png";

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Memory Game
      </h2>
      <p>Score: {result}</p>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {cardArray.map((card) => {
          const hasMatched = cardsMatched.includes(card.id);
          const src = card.isFlipped ? card.img : backImage;
          const altText =
            card.isFlipped || hasMatched ? card.name : "back of card";

          return (
            <li
              key={card.id}
              className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg overflow-hidden text-center shadow"
            >
              {!hasMatched ? (
                <img
                  onClick={() => flipCard(card.id)}
                  alt={altText}
                  src={src}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
