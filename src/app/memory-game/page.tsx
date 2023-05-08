"use client";
import { useState } from "react";

const cardArray = [
  {
    name: "fries",
    img: "/images/fries.png",
  },
  {
    name: "cheeseburger",
    img: "/images/cheeseburger.png",
  },
  {
    name: "hotdog",
    img: "/images/hotdog.png",
  },
  {
    name: "ice-cream",
    img: "/images/ice-cream.png",
  },
  {
    name: "milkshake",
    img: "/images/milkshake.png",
  },
  {
    name: "pizza",
    img: "/images/pizza.png",
  },
  {
    name: "fries",
    img: "/images/fries.png",
  },
  {
    name: "cheeseburger",
    img: "/images/cheeseburger.png",
  },
  {
    name: "hotdog",
    img: "/images/hotdog.png",
  },
  {
    name: "ice-cream",
    img: "/images/ice-cream.png",
  },
  {
    name: "milkshake",
    img: "/images/milkshake.png",
  },
  {
    name: "pizza",
    img: "/images/pizza.png",
  },
];
// Shuffle array
cardArray.sort(() => 0.5 - Math.random());

// We do this imperatively first and then refactor to a React way of doing things.
// Instead of setting attributes, we should update the state so things rerender instead.
export default function MemoryGame() {
  const [cardsChosen, setCardsChosen] = useState<string[]>([]);
  const [cardsChosenIds, setCardsChosenIds] = useState<number[]>([]);
  const [cardsWon, setCardsWon] = useState<string[][]>([]);
  const [result, setResult] = useState<string | null>(null);

  function checkMatch() {
    const cards = document.querySelectorAll("img");
    const optionOneId = cardsChosenIds[0];
    const optionTwoId = cardsChosenIds[1];

    if (optionOneId === optionTwoId) {
      alert("You chose the same card!");
      cards[optionOneId].setAttribute("src", "/images/blank.png");
      cards[optionTwoId].setAttribute("src", "/images/blank.png");
    }

    if (cardsChosen[0] === cardsChosen[1]) {
      alert("You found a match!");
      cards[optionOneId].setAttribute("src", "/images/white.png");
      cards[optionTwoId].setAttribute("src", "/images/white.png");
      // TODO: remove event listeners on the cards.
      // We don't want to remove the event listener that's handled by React, though.
      // We can solve this in a different way later by using data instead of imperatively setting attributes.

      setCardsWon((prev) => [...prev, cardsChosen]);
    } else {
      cards[optionOneId].setAttribute("src", "/images/blank.png");
      cards[optionTwoId].setAttribute("src", "/images/blank.png");
      alert("Sorry try again!");
    }

    setCardsChosen([]);
    setCardsChosenIds([]);

    setResult(cardsWon.length.toString());

    if (cardsWon.length === cardArray.length / 2) {
      setResult("Congratulations, you found them all!");
    }
  }

  // TODO: play a sound when a card is flipped
  const flipCard: React.MouseEventHandler<HTMLImageElement> = (event) => {
    const element = event.currentTarget;
    const id = Number(element.getAttribute("data-id"));
    const card = cardArray[id];

    setCardsChosen((prev) => [...prev, card.name]);
    setCardsChosenIds((prev) => [...prev, id]);

    element.setAttribute("src", card.img);
  };

  if (cardsChosen.length === 2) {
    console.log("cards chosen");
    window.setTimeout(checkMatch, 500);
  }

  console.log(cardsChosen);

  return (
    <main className="min-h-screen p-24">
      <h1>Memory Game</h1>
      <p>Score: {result}</p>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {cardArray.map((_card, index) => (
          <li
            key={index}
            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg overflow-hidden bg-white text-center shadow"
          >
            <img
              onClick={flipCard}
              data-id={index}
              alt="blank card"
              src="/images/blank.png"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
