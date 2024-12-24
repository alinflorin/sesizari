import { Button, makeStyles } from "@fluentui/react-components";
import {
  ArrowUploadRegular,
  DocumentDismissRegular,
} from "@fluentui/react-icons";
import {
  ChangeEvent,
  FocusEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";
import { RefCallBack } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface FileUploadProps {
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: File[];
  id?: string;
  accept?: string;
  onBlur?: FocusEventHandler;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (...event: any[]) => void;
  refCb?: RefCallBack;
}

const useStyles = makeStyles({
  inputFile: {
    display: "none",
  },
  uploadButton: {
    flex: "auto",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%"
  },
  row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.5rem",
  },
});

export default function FileUpload(props: FileUploadProps) {
  const classes = useStyles();
  const { t } = useTranslation();
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>(props.value || []);
  console.log(files);
  const invokeUpload = useCallback(() => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }, [inputFileRef]);

  const onFilesSelected = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles: File[] = [];
      if (e.target.files) {
        for (let i = 0; i < e.target.files.length; i++) {
          const f = e.target.files.item(i);
          if (f) {
            selectedFiles.push(f);
          }
        }
      }
      setFiles(selectedFiles);
      if (props.onChange) {
        props.onChange({
          target: {
            value: selectedFiles,
          },
        });
      }
    },
    [props]
  );

  const clearFiles = useCallback(() => {
    setFiles([]);
    if (props.onChange) {
      props.onChange({
        target: {
          value: [],
        },
      });
    }
  }, [props]);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.row}>
          <Button
            disabled={props.disabled}
            onBlur={props.onBlur}
            onClick={invokeUpload}
            ref={props.refCb}
            id={props.id}
            appearance="primary"
            className={classes.uploadButton}
          >
            <ArrowUploadRegular />
            <span>{t("ui.components.fileUpload.upload")}</span>
          </Button>
          {files && files.length > 0 && (
            <Button onClick={clearFiles} appearance="secondary">
              <DocumentDismissRegular />
              <span>{t("ui.components.fileUpload.clear")}</span>
            </Button>
          )}
        </div>
        
      </div>
      <input
        type="file"
        name={props.name}
        ref={inputFileRef}
        required={props.required}
        onChange={onFilesSelected}
        accept={props.accept}
        multiple={props.multiple}
        disabled={props.disabled}
        className={classes.inputFile}
      />
    </>
  );
}
