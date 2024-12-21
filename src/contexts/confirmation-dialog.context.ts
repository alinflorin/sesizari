import { createContext } from "react";
import { ConfirmationDialogContextType } from "./confirmation-dialog.provider";

export const ConfirmationDialogContext = createContext<
  ConfirmationDialogContextType | undefined
>(undefined);
