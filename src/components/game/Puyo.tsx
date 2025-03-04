"use client";

import { FC } from "react";
import { PuyoType } from "@/store/gameStore";
import { cn } from "@/lib/utils";

interface PuyoProps {
  type: PuyoType | null;
  isClearing?: boolean;
  className?: string;
}

// ぷよの色を設定
const puyoColors: Record<PuyoType, string> = {
  red: "bg-red-500 border-red-700",
  blue: "bg-blue-500 border-blue-700",
  green: "bg-green-500 border-green-700",
  yellow: "bg-yellow-500 border-yellow-700",
};

export const Puyo: FC<PuyoProps> = ({
  type,
  isClearing = false,
  className,
}) => {
  if (!type) return null;

  // 消去アニメーション用のクラス
  const clearingClass = isClearing
    ? "animate-pulse" // Tailwind組み込みのpulseアニメーションを使用
    : "";

  return (
    <div
      className={cn(
        "relative w-full h-full rounded-full border-2 transition-all",
        puyoColors[type],
        clearingClass,
        className
      )}
    >
      {/* ハイライト（光沢効果） */}
      <div className="absolute top-1 left-1 w-1/3 h-1/3 bg-white/30 rounded-full" />
    </div>
  );
};
