"use client";

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  inviteMembersModal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [inviteMembersModalOpen, setInviteMembersModalOpen] = useState(false);

  const value: ModalContextType = {
    inviteMembersModal: {
      isOpen: inviteMembersModalOpen,
      open: () => setInviteMembersModalOpen(true),
      close: () => setInviteMembersModalOpen(false),
    },
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
