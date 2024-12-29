import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Field,
  Input,
  Link,
  makeStyles,
  MessageBar,
  Title1,
  tokens,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { useCallback, useMemo } from "react";
import useAuth from "../hooks/useAuth";
import { FirebaseError } from "@firebase/app";
import { extractErrorMessages } from "../helpers/form-helpers";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    gap: tokens.spacingVerticalS,
  },
  button: {
    marginTop: tokens.spacingVerticalS,
  },
  link: {
    textAlign: "center",
  },
});

export const Login = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();

  const returnTo = useMemo(() => {
    if (!queryParams || !queryParams.has("returnTo")) {
      return "/";
    }
    return queryParams.get("returnTo") as string;
  }, [queryParams]);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t("ui.routes.login.invalidEmail"))
      .required(t("ui.routes.login.emailIsRequired")),
    password: yup
      .string()
      .min(6, t("ui.routes.login.passwordTooShort"))
      .required(t("ui.routes.login.passwordIsRequired")),
  });

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { loginWithEmailAndPassword, loginWithGoogle } = useAuth();

  const onSubmit = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      try {
        await loginWithEmailAndPassword(email, password);
        navigate(returnTo);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof FirebaseError) {
          setError("root.firebase", {
            message: "ui.firebase.errors." + err.code,
            type: "validate",
          });
        }
      }
    },
    [loginWithEmailAndPassword, navigate, returnTo, setError]
  );

  const loginWithGoogleClicked = useCallback(async () => {
    try {
      await loginWithGoogle();
      navigate(returnTo);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof FirebaseError) {
        setError("root.firebase", {
          message: "ui.firebase.errors." + err.code,
          type: "validate",
        });
      }
    }
  }, [loginWithGoogle, setError, navigate, returnTo]);

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Title1>{t("ui.routes.login.login")}</Title1>
        {errors.root?.firebase?.message && (
          <MessageBar intent="error">
            {t(errors.root.firebase.message)}
          </MessageBar>
        )}

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              label={t("ui.routes.login.email")}
              validationState={fieldState.invalid ? "error" : "success"}
              validationMessage={extractErrorMessages(fieldState.error)}
            >
              <Input
                type="email"
                required
                disabled={field.disabled}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                value={field.value}
              />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              label={t("ui.routes.login.password")}
              validationState={fieldState.invalid ? "error" : "success"}
              validationMessage={extractErrorMessages(fieldState.error)}
            >
              <Input
                type="password"
                required
                minLength={6}
                disabled={field.disabled}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                value={field.value}
              />
            </Field>
          )}
        />
        <Button className={classes.button} type="submit" appearance="primary">
          {t("ui.routes.login.login")}
        </Button>
        <Button
          onClick={loginWithGoogleClicked}
          className={classes.button}
          appearance="secondary"
        >
          {t("ui.routes.login.loginWithGoogle")}
        </Button>
        <Link
          className={classes.link}
          onClick={() =>
            navigate("/register?returnTo=" + encodeURIComponent(returnTo))
          }
        >
          {t("ui.routes.login.register")}
        </Link>
        <Link
          className={classes.link}
          onClick={() =>
            navigate(
              "/forgot-password?returnTo=" + encodeURIComponent(returnTo)
            )
          }
        >
          {t("ui.routes.login.forgotPassword")}
        </Link>
      </form>
    </div>
  );
};

export default Login;
