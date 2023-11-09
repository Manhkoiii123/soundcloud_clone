"use client";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { signIn } from "next-auth/react";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import React, { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import ArrowbackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
const AuthSignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");

  const [openMessage, setOpenMessage] = useState<boolean>(false);
  const [resMessage, setResMessage] = useState<string>("");

  const handleSubmit = async () => {
    setIsErrorUsername(false);
    setIsErrorPassword(false);
    setErrorUsername("");
    setErrorPassword("");

    if (!username) {
      setIsErrorUsername(true);
      setErrorUsername("Username is not empty.");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPassword("Password is not empty.");
      return;
    }
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    //ko lỗi
    if (!res?.error) {
      router.push("/");
    } else {
      setOpenMessage(true);
      setResMessage(res.error);
    }
  };

  return (
    <Box>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={4}
          sx={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <div style={{ margin: "20px" }}>
            <Link href="/">
              <ArrowbackIcon />
            </Link>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Avatar>
                <LockIcon />
              </Avatar>

              <Typography component="h1">Sign in</Typography>
            </Box>
            <TextField
              sx={{
                marginBottom: "20px",
              }}
              onChange={(event) => setUsername(event.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoFocus
              error={isErrorUsername}
              helperText={errorUsername}
            />
            <TextField
              onChange={(event) => setPassword(event.target.value)}
              id="outlined-password-input"
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              error={isErrorPassword}
              helperText={errorPassword}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword === false ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              sx={{
                my: 3,
              }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Divider>Or using</Divider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                mt: 3,
              }}
            >
              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "orange",
                }}
                onClick={() => {
                  signIn("github");
                }}
              >
                <GitHubIcon titleAccess="Login with Github" />
              </Avatar>

              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "orange",
                }}
                onClick={() => {
                  signIn("google");
                }}
              >
                <GoogleIcon titleAccess="Login with Google" />
              </Avatar>
            </Box>
            <Divider sx={{ mt: 3 }}></Divider>
            <Typography
              sx={{ display: "flex", justifyContent: "center", mt: 3 }}
            >
              <span style={{ marginRight: 5 }}>Are you don't have an account</span>{" "}
              <Link href={"/auth/signup"} style={{ color: "unset" }}>
                signup
              </Link>
            </Typography>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openMessage}
      >
        <Alert
          onClose={() => setOpenMessage(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {resMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthSignIn;
