import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { SuccessPopup } from '@/components/SuccessPopup';

interface ShowSuccessOptions {
  message: string;
  icon?: string;
  duration?: number;
}

interface SuccessContextType {
  showSuccess: (options: ShowSuccessOptions) => void;
}

const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

export function SuccessProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState<(ShowSuccessOptions & { id: number }) | null>(null);

  const showSuccess = useCallback((options: ShowSuccessOptions) => {
    const id = Date.now();
    setPopup({ ...options, id });
  }, []);

  return (
    <SuccessContext.Provider value={{ showSuccess }}>
      {children}
      {popup && (
        <SuccessPopup
          message={popup.message}
          icon={popup.icon}
          duration={popup.duration}
          onDismiss={() => setPopup(null)}
        />
      )}
    </SuccessContext.Provider>
  );
}

export function useSuccess() {
  const context = useContext(SuccessContext);
  if (!context) {
    throw new Error('useSuccess must be used within SuccessProvider');
  }
  return context;
}
