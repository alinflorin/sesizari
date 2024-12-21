import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
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

export const Register = () => {
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
      .email(t("ui.routes.register.invalidEmail"))
      .required(t("ui.routes.register.emailIsRequired")),
    password: yup
      .string()
      .min(6, t("ui.routes.register.passwordTooShort"))
      .required(t("ui.routes.register.passwordIsRequired")),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password"), undefined],
        t("ui.routes.register.passwordsMustMatch")
      )
      .required(t("ui.routes.register.confirmPasswordIsRequired")),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { signup } = useAuth();

  const onSubmit = useCallback(
    async ({
      email,
      password,
    }: {
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      try {
        await signup(email, password);
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
    [signup, navigate, returnTo, setError]
  );

  return (
    <div className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Title1>{t("ui.routes.register.register")}</Title1>
        {errors.root?.firebase?.message && (
          <MessageBar intent="error">
            {t(errors.root.firebase.message)}
          </MessageBar>
        )}
        <Input
          type="email"
          placeholder={t("ui.routes.register.email")}
          required
          {...register("email")}
        />
        {errors.email && (
          <MessageBar intent="error">{errors.email.message}</MessageBar>
        )}

        <Input
          type="password"
          placeholder={t("ui.routes.register.password")}
          required
          minLength={6}
          {...register("password")}
        />
        {errors.password && (
          <MessageBar intent="error">{errors.password.message}</MessageBar>
        )}

        <Input
          type="password"
          placeholder={t("ui.routes.register.confirmPassword")}
          required
          minLength={6}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <MessageBar intent="error">
            {errors.confirmPassword.message}
          </MessageBar>
        )}

        <Button className={classes.button} type="submit" appearance="primary">
          {t("ui.routes.register.register")}
        </Button>
        <Link
          onClick={() =>
            navigate("/login?returnTo=" + encodeURIComponent(returnTo))
          }
          className={classes.link}
        >
          {t("ui.routes.register.login")}
        </Link>
      </form>
    </div>
  );
};

export default Register;
