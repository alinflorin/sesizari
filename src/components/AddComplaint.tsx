import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  makeStyles,
  MessageBar,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import { useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FirebaseError } from "@firebase/app";
import { Complaint } from "../models/complaint";
import { LatLngExpression } from "leaflet";
import { User } from "../models/user";

export interface AddComplaintProps {
  onClose: (complaint?: Complaint | undefined) => void;
  location: LatLngExpression;
  user: User;
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

export default function AddComplaint(props: AddComplaintProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const formButton = useRef<HTMLButtonElement | null>(null);

  const schema = yup.object().shape({
    description: yup.string().required(t("ui.components.addComplaint.descriptionIsRequired"))
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: ""
    },
  });

  const onSubmit = useCallback(
    async (data: {description: string}) => {
      try {
        console.log(data);
        props.onClose();
      } catch (err) {
        console.error(err);
        if (err instanceof FirebaseError) {
          setError("root.firebase", {
            message: "ui.firebase.errors." + err.message,
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
          <DialogTitle>{t("ui.components.addComplaint.addComplaint")}</DialogTitle>
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
                render={({ field }) => (
                  <Textarea
                    placeholder={t("ui.components.addComplaint.description")}
                    required
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={field.value}
                    disabled={field.disabled}
                    ref={field.ref}
                  />
                )}
              />
              {errors.description && (
                <MessageBar intent="error">
                  {errors.description.message}
                </MessageBar>
              )}

              <button
                type="submit"
                ref={formButton}
                style={{ display: "none" }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => props.onClose()}>
              {t("ui.components.addComplaint.cancel")}
            </Button>
            <Button
              appearance="primary"
              onClick={() => formButton.current?.click()}
            >
              {t("ui.components.addComplaint.save")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
