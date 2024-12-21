import { ReactNode, useCallback, useState } from "react";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { ConfirmationDialogContext } from "./confirmation-dialog.context";

export interface ConfirmationDialogOptions {
  title: string | undefined;
  content: string | undefined;
}

export type ConfirmationDialogContextType = {
  showDialog: (options?: ConfirmationDialogOptions | undefined) => Promise<boolean>;
};


export const ConfirmationDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationDialogOptions | undefined>(
    undefined
  );
  const [resolvePromise, setResolvePromise] = useState<
    (value: boolean) => void
  >(() => () => {});

  const showDialog = useCallback(
    (options: ConfirmationDialogOptions | undefined = undefined): Promise<boolean> => {
      setOptions(options);
      setIsOpen(true);

      return new Promise<boolean>((resolve) => {
        setResolvePromise(() => resolve);
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolvePromise(true);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolvePromise(false);
  }, [resolvePromise]);

  return (
    <ConfirmationDialogContext.Provider value={{ showDialog }}>
      {children}
      <ConfirmationDialog
        open={isOpen}
        onNo={handleCancel}
        onYes={handleConfirm}
        content={options?.content}
        title={options?.title}
      />
    </ConfirmationDialogContext.Provider>
  );
};
