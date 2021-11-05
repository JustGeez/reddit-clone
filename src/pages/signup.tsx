import { Alert, Button, Grid, Snackbar, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Auth } from "aws-amplify";
import { useUser } from "../context/AuthContext";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
}

const Signup = () => {
  /** STATE */
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState<string>("");
  const [showCode, setShowCode] = useState<boolean>(false);

  /** HOOKS */
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const { user } = useUser();

  const router = useRouter();

  /** COMPONENT FUNCTIONS */
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        await signUpAuthHandler(data);

        //   User has been signed-up successfully
        setShowCode(true);
      }
    } catch (error) {
      setSnackbarErrorMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  async function signUpAuthHandler(data: IFormInput): Promise<CognitoUser> {
    const { username, password, email } = data;

    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Signed up a user: ", user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { username, password, code } = data;

    try {
      await Auth.confirmSignUp(username, code);

      //   Once code has been confirmed, we sign user in
      const amplifyUser = await Auth.signIn(username, password);
      console.log("Successfully signed in user", amplifyUser);

      if (amplifyUser) {
        router.push("/");
      } else {
        console.log("Something went wrong with sign-up");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  console.log("The value of the user from the hook is,", user);

  /** TSX */
  return (
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
              minLength: { value: 3, message: "Please enter a username length 3-16 characters" },
              maxLength: { value: 16, message: "Please enter a username length 3-16 characters" },
            })}
          />
        </Grid>

        <Grid item>
          <TextField
            variant="outlined"
            type="email"
            id="email"
            label="Email"
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : null}
            {...register("email", {
              required: { value: true, message: "Please enter an email." },
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

        {showCode && (
          <Grid item>
            <TextField
              variant="filled"
              type="text"
              id="code"
              label="Verification Code"
              error={errors.code ? true : false}
              helperText={errors.code ? errors.code.message : null}
              {...register("code", {
                required: { value: true, message: "Please enter a code." },
                minLength: { value: 6, message: "Code must be length of 6" },
                maxLength: { value: 6, message: "Code must be length of 6" },
              })}
            />
          </Grid>
        )}

        <Grid item>
          <Button variant="contained" type="submit">
            {showCode ? "Confirm Code" : "Sign Up"}
          </Button>
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={3000}>
        <Alert severity="warning">{snackbarErrorMessage}</Alert>
      </Snackbar>
    </form>
  );
};

export default Signup;
