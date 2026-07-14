"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { CreateLinkModal } from "@/components/dashboard/create-link-modal";

export type EditableLink = {
  id: string;
  original_url: string;
  short_code: string;
  title: string | null;
};

type CreateLinkContextValue = {
  open: boolean;
  editingLink: EditableLink | null;
  openCreateLink: () => void;
  openEditLink: (link: EditableLink) => void;
  closeCreateLink: () => void;
};

const CreateLinkContext = createContext<CreateLinkContextValue | null>(null);

export function CreateLinkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<EditableLink | null>(null);

  const openCreateLink = useCallback(() => {
    setEditingLink(null);
    setOpen(true);
  }, []);

  const openEditLink = useCallback((link: EditableLink) => {
    setEditingLink(link);
    setOpen(true);
  }, []);

  const closeCreateLink = useCallback(() => {
    setOpen(false);
    setEditingLink(null);
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setEditingLink(null);
    }
  }

  const value = useMemo(
    () => ({
      open,
      editingLink,
      openCreateLink,
      openEditLink,
      closeCreateLink,
    }),
    [open, editingLink, openCreateLink, openEditLink, closeCreateLink]
  );

  return (
    <CreateLinkContext.Provider value={value}>
      {children}
      <CreateLinkModal
        open={open}
        onOpenChange={handleOpenChange}
        editingLink={editingLink}
      />
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
