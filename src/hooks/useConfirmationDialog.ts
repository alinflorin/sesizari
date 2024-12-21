import { useContext } from "react";
import { ConfirmationDialogContext } from "../contexts/confirmation-dialog.context";
import { ConfirmationDialogContextType } from "../contexts/confirmation-dialog.provider";

export const useConfirmationDialog = (): ConfirmationDialogContextType => {
  const context = useContext(ConfirmationDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmationDialog must be used within a ConfirmationDialogProvider"
    );
  }
  return context;
};