import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { useUser } from "../context/AuthContext";

const Home: NextPage = () => {
  const { user, setUser } = useUser();

  console.log(user);

  return <Typography variant="h1">Hello world!</Typography>;
};

export default Home;
