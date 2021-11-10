import { Alert, Button, Grid, Snackbar, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Auth } from "aws-amplify";
import { useUser } from "../context/AuthContext";
import { useRouter } from "next/router";
import LoginLayout from "../components/LoginLayout";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

const Signin = () => {
  /** STATE */
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState<string>("");

  /** HOOKS */
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const { user, setUser } = useUser();

  const router = useRouter();

  /** COMPONENT FUNCTIONS */
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const amplifyUser = await Auth.signIn(data.username, data.password);

    if (amplifyUser) {
      setUser(amplifyUser);
      router.push("/");
    } else {
      setSnackbarErrorMessage("Something went wrong with sign-in");
      setSnackbarOpen(true);
      console.log("Something went wrong with sign-in");
    }
  };

  console.log("The value of the user from the hook is,", user);

  /** TSX */
  return (
    <LoginLayout title="Sign in">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container spacing={1} direction="column" alignItems="center" justifyContent="center">
          <Grid item>
            <TextField
              variant="outlined"
              type="text"
              id="username"
              label="Username"
              error={errors.username ? true : false}
              helperText={errors.username ? errors.username.message : null}
              {...register("username", {
                required: { value: true, message: "Please enter a username." },
                minLength: {
                  value: 3,
                  message: "Please enter a username length 3-16 characters",
                },
                maxLength: {
                  value: 16,
                  message: "Please enter a username length 3-16 characters",
                },
              })}
            />
          </Grid>

          <Grid item>
            <TextField
              variant="outlined"
              type="password"
              id="password"
              label="Password"
              error={errors.password ? true : false}
              helperText={errors.password ? errors.password.message : null}
              {...register("password", {
                required: { value: true, message: "Please enter a password." },
                minLength: { value: 8, message: "Password must be minimum length of 8" },
                maxLength: { value: 12, message: "Password max length is 12" },
              })}
            />
          </Grid>

          <Grid item>
            <Button variant="contained" type="submit">
              Sign in
            </Button>
          </Grid>
        </Grid>

        <Snackbar open={snackbarOpen} autoHideDuration={3000}>
          <Alert severity="warning">{snackbarErrorMessage}</Alert>
        </Snackbar>
      </form>
    </LoginLayout>
  );
};

export default Signin;
