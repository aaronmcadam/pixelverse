import { clsx } from "clsx";

const games = [
  {
    name: "Rock Paper Scissors",
    url: "/rock-paper-scissors",
    initials: "RPS",
    color: "bg-green-600",
  },
  {
    name: "Memory Game",
    url: "memory-game",
    initials: "MG",
    color: "bg-orange-600",
  },
  {
    name: "Whac-a-mole",
    url: "whac-a-mole",
    initials: "WM",
    color: "bg-blue-600",
  },
];

export default function Home() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Games
      </h2>
      <ul role="list" className="divide-y divide-gray-800">
        {games.map((game) => (
          <li key={game.url} className="flex justify-between gap-x-6 py-5">
            <div className="flex items-center gap-x-4">
              <div
                className={clsx(
                  game.color,
                  "flex w-12 h-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                )}
              >
                {game.initials}
              </div>
              <div className="min-w-0 flex-auto">
                <a
                  href={game.url}
                  className="text-lg font-semibold leading-6 text-white"
                >
                  {game.name}
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
