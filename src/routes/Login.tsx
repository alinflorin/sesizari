import { Button } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useCallback, useMemo } from "react";
import { auth } from "../firebase";
import { useNavigate, useSearchParams } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();

  const returnTo = useMemo(() => {
    if (!queryParams) {
      return "/";
    }
    return queryParams.get("returnTo") || "/";
  }, [queryParams]);

  const loginWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
    navigate(returnTo);
  }, [navigate, returnTo]);
  
  return <>
    <Button onClick={loginWithGoogle}>Login with Google</Button>
  </>
}