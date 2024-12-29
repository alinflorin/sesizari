import { useTranslation } from "react-i18next";
import {
  Button,
  Caption2,
  Caption2Strong,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Dropdown,
  Field,
  Image,
  Link,
  makeStyles,
  MessageBar,
  Option,
  tokens,
} from "@fluentui/react-components";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FirebaseError } from "@firebase/app";
import { Complaint } from "../models/complaint";
import { extractErrorMessages } from "../helpers/form-helpers";
import { Tenant } from "../models/tenant";
import useFiles from "../hooks/useFiles";
import useComplaints from "../hooks/useComplaints";
import { ComplaintStatus } from "../models/complaint-status";
import FileUpload from "./FileUpload";

export interface EditComplaintProps {
  onClose: (complaint?: Complaint | undefined) => void;
  complaint: Complaint;
  tenant: Tenant;
}

const allStatuses: ComplaintStatus[] = [
  "submitted",
  "accepted",
  "rejected",
  "in-planning",
  "in-progress",
  "solved",
  "answer-sent",
];

const useStyles = makeStyles({
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  popupRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "0.5rem",
  },
  taLeft: {
    textAlign: "left",
  },
  taRight: {
    textAlign: "right",
  },
  photosList: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  photo: {
    maxWidth: "150px",
    cursor: "pointer",
  },
});

export default function EditComplaint(props: EditComplaintProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const formButton = useRef<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { uploadFile } = useFiles();
  const { updateComplaint } = useComplaints();

  const schema = yup.object().shape({
    category: yup
      .string()
      .required(t("ui.components.editComplaint.categoryIsRequired"))
      .oneOf(
        props.tenant.categories,
        t("ui.components.editComplaint.invalidCategory")
      ),
    status: yup
      .string()
      .required(t("ui.components.editComplaint.statusIsRequired"))
      .oneOf(allStatuses, t("ui.components.editComplaint.invalidStatus")),
    resolutionPhotos: yup
      .array()
      .of(
        yup
          .mixed<File>()
          .required(t("ui.components.editComplaint.fileIsRequired"))
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
      category: props.complaint.category,
      resolutionPhotos: [],
      status: props.complaint.status,
    },
  });

  const onSubmit = useCallback(
    async (data: {
      category: string;
      status: string;
      resolutionPhotos?: File[] | undefined;
    }) => {
      setLoading(true);
      try {
        const fileUrls: string[] = [];
        if (data.resolutionPhotos) {
          for (const f of data.resolutionPhotos as File[]) {
            fileUrls.push(await uploadFile(f, f.name, "/", f.type));
          }
        }
        
        const editedComplaint: Partial<Complaint> = {
          category: data.category,
          resolutionPhotos:
            fileUrls && fileUrls.length
              ? fileUrls
              : [],
          status: data.status as ComplaintStatus,
        };

        const finalComplaint = await updateComplaint(
          props.complaint.id!,
          editedComplaint
        );

        props.onClose(finalComplaint);
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
    [props, setError, uploadFile, updateComplaint]
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
            <div className={classes.popupRow}>
              <Caption2Strong className={classes.taRight}>
                {t("ui.components.editComplaint.id")}:
              </Caption2Strong>
              <Caption2 className={classes.taLeft}>
                {props.complaint.id}
              </Caption2>
            </div>
            <div className={classes.popupRow}>
              <Caption2Strong className={classes.taRight}>
                {t("ui.components.editComplaint.description")}:
              </Caption2Strong>
              <Caption2 className={classes.taLeft}>
                {props.complaint.description}
              </Caption2>
            </div>
            <div className={classes.popupRow}>
              <Caption2Strong className={classes.taRight}>
                {t("ui.components.editComplaint.author")}:
              </Caption2Strong>
              <Caption2 className={classes.taLeft}>
                {props.complaint.authorName} (
                <Link href={"mailto:" + props.complaint.authorEmail}>
                  {props.complaint.authorEmail}
                </Link>
                )
              </Caption2>
            </div>
            {props.complaint.submissionPhotos &&
              props.complaint.submissionPhotos.length > 0 && (
                <div className={classes.popupRow}>
                  <Caption2Strong className={classes.taRight}>
                    {t("ui.components.editComplaint.submissionPhotos")}:
                  </Caption2Strong>
                  <div className={classes.photosList}>
                    {props.complaint.submissionPhotos.map((p) => (
                      <Link key={p} href={p} target="_blank">
                        <Image src={p} className={classes.photo} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            {props.complaint.resolutionPhotos &&
              props.complaint.resolutionPhotos.length > 0 && (
                <div className={classes.popupRow}>
                  <Caption2Strong className={classes.taRight}>
                    {t("ui.components.editComplaint.resolutionPhotos")}:
                  </Caption2Strong>
                  <div className={classes.photosList}>
                    {props.complaint.resolutionPhotos.map((p) => (
                      <Link key={p} href={p} target="_blank">
                        <Image src={p} className={classes.photo} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            <div className={classes.popupRow}>
              <Caption2Strong className={classes.taRight}>
                {t("ui.components.editComplaint.submittedAt")}:
              </Caption2Strong>
              <Caption2 className={classes.taLeft}>
                {props.complaint.submissionDate?.toDate().toLocaleString() ||
                  "-"}
              </Caption2>
            </div>
            <div className={classes.popupRow}>
              <Caption2Strong className={classes.taRight}>
                {t("ui.components.editComplaint.lastUpdateAt")}:
              </Caption2Strong>
              <Caption2 className={classes.taLeft}>
                {props.complaint.lastUpdateAt?.toDate().toLocaleString() || "-"}
              </Caption2>
            </div>
            {errors.root?.firebase?.message && (
              <MessageBar intent="error">
                {t(errors.root.firebase.message)}
              </MessageBar>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.editComplaint.category")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
                    <Dropdown
                      name={field.name}
                      id="category"
                      disabled={field.disabled}
                      ref={field.ref}
                      selectedOptions={[field.value]}
                      onBlur={field.onBlur}
                      onOptionSelect={(_, d) =>
                        field.onChange({ target: { value: d.optionValue } })
                      }
                      value={field.value}
                    >
                      {props.tenant.categories.map((c) => (
                        <Option key={c} value={c}>
                          {c}
                        </Option>
                      ))}
                    </Dropdown>
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.editComplaint.status")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
                    <Dropdown
                      name={field.name}
                      id="status"
                      disabled={field.disabled}
                      ref={field.ref}
                      selectedOptions={[field.value]}
                      onBlur={field.onBlur}
                      onOptionSelect={(_, d) =>
                        field.onChange({ target: { value: d.optionValue } })
                      }
                      value={t(
                        "ui.components.editComplaint.statuses." + field.value
                      )}
                    >
                      {allStatuses.map((c) => (
                        <Option key={c} value={c}>
                          {t("ui.components.editComplaint.statuses." + c)}
                        </Option>
                      ))}
                    </Dropdown>
                  </Field>
                )}
              />

              <Controller
                name="resolutionPhotos"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.editComplaint.resolutionPhotos")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
                    <FileUpload
                      name={field.name}
                      id="resolutionPhotos"
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
