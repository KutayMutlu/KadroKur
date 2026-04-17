"use client";

import { createContext, useContext } from "react";

export type PanelUser = {
  id: string;
  email: string | null;
};

const UserPanelContext = createContext<PanelUser | null>(null);

export function UserPanelProvider({
  user,
  children,
}: {
  user: PanelUser;
  children: React.ReactNode;
}) {
  return <UserPanelContext.Provider value={user}>{children}</UserPanelContext.Provider>;
}

export function useUserPanelUser() {
  const user = useContext(UserPanelContext);
  if (!user) {
    throw new Error("useUserPanelUser must be used within UserPanelProvider");
  }
  return user;
}
