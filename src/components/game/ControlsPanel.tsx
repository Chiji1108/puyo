"use client";

import { FC } from "react";

interface ControlsPanelProps {}

export const ControlsPanel: FC<ControlsPanelProps> = () => {
  return (
    <div className="bg-gray-800 border-2 border-gray-700 p-3 rounded-lg">
      <h2 className="text-lg font-bold mb-2 text-white">操作方法</h2>
      <ul className="text-sm text-gray-200 space-y-1">
        <li>← →: 左右移動</li>
        <li>↑: 回転（時計回り）</li>
        <li>Z: 回転（反時計回り）</li>
        <li>↓: 高速落下</li>
        <li>Space: スタート</li>
        <li>R: リセット</li>
      </ul>
    </div>
  );
};
