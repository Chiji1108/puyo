import { create } from "zustand";

// ぷよのタイプ
export type PuyoType = "red" | "blue" | "yellow" | "green";
export type Rotation = 0 | 90 | 180 | 270;

// ゲームの状態
interface GameState {
  // ゲームボード (6x12)
  board: (PuyoType | null)[][];
  // 現在操作中のぷよ
  activePuyo: {
    types: [PuyoType, PuyoType];
    position: [number, number];
    rotation: Rotation;
  } | null;
  // 次のぷよ
  nextPuyo: [PuyoType, PuyoType];
  // スコア
  score: number;
  // ゲーム状態
  gameStatus: "idle" | "playing" | "falling" | "clearing" | "gameover";
  // 連鎖数
  chainCount: number;
  // 連鎖テキストの表示
  showChainText: boolean;
  // タイマーID
  fallTimerId: number | null;

  // アクション
  initializeGame: () => void;
  startGame: () => void;
  movePuyo: (direction: "left" | "right") => void;
  rotatePuyo: (direction: "clockwise" | "counterclockwise") => void;
  dropPuyo: () => void;
  tick: () => void;
  clearPuyos: () => void;
  endGame: () => void;
  resetGame: () => void;
}

// ランダムなぷよタイプを生成
const getRandomPuyoType = (): PuyoType => {
  const types: PuyoType[] = ["red", "blue", "yellow", "green"];
  return types[Math.floor(Math.random() * types.length)];
};

// 新しいぷよペアを生成
const createNewPuyoPair = (): [PuyoType, PuyoType] => {
  return [getRandomPuyoType(), getRandomPuyoType()];
};

// 空のボードを作成
const createEmptyBoard = (): (PuyoType | null)[][] => {
  return Array(12)
    .fill(null)
    .map(() => Array(6).fill(null));
};

export const useGameStore = create<GameState>((set, get) => ({
  board: createEmptyBoard(),
  activePuyo: null,
  nextPuyo: createNewPuyoPair(),
  score: 0,
  gameStatus: "idle",
  chainCount: 0,
  showChainText: false,
  fallTimerId: null,

  initializeGame: () => {
    set({
      board: createEmptyBoard(),
      activePuyo: null,
      nextPuyo: createNewPuyoPair(),
      score: 0,
      gameStatus: "idle",
      chainCount: 0,
      showChainText: false,
      fallTimerId: null,
    });
  },

  startGame: () => {
    const { initializeGame } = get();
    initializeGame();

    // 最初のぷよを配置
    set((state) => ({
      activePuyo: {
        types: state.nextPuyo,
        position: [2, 0], // ボード上部中央
        rotation: 0,
      },
      nextPuyo: createNewPuyoPair(),
      gameStatus: "playing",
      fallTimerId: window.setInterval(() => {
        get().tick();
      }, 1000) as unknown as number, // 1秒ごとに自動落下
    }));
  },

  movePuyo: (direction: "left" | "right") => {
    const { board, activePuyo, gameStatus } = get();

    if (!activePuyo || gameStatus !== "playing") return;

    const [x, y] = activePuyo.position;
    const newX = direction === "left" ? x - 1 : x + 1;

    // 範囲チェックと衝突チェック
    if (
      newX < 0 ||
      newX > 5 ||
      !isValidMove(board, activePuyo, [newX, y], activePuyo.rotation)
    ) {
      return;
    }

    set({
      activePuyo: {
        ...activePuyo,
        position: [newX, y],
      },
    });
  },

  rotatePuyo: (direction: "clockwise" | "counterclockwise") => {
    const { board, activePuyo, gameStatus } = get();

    if (!activePuyo || gameStatus !== "playing") return;

    const currentRotation = activePuyo.rotation;
    const newRotation = getNewRotation(currentRotation, direction);

    // 範囲チェックと衝突チェック
    if (!isValidMove(board, activePuyo, activePuyo.position, newRotation)) {
      // 壁キックを試みる（少し横にずらして回転できるか確認）
      const [x, y] = activePuyo.position;
      const offsetsToTry = [
        [-1, 0],
        [1, 0],
        [0, -1],
      ]; // 左、右、上方向に壁キックを試みる

      for (const [offsetX, offsetY] of offsetsToTry) {
        const newPosition: [number, number] = [x + offsetX, y + offsetY];
        if (isValidMove(board, activePuyo, newPosition, newRotation)) {
          set({
            activePuyo: {
              ...activePuyo,
              position: newPosition,
              rotation: newRotation,
            },
          });
          return;
        }
      }

      return; // 回転できない
    }

    set({
      activePuyo: {
        ...activePuyo,
        rotation: newRotation,
      },
    });
  },

  dropPuyo: () => {
    const { tick } = get();
    // 高速落下（連続してtickを呼び出す）
    const dropInterval = setInterval(() => {
      const { gameStatus } = get();
      if (gameStatus !== "playing") {
        clearInterval(dropInterval);
        return;
      }
      tick();
    }, 50);

    // 少し経ったら自動的に止める（安全策）
    setTimeout(() => clearInterval(dropInterval), 3000);
  },

  tick: () => {
    const { board, activePuyo, gameStatus, clearPuyos, endGame } = get();

    if (gameStatus !== "playing" || !activePuyo) return;

    const [x, y] = activePuyo.position;
    const newY = y + 1;

    // 下に移動できるかチェック
    if (
      newY < 12 &&
      isValidMove(board, activePuyo, [x, newY], activePuyo.rotation)
    ) {
      // 下に移動
      set({
        activePuyo: {
          ...activePuyo,
          position: [x, newY],
        },
      });
    } else {
      // 移動できない場合は、ぷよをボードに固定
      const newBoard = [...board.map((row) => [...row])];
      const [mainX, mainY] = activePuyo.position;

      // メインぷよを配置
      newBoard[mainY][mainX] = activePuyo.types[0];

      // サブぷよの位置を計算して配置
      const subPosition = getSubPuyoPosition(activePuyo);
      const [subX, subY] = subPosition;

      if (subY >= 0 && subY < 12 && subX >= 0 && subX < 6) {
        newBoard[subY][subX] = activePuyo.types[1];
      }

      set({ board: newBoard, activePuyo: null, gameStatus: "falling" });

      // 落下処理とぷよの消去処理をスケジュール
      setTimeout(() => {
        const fallenBoard = applyGravity(get().board);
        set({ board: fallenBoard, gameStatus: "clearing" });

        // ぷよの消去処理
        setTimeout(() => {
          clearPuyos();
        }, 300);
      }, 300);

      // ゲームオーバーチェック（一番上の行にぷよがあるか）
      if (newBoard[0].some((cell) => cell !== null)) {
        endGame();
      }
    }
  },

  clearPuyos: () => {
    const { board } = get();
    const { groupsToRemove, totalRemoved } = findGroupsToRemove(board);

    if (groupsToRemove.length === 0) {
      // 消すぷよがない場合、次のぷよを生成
      set((state) => ({
        gameStatus: "playing",
        chainCount: 0,
        activePuyo: {
          types: state.nextPuyo,
          position: [2, 0],
          rotation: 0,
        },
        nextPuyo: createNewPuyoPair(),
      }));
      return;
    }

    // ぷよを消去
    const newBoard = [...board.map((row) => [...row])];
    groupsToRemove.forEach((group) => {
      group.forEach(([x, y]) => {
        newBoard[y][x] = null;
      });
    });

    // スコア計算（消したぷよの数 x 10 x 連鎖数）
    const chainCount = get().chainCount + 1;
    const scoreToAdd = totalRemoved * 10 * chainCount;

    set((state) => ({
      board: newBoard,
      score: state.score + scoreToAdd,
      chainCount,
      showChainText: true,
      gameStatus: "falling",
    }));

    // 連鎖テキストの表示を一定時間後に消す
    setTimeout(() => {
      set({ showChainText: false });
    }, 1000);

    // 落下処理と次の消去処理をスケジュール
    setTimeout(() => {
      const fallenBoard = applyGravity(get().board);
      set({ board: fallenBoard, gameStatus: "clearing" });

      // 次の消去処理
      setTimeout(() => {
        get().clearPuyos();
      }, 300);
    }, 500);
  },

  endGame: () => {
    const { fallTimerId } = get();

    if (fallTimerId !== null) {
      clearInterval(fallTimerId);
    }

    set({
      gameStatus: "gameover",
      fallTimerId: null,
    });
  },

  resetGame: () => {
    const { fallTimerId, initializeGame } = get();

    if (fallTimerId !== null) {
      clearInterval(fallTimerId);
    }

    initializeGame();
  },
}));

// 回転後のサブぷよの位置を計算
const getSubPuyoPosition = (
  activePuyo: GameState["activePuyo"]
): [number, number] => {
  if (!activePuyo) return [0, 0];

  const [x, y] = activePuyo.position;
  const rotation = activePuyo.rotation;

  switch (rotation) {
    case 0:
      return [x, y - 1]; // 上
    case 90:
      return [x + 1, y]; // 右
    case 180:
      return [x, y + 1]; // 下
    case 270:
      return [x - 1, y]; // 左
    default:
      return [x, y - 1];
  }
};

// 次の回転値を取得
const getNewRotation = (
  currentRotation: Rotation,
  direction: "clockwise" | "counterclockwise"
): Rotation => {
  if (direction === "clockwise") {
    return ((currentRotation + 90) % 360) as Rotation;
  } else {
    return ((currentRotation - 90 + 360) % 360) as Rotation;
  }
};

// 移動が有効かチェック
const isValidMove = (
  board: (PuyoType | null)[][],
  activePuyo: GameState["activePuyo"],
  [newX, newY]: [number, number],
  newRotation: Rotation
): boolean => {
  if (!activePuyo) return false;

  // メインぷよのチェック
  if (
    newX < 0 ||
    newX >= 6 ||
    newY < 0 ||
    newY >= 12 ||
    board[newY][newX] !== null
  ) {
    return false;
  }

  // サブぷよの位置を計算
  const subPosition = (() => {
    switch (newRotation) {
      case 0:
        return [newX, newY - 1]; // 上
      case 90:
        return [newX + 1, newY]; // 右
      case 180:
        return [newX, newY + 1]; // 下
      case 270:
        return [newX - 1, newY]; // 左
    }
  })();

  const [subX, subY] = subPosition;

  // サブぷよのチェック
  if (
    subX < 0 ||
    subX >= 6 ||
    subY < 0 ||
    subY >= 12 ||
    (subY >= 0 && board[subY][subX] !== null) // ボード外の上方向は許可
  ) {
    return false;
  }

  return true;
};

// 重力を適用（浮いているぷよを落下させる）
const applyGravity = (board: (PuyoType | null)[][]): (PuyoType | null)[][] => {
  const newBoard = [...board.map((row) => [...row])];

  // 下から上に処理
  for (let x = 0; x < 6; x++) {
    let emptyY = -1;

    for (let y = 11; y >= 0; y--) {
      if (newBoard[y][x] === null && emptyY === -1) {
        emptyY = y;
      } else if (newBoard[y][x] !== null && emptyY !== -1) {
        // 空きマスにぷよを移動
        newBoard[emptyY][x] = newBoard[y][x];
        newBoard[y][x] = null;
        y = emptyY; // 再度同じ列をスキャン
        emptyY = -1;
      }
    }
  }

  return newBoard;
};

// 消去対象のぷよグループを見つける
const findGroupsToRemove = (
  board: (PuyoType | null)[][]
): {
  groupsToRemove: [number, number][][];
  totalRemoved: number;
} => {
  const visited = Array(12)
    .fill(0)
    .map(() => Array(6).fill(false));
  const groupsToRemove: [number, number][][] = [];
  let totalRemoved = 0;

  // 深さ優先探索で同じ色のぷよをグループ化
  const dfs = (
    x: number,
    y: number,
    color: PuyoType,
    group: [number, number][]
  ) => {
    if (
      x < 0 ||
      x >= 6 ||
      y < 0 ||
      y >= 12 ||
      visited[y][x] ||
      board[y][x] !== color
    ) {
      return;
    }

    visited[y][x] = true;
    group.push([x, y]);

    // 上下左右を探索
    dfs(x + 1, y, color, group);
    dfs(x - 1, y, color, group);
    dfs(x, y + 1, color, group);
    dfs(x, y - 1, color, group);
  };

  // 全てのセルをチェック
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 6; x++) {
      if (!visited[y][x] && board[y][x] !== null) {
        const group: [number, number][] = [];
        dfs(x, y, board[y][x] as PuyoType, group);

        // 4つ以上のグループは消去対象
        if (group.length >= 4) {
          groupsToRemove.push(group);
          totalRemoved += group.length;
        }
      }
    }
  }

  return { groupsToRemove, totalRemoved };
};
