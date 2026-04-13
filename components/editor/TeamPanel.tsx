"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
export interface TeamPanelProps {
  teamName: string;
  onTeamNameChange: (name: string) => void;
}

export function TeamPanel({
  teamName,
  onTeamNameChange,
}: TeamPanelProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-black/10 p-3">
      <div>
        <Label htmlFor="teamName">Takım adı</Label>
        <Input
          id="teamName"
          className="mt-1"
          value={teamName}
          onChange={(e) => onTeamNameChange(e.target.value)}
          placeholder="Takımınızın adını giriniz"
        />
      </div>

      <p className="text-xs text-[var(--muted)]">
        Oyuncu düzenlemek için sahadaki formaya çift tıklayın.
      </p>
    </div>
  );
}
