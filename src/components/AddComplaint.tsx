/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Select,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FirebaseError } from "@firebase/app";
import { Complaint } from "../models/complaint";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { User } from "../models/user";
import { Tenant } from "../models/tenant";
import useComplaints from "../hooks/useComplaints";
import FileUpload from "./FileUpload";
import useFiles from "../hooks/useFiles";
import { extractErrorMessages } from "../helpers/form-helpers";
import { GeoPoint } from "firebase/firestore";

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
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    description: yup
      .string()
      .required(t("ui.components.addComplaint.descriptionIsRequired")),
    category: yup
      .string()
      .required(t("ui.components.addComplaint.categoryIsRequired")),
    submissionPhotos: yup
      .array()
      .of(
        yup
          .mixed<File>()
          .required(t("ui.components.addComplaint.fileIsRequired"))
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
      submissionPhotos: [],
    },
  });

  const { uploadFile } = useFiles();

  const onSubmit = useCallback(
    async (data: {
      description: string;
      category: string;
      submissionPhotos?: any[] | undefined;
    }) => {
      setLoading(true);
      try {
        const fileUrls: string[] = [];
        if (data.submissionPhotos) {
          for (const f of data.submissionPhotos as File[]) {
            fileUrls.push(await uploadFile(f, f.name, "/", f.type));
          }
        }

        const location = props.location as LatLngTuple;

        const newComplaint: Complaint = {
          category: data.category,
          description: data.description,
          status: "submitted",
          authorEmail: props.user.email,
          authorName: props.user.displayName,
          location: new GeoPoint(location[0], location[1]),
        };

        if (fileUrls.length > 0) {
          newComplaint.submissionPhotos = fileUrls;
        }

        const addedComplaint = await addComplaint(newComplaint);
        props.onClose(addedComplaint);
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
    [props, setError, addComplaint, uploadFile]
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
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.addComplaint.description")}
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

              <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.addComplaint.category")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
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
                  </Field>
                )}
              />

              <Controller
                name="submissionPhotos"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.addComplaint.photos")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
                    <FileUpload
                      name={field.name}
                      id="submissionPhotos"
                      disabled={field.disabled}
                      refCb={field.ref}
                      multiple={true}
                      accept="image/*"
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                      required
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
              {t("ui.components.addComplaint.cancel")}
            </Button>
            <Button
              disabled={loading}
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
