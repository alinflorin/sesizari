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
  Field,
  InfoLabel,
  Input,
  Link,
  makeStyles,
  MessageBar,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  Textarea,
  tokens,
} from "@fluentui/react-components";
import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { GeoPoint } from "firebase/firestore";
import { FirebaseError } from "@firebase/app";
import useTenants from "../hooks/useTenants";
import { GeoJSON } from "leaflet";
import { extractErrorMessages } from "../helpers/form-helpers";

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
  const { updateTenant, addTenant, existsById } = useTenants();

  const schema = yup.object().shape({
    name: yup
      .string()
      .required(t("ui.components.addEditTenant.nameIsRequired")),
    id: props.tenant.id
      ? yup.string().required(t("ui.components.addEditTenant.idIsRequired"))
      : yup
          .string()
          .required(t("ui.components.addEditTenant.idIsRequired"))
          .test(
            "valid-id",
            t("ui.components.addEditTenant.idIsInvalid"),
            (value) => {
              if (!value) return true;
              const regex = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;
              return regex.test(value);
            }
          )
          .test(
            "is-unique-id",
            t("ui.components.addEditTenant.idAlreadyExists"),
            async (value) => {
              if (!value) return true;
              try {
                return !(await existsById(value));
              } catch (error) {
                console.error("Error checking ID in Firebase:", error);
                return false;
              }
            }
          ),
    area: yup
      .string()
      .test(
        "is-valid-area",
        t("ui.components.addEditTenant.invalidAreaFormat"),
        (value) => {
          if (!value) return true;
          try {
            const object = JSON.parse(value);
            const geoJsonObject = new GeoJSON(object);
            return !!geoJsonObject;
          } catch {
            return false;
          }
        }
      ),
    mapCenter: yup
      .string()
      .required(t("ui.components.addEditTenant.mapCenterIsRequired"))
      .test(
        "is-lat-long",
        t("ui.components.addEditTenant.mapCenterIsInvalid"),
        (value) => {
          if (!value) return true;
          return /^(-?([1-8]?[0-9]|90))(\.[0-9]+)?,-?((1[0-7][0-9])|([1-9]?[0-9]))(\.[0-9]+)?$/.test(
            value
          );
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
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categories: props.tenant.categories,
      admins: props.tenant.admins,
      area: props.tenant.area ? props.tenant.area : "",
      id: props.tenant.id || "",
      name: props.tenant.name,
      mapCenter:
        props.tenant.id && props.tenant.mapCenter
          ? props.tenant.mapCenter.latitude +
            "," +
            props.tenant.mapCenter.longitude
          : "",
    },
  });

  const onSubmit = useCallback(
    async (data: {
      categories: string[];
      admins: string[];
      name: string;
      id: string;
      area?: string;
      mapCenter: string;
    }) => {
      try {
        const tenantData = {
          area: data.area ? data.area : null,
          mapCenter: data.mapCenter
            ? new GeoPoint(
                +data.mapCenter.split(",")[0],
                +data.mapCenter.split(",")[1]
              )
            : null,
          admins: data.admins,
          categories: data.categories,
          name: data.name,
        } as Tenant;
        let id: string | undefined;

        if (props.tenant.id) {
          // EDIT
          id = props.tenant.id;
          await updateTenant(props.tenant.id, tenantData, true);
        } else {
          // ADD
          id = data.id;
          await addTenant(data.id, tenantData);
        }
        props.onClose({ ...tenantData, id: id });
      } catch (err) {
        console.error(err);
        if (err instanceof FirebaseError) {
          setError("root.firebase", {
            message: "ui.firebase.errors." + err.code,
          });
        }
      }
    },
    [props, setError, updateTenant, addTenant]
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
              {!props.tenant.id && (
                <>
                  <Controller
                    name="id"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        label={t("ui.components.addEditTenant.id")}
                        validationState={
                          fieldState.invalid ? "error" : "success"
                        }
                        validationMessage={extractErrorMessages(
                          fieldState.error
                        )}
                      >
                        <Input
                          type="text"
                          required
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
                </>
              )}

              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.addEditTenant.name")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
                    <Input
                      type="text"
                      required
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
                name="categories"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.addEditTenant.categories")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
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
                            <Tag
                              as="span"
                              key={index}
                              shape="rounded"
                              value={option}
                            >
                              {option}
                            </Tag>
                          ))}
                        </TagPickerGroup>
                        <TagPickerInput
                          disabled={field.disabled}
                          value={categoryInputValue}
                          onBlur={field.onBlur}
                          name={field.name}
                          onChange={(e) =>
                            setCategoryInputValue(e.target.value)
                          }
                          onKeyDown={(e) =>
                            categoryInputKeyDown(e, field.value, field.onChange)
                          }
                        />
                      </TagPickerControl>
                    </TagPicker>
                  </Field>
                )}
              />

              <Controller
                name="admins"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.addEditTenant.admins")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
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
                            <Tag
                              as="span"
                              key={index}
                              shape="rounded"
                              value={option}
                            >
                              {option}
                            </Tag>
                          ))}
                        </TagPickerGroup>
                        <TagPickerInput
                          disabled={field.disabled}
                          value={adminInputValue}
                          onBlur={field.onBlur}
                          type="email"
                          onChange={(e) => setAdminInputValue(e.target.value)}
                          onKeyDown={(e) =>
                            adminInputKeyDown(e, field.value, field.onChange)
                          }
                        />
                      </TagPickerControl>
                    </TagPicker>
                  </Field>
                )}
              />

              <Controller
                name="mapCenter"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.addEditTenant.mapCenter")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
                    <Input
                      type="text"
                      placeholder={t("ui.components.addEditTenant.mapCenter")}
                      required
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
                name="area"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    label={t("ui.components.addEditTenant.area")}
                    validationState={fieldState.invalid ? "error" : "success"}
                    validationMessage={extractErrorMessages(fieldState.error)}
                  >
                    <Textarea
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
              <InfoLabel
                info={
                  <>
                    {t("ui.components.addEditTenant.areaInfo")}{" "}
                    <Link target="_blank" href="https://geojson.io">
                      GeoJSON.io
                    </Link>
                  </>
                }
              >
                {t("ui.components.addEditTenant.info")}
              </InfoLabel>

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
