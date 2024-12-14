import { Button } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useCallback } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();

  const loginWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
    navigate("/");
  }, [navigate]);
  
  return <>
    <Button onClick={loginWithGoogle}>Login with Google</Button>
  </>
}