import { FormEvent, useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { TextField, Button, Box, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const { loginWithGoogle, loginWithEmailAndPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = useMemo(() => {
    if (!email || !password) {
      return false;
    }
    if (email.length < 3 || password.length < 6) {
      return false;
    }
    const emailRegex =
      /^[^\s;]+@[^\s;]+\.[^\s;]+(?:;[^\s;]+@[^\s;]+\.[^\s;]+)*$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    return true;
  }, [email, password]);

  const returnTo = useMemo(() => {
    if (!queryParams) {
      return "/";
    }
    return queryParams.get("returnTo") || "/";
  }, [queryParams]);

  const loginWithGoogleClick = useCallback(async () => {
    await loginWithGoogle();
    navigate(returnTo);
  }, [navigate, returnTo, loginWithGoogle]);

  const loginWithUsernameAndPassword = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await loginWithEmailAndPassword(email, password);
        navigate(returnTo);
      } catch (err: unknown) {
        console.error(err);
      }
    },
    [navigate, loginWithEmailAndPassword, email, password, returnTo]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={loginWithUsernameAndPassword}
        sx={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          disabled={!isFormValid}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Login
        </Button>
        <Button
          onClick={loginWithGoogleClick}
          variant="outlined"
          color="primary"
          fullWidth
        >
          Login with Google
        </Button>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Link
            to={"/forgot-password?returnTo=" + encodeURIComponent(returnTo)}
          >
            Forgot Password?
          </Link>
          <Link
            to={"/signup?returnTo=" + encodeURIComponent(returnTo)}
          >
            Sign Up
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
