"use client";

import { FC } from "react";
import { useGameStore } from "@/store/gameStore";

type ScorePanelProps = Record<string, never>;

export const ScorePanel: FC<ScorePanelProps> = () => {
  const score = useGameStore((state) => state.score);

  return (
    <div className="bg-gray-800 border-2 border-gray-700 p-3 rounded-lg">
      <h2 className="text-lg font-bold mb-2 text-white">スコア</h2>
      <div className="text-2xl font-bold text-yellow-400 text-right">
        {score.toLocaleString()}
      </div>
    </div>
  );
};
