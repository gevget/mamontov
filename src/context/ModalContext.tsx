import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ModalVariant = 'project' | 'estimate' | 'partner' | 'question';

interface ModalContextType {
  isOpen: boolean;
  variant: ModalVariant;
  contextData?: any;
  openModal: (variant?: ModalVariant, contextData?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<ModalVariant>('project');
  const [contextData, setContextData] = useState<any>(undefined);

  const openModal = useCallback((v: ModalVariant = 'project', data?: any) => {
    setVariant(v);
    setContextData(data);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, variant, contextData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
