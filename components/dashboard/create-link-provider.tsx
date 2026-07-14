"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { CreateLinkModal } from "@/components/dashboard/create-link-modal";

type CreateLinkContextValue = {
  open: boolean;
  openCreateLink: () => void;
  closeCreateLink: () => void;
};

const CreateLinkContext = createContext<CreateLinkContextValue | null>(null);

export function CreateLinkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openCreateLink = useCallback(() => setOpen(true), []);
  const closeCreateLink = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openCreateLink, closeCreateLink }),
    [open, openCreateLink, closeCreateLink]
  );

  return (
    <CreateLinkContext.Provider value={value}>
      {children}
      <CreateLinkModal open={open} onOpenChange={setOpen} />
    </CreateLinkContext.Provider>
  );
}

export function useCreateLinkModal() {
  const ctx = useContext(CreateLinkContext);
  if (!ctx) {
    throw new Error("useCreateLinkModal must be used within CreateLinkProvider");
  }
  return ctx;
}
