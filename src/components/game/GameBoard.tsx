"use client";

import { FC } from "react";
import { Puyo } from "./Puyo";
import { useGameStore, PuyoType } from "@/store/gameStore";

type GameBoardProps = Record<string, never>;

export const GameBoard: FC<GameBoardProps> = () => {
  const board = useGameStore((state) => state.board);
  const activePuyo = useGameStore((state) => state.activePuyo);
  const gameStatus = useGameStore((state) => state.gameStatus);

  // アクティブぷよの位置を計算
  const getActivePuyoPositions = (): {
    mainPos: [number, number];
    subPos: [number, number];
    types: [PuyoType, PuyoType];
  } | null => {
    if (!activePuyo) return null;

    const { types, position, rotation } = activePuyo;
    const [x, y] = position;
    const mainPos: [number, number] = [x, y];

    // 回転に基づいてサブぷよの位置を計算
    let subPos: [number, number];
    switch (rotation) {
      case 0: // 上
        subPos = [x, y - 1];
        break;
      case 90: // 右
        subPos = [x + 1, y];
        break;
      case 180: // 下
        subPos = [x, y + 1];
        break;
      case 270: // 左
        subPos = [x - 1, y];
        break;
      default:
        subPos = [x, y - 1];
    }

    return { mainPos, subPos, types };
  };

  // アクティブぷよの位置を取得
  const activePuyoPositions = getActivePuyoPositions();

  // セルが消去中かどうかをチェック
  const isCellClearing = (): boolean => {
    return gameStatus === "clearing";
  };

  return (
    <div className="grid grid-cols-6 grid-rows-12 gap-0.5 border-2 border-gray-700 bg-gray-800 p-1 w-72 h-144">
      {board.map((row, y) =>
        row.map((cell, x) => {
          // 表示するぷよタイプを決定（ボード上のぷよまたはアクティブぷよ）
          let puyoType: PuyoType | null = cell;
          let isActive = false;

          // アクティブぷよの表示
          if (activePuyoPositions) {
            const { mainPos, subPos, types } = activePuyoPositions;
            if (mainPos[0] === x && mainPos[1] === y) {
              puyoType = types[0];
              isActive = true;
            } else if (subPos[0] === x && subPos[1] === y && subPos[1] >= 0) {
              puyoType = types[1];
              isActive = true;
            }
          }

          return (
            <div
              key={`${x}-${y}`}
              className={`relative aspect-square ${isActive ? "z-10" : ""}`}
              style={{
                gridColumn: x + 1,
                gridRow: y + 1,
              }}
            >
              <Puyo
                type={puyoType}
                isClearing={!isActive && puyoType !== null && isCellClearing()}
                className={isActive ? "border-white" : ""}
              />
            </div>
          );
        })
      )}
    </div>
  );
};
