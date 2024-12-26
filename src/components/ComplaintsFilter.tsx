/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { GetComplaintsFilter } from "../models/get-complaints-filter";
import {
  Button,
  Dropdown,
  Field,
  makeStyles,
  MessageBar,
  Option,
  tokens,
} from "@fluentui/react-components";
import { FirebaseError } from "firebase/app";
import { useCallback } from "react";
import { extractErrorMessages } from "../helpers/form-helpers";
import { ComplaintStatus } from "../models/complaint-status";
import { DatePicker } from "@fluentui/react-datepicker-compat";

export interface ComplaintsFilterProps {
  filter: GetComplaintsFilter;
  onChange: (f: GetComplaintsFilter) => void;
}

const useStyles = makeStyles({
  filterWrapper: {
    padding: tokens.spacingVerticalS,
  },
  form: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
});

const allStatuses: ComplaintStatus[] = [
  "answer-sent",
  "in-planning",
  "in-progress",
  "solved",
  "accepted",
];

export default function ComplaintsFilter(props: ComplaintsFilterProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  const schema = yup.object().shape({
    statuses: yup
      .array(
        yup
          .string()
          .required(t("ui.components.complaintsFilter.statusIsRequired"))
      )
      .required(t("ui.components.complaintsFilter.statusesAreRequired")),
    startDate: yup
      .date()
      .typeError(t("ui.components.complaintsFilter.invalidDate")),
    endDate: yup
      .date()
      .typeError(t("ui.components.complaintsFilter.invalidDate")),
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      statuses: props.filter.statuses,
      startDate: props.filter.startDate,
      endDate: props.filter.endDate,
    },
  });

  const onSubmit = useCallback(
    async (data: { statuses: string[] }) => {
      try {
        console.log(data);
      } catch (err) {
        console.error(err);
        if (err instanceof FirebaseError) {
          setError("root.firebase", {
            message: "ui.firebase.errors." + err.code,
          });
        }
      }
    },
    [setError]
  );

  return (
    <div className={classes.filterWrapper}>
      {errors.root?.firebase?.message && (
        <MessageBar intent="error">
          {t(errors.root.firebase.message)}
        </MessageBar>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Controller
          name="statuses"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              label={t("ui.components.complaintsFilter.statuses")}
              validationState={fieldState.invalid ? "error" : "success"}
              validationMessage={extractErrorMessages(fieldState.error)}
            >
              <Dropdown
                name={field.name}
                id="statuses"
                multiselect={true}
                disabled={field.disabled}
                ref={field.ref}
                onBlur={field.onBlur}
                value={field.value as any}
                onChange={field.onChange}
              >
                {allStatuses.map((s) => (
                  <Option key={s} value={s}>
                    {t("ui.components.complaintsFilter.allStatuses." + s)}
                  </Option>
                ))}
              </Dropdown>
            </Field>
          )}
        />

        <Controller
          name="startDate"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              label={t("ui.components.complaintsFilter.startDate")}
              validationState={fieldState.invalid ? "error" : "success"}
              validationMessage={extractErrorMessages(fieldState.error)}
            >
              <DatePicker
                name={field.name}
                id="startDate"
                disabled={field.disabled}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            </Field>
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              label={t("ui.components.complaintsFilter.endDate")}
              validationState={fieldState.invalid ? "error" : "success"}
              validationMessage={extractErrorMessages(fieldState.error)}
            >
              <DatePicker
                name={field.name}
                id="endDate"
                disabled={field.disabled}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            </Field>
          )}
        />

        <div className={classes.buttonWrapper}>
          <Button appearance="primary" type="submit">
            {t("ui.components.complaintsFilter.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
