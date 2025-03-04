"use client";

import { FC, useEffect } from "react";
import { GameBoard } from "./GameBoard";
import { NextPuyo } from "./NextPuyo";
import { ScorePanel } from "./ScorePanel";
import { ControlsPanel } from "./ControlsPanel";
import { ChainText } from "./ChainText";
import { useGameStore } from "@/store/gameStore";

type PuyoGameProps = Record<string, never>;

export const PuyoGame: FC<PuyoGameProps> = () => {
  const startGame = useGameStore((state) => state.startGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const movePuyo = useGameStore((state) => state.movePuyo);
  const rotatePuyo = useGameStore((state) => state.rotatePuyo);
  const dropPuyo = useGameStore((state) => state.dropPuyo);
  const gameStatus = useGameStore((state) => state.gameStatus);

  // キーボード入力処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          movePuyo("left");
          break;
        case "ArrowRight":
          movePuyo("right");
          break;
        case "ArrowUp":
          rotatePuyo("clockwise");
          break;
        case "z":
        case "Z":
          rotatePuyo("counterclockwise");
          break;
        case "ArrowDown":
          dropPuyo();
          break;
        case " ": // スペースキー
          if (gameStatus === "idle" || gameStatus === "gameover") {
            startGame();
          }
          break;
        case "r":
        case "R":
          resetGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [movePuyo, rotatePuyo, dropPuyo, startGame, resetGame, gameStatus]);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          ぷよぷよ
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-start gap-6">
          <div className="relative">
            <GameBoard />
            <ChainText />

            {/* ゲームオーバー表示 */}
            {gameStatus === "gameover" && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-white mb-4">
                  ゲームオーバー
                </div>
                <div className="text-xl text-gray-300 mb-8">
                  スペースキーでリスタート
                </div>
              </div>
            )}

            {/* スタート画面 */}
            {gameStatus === "idle" && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-white mb-4">
                  ぷよぷよ
                </div>
                <div className="text-xl text-gray-300 mb-8">
                  スペースキーでスタート
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 w-full md:w-auto">
            <NextPuyo />
            <ScorePanel />
            <ControlsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
