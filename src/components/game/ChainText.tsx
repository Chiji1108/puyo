"use client";

import { FC } from "react";
import { useGameStore } from "@/store/gameStore";

type ChainTextProps = Record<string, never>;

export const ChainText: FC<ChainTextProps> = () => {
  const showChainText = useGameStore((state) => state.showChainText);
  const chainCount = useGameStore((state) => state.chainCount);

  if (!showChainText || chainCount === 0) return null;

  // Tailwindの組み込みアニメーションを使用
  const animationClasses = "animate-[pop-in-out_1s_ease-out]";

  // 連鎖数に応じたテキストとスタイルを設定
  const getChainMessage = (): { text: string; color: string } => {
    if (chainCount === 1) {
      return { text: "1連鎖!", color: "text-blue-400" };
    } else if (chainCount === 2) {
      return { text: "2連鎖!!", color: "text-green-400" };
    } else if (chainCount === 3) {
      return { text: "3連鎖!!!", color: "text-yellow-400" };
    } else if (chainCount === 4) {
      return { text: "4連鎖!!!!", color: "text-red-400" };
    } else {
      return { text: `${chainCount}連鎖!!!!!`, color: "text-purple-400" };
    }
  };

  const { text, color } = getChainMessage();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className={`text-4xl font-bold ${color} drop-shadow-lg bg-black/50 px-6 py-3 rounded-lg ${animationClasses}`}
      >
        {text}
      </div>
    </div>
  );
};
