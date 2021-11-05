import { Container } from "@mui/material";
import React, { ReactChildren, ReactElement } from "react";
import Header from "./Header";

interface Props {
  children: ReactElement;
}

const Layout = ({ children }: Props) => {
  return (
    <Container maxWidth="xl">
      <Header />
      {children}
    </Container>
  );
};

export default Layout;
