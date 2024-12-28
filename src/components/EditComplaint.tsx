import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  makeStyles,
  MessageBar,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FirebaseError } from "@firebase/app";
import { Complaint } from "../models/complaint";
import { extractErrorMessages } from "../helpers/form-helpers";

export interface EditComplaintProps {
  onClose: (complaint?: Complaint | undefined) => void;
  complaint: Complaint;
}

const useStyles = makeStyles({
  form: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
});

export default function EditComplaint(props: EditComplaintProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const formButton = useRef<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    description: yup.string().required(t("ui.components.editComplaint.descriptionIsRequired"))
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {

    },
  });


  const onSubmit = useCallback(
    async () => {
      setLoading(true);
      try {
        props.onClose();
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        if (err instanceof FirebaseError) {
          setError("root.firebase", {
            message: "ui.firebase.errors." + err.code,
          });
        }
      }
    },
    [props, setError]
  );

  return (
    <Dialog
      modalType="modal"
      defaultOpen
      onOpenChange={(_, d) => {
        if (!d.open && props.onClose) {
          props.onClose();
        }
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            {t("ui.components.editComplaint.manageComplaint")}
          </DialogTitle>
          <DialogContent>
            {errors.root?.firebase?.message && (
              <MessageBar intent="error">
                {t(errors.root.firebase.message)}
              </MessageBar>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.editComplaint.description")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
                    <Textarea
                      required
                      rows={5}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                      disabled={field.disabled}
                      ref={field.ref}
                    />
                  </Field>
                )}
              />


              <button
                type="submit"
                ref={formButton}
                style={{ display: "none" }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => props.onClose()}>
              {t("ui.components.editComplaint.cancel")}
            </Button>
            <Button
              disabled={loading}
              appearance="primary"
              onClick={() => formButton.current?.click()}
            >
              {t("ui.components.editComplaint.save")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
