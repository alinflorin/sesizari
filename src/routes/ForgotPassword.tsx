import { FormEvent, useCallback, useMemo, useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import useAuth from "../hooks/useAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { forgotPassword } = useAuth();

  const handleForgotPassword = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await forgotPassword(email);
      setSuccessMessage("Password reset link sent to your email.");
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to send password reset link. Please try again.");
    }
  }, [forgotPassword, email]);

  const isFormValid = useMemo(() => {
    if (!email) {
      return false;
    }
    if (email.length < 3) {
      return false;
    }
    const emailRegex =
      /^[^\s;]+@[^\s;]+\.[^\s;]+(?:;[^\s;]+@[^\s;]+\.[^\s;]+)*$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    return true;
  }, [email]);

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
        Forgot Password
      </Typography>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Box
        component="form"
        onSubmit={handleForgotPassword}
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
        <Button
          disabled={!isFormValid}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Send Reset Link
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
