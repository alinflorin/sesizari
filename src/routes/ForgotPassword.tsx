import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Caption1Strong,
  Input,
  Link,
  makeStyles,
  MessageBar,
  Title1,
  tokens,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { useCallback, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import { FirebaseError } from "@firebase/app";

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

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [queryParams] = useSearchParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const returnTo = useMemo(() => {
    if (!queryParams || !queryParams.has("returnTo")) {
      return "/";
    }
    return queryParams.get("returnTo") as string;
  }, [queryParams]);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t("ui.routes.forgotPassword.invalidEmail"))
      .required(t("ui.routes.forgotPassword.emailIsRequired")),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { forgotPassword } = useAuth();

  const onSubmit = useCallback(
    async ({ email }: { email: string }) => {
      try {
        await forgotPassword(email);
        setSuccess(true);
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
    [forgotPassword, setError]
  );

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Title1>{t("ui.routes.forgotPassword.forgotPassword")}</Title1>
        {success && (
          <MessageBar intent="success">
            <Caption1Strong>
              {t("ui.routes.forgotPassword.resetEmailSent")}
            </Caption1Strong>
            <Button
              className={classes.button}
              type="submit"
              onClick={() => navigate("/login?returnTo=" + encodeURIComponent(returnTo))}
              appearance="secondary"
            >
              {t("ui.routes.forgotPassword.back")}
            </Button>
          </MessageBar>
        )}
        {errors.root?.firebase?.message && (
          <MessageBar intent="error">
            {t(errors.root.firebase.message)}
          </MessageBar>
        )}
        <Input
          type="email"
          placeholder={t("ui.routes.forgotPassword.email")}
          required
          {...register("email")}
        />
        {errors.email && (
          <MessageBar intent="error">{errors.email.message}</MessageBar>
        )}
        <Button className={classes.button} type="submit" appearance="primary">
          {t("ui.routes.forgotPassword.sendResetEmail")}
        </Button>
        <Link
          className={classes.link}
          onClick={() =>
            navigate("/login?returnTo=" + encodeURIComponent(returnTo))
          }
        >
          {t("ui.routes.forgotPassword.login")}
        </Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
