"use client";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import ArrowbackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
const gender = ["MALE", "FEMALE"];
const AuthSignIn = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [genderUser, setGenderUser] = useState<string>("MALE");
  const [address, setAddress] = useState<string>("");
  const role = "USER";

  const data = { username, email, password, age, genderUser, address, role };

  const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isAgeError, setIsAgeError] = useState<boolean>(false);
  const [isGenderError, setIsGenderError] = useState<boolean>(false);
  const [isAddressError, setIsAddressError] = useState<boolean>(false);

  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorAge, setErrorAge] = useState<string>("");
  const [errorAddress, setErrorAddress] = useState<string>("");

  const [openMessage, setOpenMessage] = useState<boolean>(false);
  const [resMessage, setResMessage] = useState<string>("");

  const handleSubmit = async () => {
    setIsErrorUsername(false);
    setIsErrorPassword(false);
    setIsEmailError(false);
    setIsAgeError(false);
    setIsGenderError(false);
    setIsAddressError(false);
    setErrorUsername("");
    setErrorPassword("");
    setErrorEmail("");
    setErrorAge("");
    setGenderUser("MALE");
    setErrorAddress("");

    if (!username) {
      setIsErrorUsername(true);
      setErrorUsername("Username is not empty.");
      return;
    }
    if (!email) {
      setIsEmailError(true);
      setErrorEmail("Email is not empty.");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPassword("Password is not empty.");
      return;
    }
    if (!age) {
      setIsAgeError(true);
      setErrorAge("Age is not empty.");
      return;
    }
    if (!address) {
      setIsAddressError(true);
      setErrorAddress("Address is not empty.");
      return;
    }
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
      method: "POST",
      body: { data },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
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

              <Typography component="h1">Sign Up</Typography>
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
              sx={{
                marginBottom: "20px",
              }}
              onChange={(event) => setEmail(event.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              error={isEmailError}
              helperText={errorEmail}
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
            <TextField
              sx={{
                marginBottom: "20px",
              }}
              onChange={(event) => setAge(event.target.value)}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Age"
              name="age"
              placeholder="Age"
              error={isAgeError}
              helperText={errorAge}
            />
            <TextField
              sx={{
                mt: 3,
              }}
              select
              onChange={(e) => setGenderUser(e.target.value)}
              label="Gender"
              defaultValue="MALE"
              fullWidth
              margin="normal"
              variant="standard"
            >
              {gender.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              sx={{
                marginBottom: "20px",
              }}
              onChange={(event) => setAddress(event.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Address"
              name="address"
              error={isAddressError}
              helperText={errorAddress}
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
              Sign Up
            </Button>
          </div>
          <Divider sx={{ mt: 3 }}></Divider>
          <Typography sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <span style={{ marginRight: 5 }}>Are you have an account</span>{" "}
            <Link href={"/auth/signin"} style={{ color: "unset" }}>
              signin
            </Link>
          </Typography>
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
