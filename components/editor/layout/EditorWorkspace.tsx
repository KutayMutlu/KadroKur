"use client";

import { EditorSidebar, type EditorSidebarProps } from "../EditorSidebar";

export interface EditorWorkspaceProps {
  isLg: boolean;
  sidebarProps: EditorSidebarProps;
  children: React.ReactNode;
}

export function EditorWorkspace({ isLg, sidebarProps, children }: EditorWorkspaceProps) {
  return (
    <div
      className={
        isLg
          ? "grid min-h-0 flex-1 items-stretch gap-4 sm:gap-6 lg:grid-cols-[350px_minmax(0,1fr)]"
          : "flex min-h-0 flex-1 flex-col"
      }
    >
      {isLg && (
        <aside className="flex min-h-0 max-h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[var(--card)]/85 p-3 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur sm:rounded-2xl sm:p-4 lg:h-full lg:self-stretch">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <EditorSidebar {...sidebarProps} />
          </div>
        </aside>
      )}
      <div className={`relative min-h-0 min-w-0 overflow-hidden ${isLg ? "lg:h-full" : "flex-1"}`}>
        {children}
      </div>
    </div>
  );
}
