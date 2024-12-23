/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import {
  Button,
  makeStyles,
  MessageBar,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  Title1,
} from "@fluentui/react-components";
import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FirebaseError } from "@firebase/app";
import useSettingsOnce from "../hooks/useSettingsOnce";
import { Settings } from "../models/settings";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%"
  }
});

export default function AppSettings() {
  const { t } = useTranslation();
  const classes = useStyles();

  const schema = yup.object().shape({
    superAdmins: yup
      .array(
        yup
          .string()
          .email(t("ui.routes.appSettings.superAdminEmailIsInvalid"))
          .required(t("ui.routes.appSettings.superAdminEmailIsRequired"))
      )
      .required(t("ui.routes.appSettings.superAdminsAreRequired"))
      .min(1, t("ui.routes.appSettings.superAdminsAreRequired")),
  });

  const {
    handleSubmit,
    control,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      superAdmins: [],
    },
  });

  const { settings, updateSettings, loading } = useSettingsOnce();

  useEffect(() => {
    if (!loading && settings && getValues("superAdmins").length === 0) {
      setValue("superAdmins", settings.superAdmins, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [loading, settings, getValues, setValue]);

  const [success, setSuccess] = useState(false);

  const onSubmit = useCallback(
    async (data: { superAdmins: string[] }) => {
      setSuccess(false);
      try {
        const newSettings: Settings = {
          superAdmins: data.superAdmins,
        };
        await updateSettings(newSettings);
        setSuccess(true);
      } catch (err) {
        setSuccess(false);
        console.error(err);
        if (err instanceof FirebaseError) {
          setError("root.firebase", {
            message: "ui.firebase.errors." + err.message,
          });
        }
      }
    },
    [setError, updateSettings]
  );

  const [adminInputValue, setAdminInputValue] = useState("");
  const adminInputKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      value: string[],
      onChange: (...event: any[]) => void
    ) => {
      if (e.key === "Enter" && adminInputValue) {
        setAdminInputValue("");
        const newData = value.includes(adminInputValue)
          ? value
          : [...value, adminInputValue];
        onChange({ target: { value: newData } });
      }
    },
    [adminInputValue, setAdminInputValue]
  );

  return (
    <div className={classes.container}>
      <Title1>{t("ui.routes.appSettings.appSettings")}</Title1>
      <div className={classes.content}>
        {success && (
          <MessageBar intent="success">
            {t("ui.routes.appSettings.savedSuccessfully")}
          </MessageBar>
        )}
        {errors.root?.firebase?.message && (
          <MessageBar intent="error">
            {t(errors.root.firebase.message)}
          </MessageBar>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Controller
            name="superAdmins"
            control={control}
            render={({ field }) => (
              <TagPicker
                disabled={field.disabled}
                noPopover
                selectedOptions={field.value}
                onOptionSelect={(_, d) =>
                  field.onChange({ target: { value: d.selectedOptions } })
                }
              >
                <TagPickerControl onBlur={field.onBlur} ref={field.ref}>
                  <TagPickerGroup>
                    {field.value.map((option, index) => (
                      <Tag as="span" key={index} shape="rounded" value={option}>
                        {option}
                      </Tag>
                    ))}
                  </TagPickerGroup>
                  <TagPickerInput
                    disabled={field.disabled}
                    value={adminInputValue}
                    onBlur={field.onBlur}
                    type="email"
                    placeholder={t("ui.routes.appSettings.superAdmins")}
                    onChange={(e) => setAdminInputValue(e.target.value)}
                    onKeyDown={(e) =>
                      adminInputKeyDown(e, field.value, field.onChange)
                    }
                  />
                </TagPickerControl>
              </TagPicker>
            )}
          />
          {errors.superAdmins?.message && (
            <MessageBar intent="error">{errors.superAdmins.message}</MessageBar>
          )}
          {Array.isArray(errors.superAdmins) &&
            errors.superAdmins.map((e, i) => (
              <MessageBar key={i + ""} intent="error">
                {e.message}
              </MessageBar>
            ))}

          <div className={classes.buttonWrapper}>
            <Button
              appearance="primary"
              type="submit"
            >
              {t("ui.routes.appSettings.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
