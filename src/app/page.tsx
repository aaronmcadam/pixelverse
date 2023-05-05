"use client";
import { useState } from "react";

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <h2>Games</h2>
      <ul>
        <li>
          <a href="/rock-paper-scissors">Rock Paper Scissors</a>
        </li>
        <li>
          <a href="/memory-game">Memory Game</a>
        </li>
      </ul>
    </main>
  );
}
