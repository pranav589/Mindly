import { CustomAlert } from "@/components/CustomAlert/CustomAlert";
import React, { createContext, useContext, useState } from "react";

export interface CustomAlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void | Promise<void>;
}

export interface CustomAlertOptions {
  title: string;
  message?: string;
  buttons?: CustomAlertButton[];
  type?: "info" | "success" | "warning" | "error";
}

interface CustomAlertContextType {
  showAlert: (options: CustomAlertOptions) => void;
  hideAlert: () => void;
}

const CustomAlertContext = createContext<CustomAlertContextType | undefined>(
  undefined,
);

export const CustomAlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<CustomAlertOptions | null>(null);

  const showAlert = (newOptions: CustomAlertOptions) => {
    setOptions(newOptions);
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  return (
    <CustomAlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert visible={visible} options={options} onClose={hideAlert} />
    </CustomAlertContext.Provider>
  );
};

export const useCustomAlert = () => {
  const context = useContext(CustomAlertContext);
  if (!context) {
    throw new Error("useCustomAlert must be used within a CustomAlertProvider");
  }
  return context;
};
