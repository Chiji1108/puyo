"use client";

import { FC } from "react";
import { Puyo } from "./Puyo";
import { useGameStore } from "@/store/gameStore";

interface NextPuyoProps {}

export const NextPuyo: FC<NextPuyoProps> = () => {
  const nextPuyo = useGameStore((state) => state.nextPuyo);

  return (
    <div className="bg-gray-800 border-2 border-gray-700 p-3 rounded-lg">
      <h2 className="text-lg font-bold mb-2 text-white">次のぷよ</h2>
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 mb-1">
          <Puyo type={nextPuyo[0]} />
        </div>
        <div className="w-10 h-10">
          <Puyo type={nextPuyo[1]} />
        </div>
      </div>
    </div>
  );
};
