import { Container, Paper, Typography } from "@mui/material";
import React, { ReactElement } from "react";

interface Props {
  children: ReactElement;
  title: string;
}

const LoginLayout = ({ children, title }: Props) => {
  return (
    <Container sx={{ display: "grid", placeContent: "center", height: "100vh" }}>
      <Paper sx={{ padding: 5 }}>
        <Typography variant="h2" textAlign="center">
          {title}
        </Typography>
        {children}
      </Paper>
    </Container>
  );
};

export default LoginLayout;
