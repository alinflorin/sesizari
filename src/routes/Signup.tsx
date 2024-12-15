import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { FormEvent, useCallback, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();

  const returnTo = useMemo(() => {
    if (!queryParams) {
      return "/";
    }
    return queryParams.get("returnTo") || "/";
  }, [queryParams]);

  const signupClicked = useCallback(
    async (e: FormEvent) => {
      setError(undefined);
      e.preventDefault();
      e.stopPropagation();
      try {
        await signup(email, password);
        navigate(returnTo);
      } catch (e: unknown) {
        console.error(e);
        setError("An error has occurred");
      }
    },
    [signup, email, password, navigate, setError, returnTo]
  );

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
        Sign Up
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box
        component="form"
        onSubmit={signupClicked}
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
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isFormValid}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}
