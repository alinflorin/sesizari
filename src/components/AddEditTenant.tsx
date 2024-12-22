/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { Tenant } from "../models/tenant";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Input,
  makeStyles,
  MessageBar,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  tokens,
} from "@fluentui/react-components";
import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export interface AddEditTenantProps {
  tenant: Tenant;
  onClose: (edited?: Tenant | undefined) => void;
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

export default function AddEditTenant(props: AddEditTenantProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const formButton = useRef<HTMLButtonElement | null>(null);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required(t("ui.components.addEditTenant.nameIsRequired")),
    id: yup
      .string()
      .required(t("ui.components.addEditTenant.idIsRequired"))
      .matches(
        /^[a-z]+(-[a-z]+)*$/,
        t("ui.components.addEditTenant.invalidIdFormat")
      ),
    area: yup
      .string()
      .test(
        "is-valid-area",
        t("ui.components.addEditTenant.invalidAreaFormat"),
        (value) => {
          if (!value) return true;
          const latLngRegex =
            /^-?([1-8]?\d(\.\d+)?|90(\.0+)?),-?((1[0-7]\d(\.\d+)?|180(\.0+)?|(\d{1,2}(\.\d+)?)))( -?([1-8]?\d(\.\d+)?|90(\.0+)?),-?((1[0-7]\d(\.\d+)?|180(\.0+)?|(\d{1,2}(\.\d+)?))))*$/;
          return latLngRegex.test(value);
        }
      ),
    categories: yup
      .array(
        yup
          .string()
          .required(t("ui.components.addEditTenant.categoryIsRequired"))
      )
      .required(t("ui.components.addEditTenant.categoriesAreRequired"))
      .min(1, t("ui.components.addEditTenant.categoriesAreRequired")),
    admins: yup
      .array(
        yup
          .string()
          .email(t("ui.components.addEditTenant.adminEmailIsInvalid"))
          .required(t("ui.components.addEditTenant.adminIsRequired"))
      )
      .required(t("ui.components.addEditTenant.adminsAreRequired"))
      .min(1, t("ui.components.addEditTenant.adminsAreRequired")),
  });

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categories: props.tenant.categories,
      admins: props.tenant.admins,
      area: props.tenant.area
        ?.map((x) => x.latitude + "," + x.longitude)
        .join(" "),
      id: props.tenant.id,
      name: props.tenant.name,
    },
  });

  const onSubmit = useCallback(
    async (data: {
      categories: string[];
      admins: string[];
      name: string;
      id: string;
      area?: string;
    }) => {
      try {
        alert(JSON.stringify(data));
        props.onClose();
      } catch (err) {
        console.error(err);
      }
    },
    [props]
  );

  const [categoryInputValue, setCategoryInputValue] = useState("");
  const categoryInputKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      value: string[],
      onChange: (...event: any[]) => void
    ) => {
      if (e.key === "Enter" && categoryInputValue) {
        setCategoryInputValue("");
        const newData = value.includes(categoryInputValue)
          ? value
          : [...value, categoryInputValue];
        onChange({ target: { value: newData } });
      }
    },
    [categoryInputValue, setCategoryInputValue]
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
    <Dialog
      modalType="non-modal"
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
            {props.tenant.id
              ? t("ui.components.addEditTenant.editTenant")
              : t("ui.components.addEditTenant.addTenant")}
          </DialogTitle>
          <DialogContent>
            {errors.root?.firebase?.message && (
              <MessageBar intent="error">
                {t(errors.root.firebase.message)}
              </MessageBar>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
              <Input
                type="text"
                placeholder={t("ui.components.addEditTenant.id")}
                required
                {...register("id")}
              />
              {errors.id && (
                <MessageBar intent="error">{errors.id.message}</MessageBar>
              )}
              <Input
                type="text"
                placeholder={t("ui.components.addEditTenant.name")}
                required
                {...register("name")}
              />
              {errors.name && (
                <MessageBar intent="error">{errors.name.message}</MessageBar>
              )}

              <Controller
                name="categories"
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
                          <Tag key={index} shape="rounded" value={option}>
                            {option}
                          </Tag>
                        ))}
                      </TagPickerGroup>
                      <TagPickerInput
                        disabled={field.disabled}
                        value={categoryInputValue}
                        onBlur={field.onBlur}
                        placeholder={t(
                          "ui.components.addEditTenant.categories"
                        )}
                        onChange={(e) => setCategoryInputValue(e.target.value)}
                        onKeyDown={(e) =>
                          categoryInputKeyDown(e, field.value, field.onChange)
                        }
                      />
                    </TagPickerControl>
                  </TagPicker>
                )}
              />
              {errors.categories?.message && (
                <MessageBar intent="error">
                  {errors.categories.message}
                </MessageBar>
              )}
              {Array.isArray(errors.categories) &&
                errors.categories.map((e, i) => (
                  <MessageBar key={i + ""} intent="error">
                    {e.message}
                  </MessageBar>
                ))}

              <Controller
                name="admins"
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
                          <Tag key={index} shape="rounded" value={option}>
                            {option}
                          </Tag>
                        ))}
                      </TagPickerGroup>
                      <TagPickerInput
                        disabled={field.disabled}
                        value={adminInputValue}
                        onBlur={field.onBlur}
                        type="email"
                        placeholder={t("ui.components.addEditTenant.admins")}
                        onChange={(e) => setAdminInputValue(e.target.value)}
                        onKeyDown={(e) =>
                          adminInputKeyDown(e, field.value, field.onChange)
                        }
                      />
                    </TagPickerControl>
                  </TagPicker>
                )}
              />
              {errors.admins?.message && (
                <MessageBar intent="error">{errors.admins.message}</MessageBar>
              )}
              {Array.isArray(errors.admins) &&
                errors.admins.map((e, i) => (
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
              {t("ui.components.addEditTenant.cancel")}
            </Button>
            <Button
              appearance="primary"
              onClick={() => formButton.current?.click()}
            >
              {t("ui.components.addEditTenant.save")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
