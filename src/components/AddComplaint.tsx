import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Label,
  makeStyles,
  MessageBar,
  Select,
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
import { Tenant } from "../models/tenant";
import useComplaints from "../hooks/useComplaints";

export interface AddComplaintProps {
  onClose: (complaint?: Complaint | undefined) => void;
  location: LatLngExpression;
  user: User;
  tenant: Tenant;
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
  const { addComplaint } = useComplaints();

  const schema = yup.object().shape({
    description: yup
      .string()
      .required(t("ui.components.addComplaint.descriptionIsRequired")),
    category: yup
      .string()
      .required(t("ui.components.addComplaint.categoryIsRequired")),
    submissionPhotos: yup.array(
      yup.string().required(t("ui.components.addComplaint.fileIsRequired")).url(t("ui.components.addComplaint.invalidUrl"))
    ),
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "",
      category: undefined,
    },
  });

  const onSubmit = useCallback(
    async (data: { description: string; category: string }) => {
      try {
        const newComplaint: Complaint = {
          category: data.category,
          description: data.description,
          status: "submitted",
          authorEmail: props.user.email,
          authorName: props.user.displayName,
        };
        const addedComplaint = await addComplaint(newComplaint);
        props.onClose(addedComplaint);
      } catch (err) {
        console.error(err);
        if (err instanceof FirebaseError) {
          setError("root.firebase", {
            message: "ui.firebase.errors." + err.message,
          });
        }
      }
    },
    [props, setError, addComplaint]
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
            {t("ui.components.addComplaint.addComplaint")}
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
                render={({ field }) => (
                  <Textarea
                    placeholder={t("ui.components.addComplaint.description")}
                    required
                    rows={5}
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

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="category">
                      {t("ui.components.addComplaint.category")}
                    </Label>
                    <Select
                      name={field.name}
                      id="category"
                      disabled={field.disabled}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                      required
                    >
                      <option value={undefined}></option>
                      {props.tenant.categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </>
                )}
              />
              {errors.category && (
                <MessageBar intent="error">
                  {errors.category.message}
                </MessageBar>
              )}

              <Controller
                name="submissionPhotos"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="submissionPhotos">
                      {t("ui.components.addComplaint.photos")}
                    </Label>
                    <Select
                      name={field.name}
                      id="submissionPhotos"
                      disabled={field.disabled}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                      required
                    >
                      <option value={undefined}></option>
                    </Select>
                  </>
                )}
              />
              {errors.submissionPhotos?.message && (
                <MessageBar intent="error">
                  {errors.submissionPhotos.message}
                </MessageBar>
              )}
              {Array.isArray(errors.submissionPhotos) &&
                errors.submissionPhotos.map((e, i) => (
                  <MessageBar key={i + ""} intent="error">
                    {e.message}
                  </MessageBar>
                ))}

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
