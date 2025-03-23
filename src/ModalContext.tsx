import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
    openUserFlow: boolean;
    toggleUserFlow: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [openUserFlow, setOpenUserFlow] = useState<boolean>(false);

    const toggleUserFlow = () => {
        setOpenUserFlow(prev => !prev);
    };

    return (
        <ModalContext.Provider value={{ openUserFlow, toggleUserFlow }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useModalContext must be used within a ModalProvider");
    }
    return context;
};
