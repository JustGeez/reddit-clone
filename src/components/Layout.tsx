import { Container } from "@mui/material";
import React, { ReactElement } from "react";
import Header from "./Header";

interface Props {
  children: ReactElement;
}

const Layout = ({ children }: Props) => {
  return (
    <Container maxWidth="xl">
      <Header />
      <br />
      {children}
    </Container>
  );
};

export default Layout;
