import { Children, createContext, useContext, useEffect, useState } from "react";
import React, { ReactElement } from "react";
import Auth, { CognitoUser } from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";

interface UserContextType {
  user: CognitoUser | null;
  setUser: React.Dispatch<React.SetStateAction<CognitoUser | null>>;
}
const UserContext = createContext<UserContextType>({} as UserContextType);

interface Props {
  children: React.ReactElement;
}

export default function AuthContext({ children }: Props): ReactElement {
  const [user, setUser] = useState<CognitoUser | null>(null);

  useEffect(() => {
    //   Check user when first mounted
    checkUser();
  }, []);

  useEffect(() => {
    Hub.listen("auth", () => {
      //   Perform some action to update state whenever an auth event is detected
      checkUser();
    });
  }, []);

  async function checkUser() {
    try {
      const amplifyUser = await Auth.currentAuthenticatedUser();

      if (amplifyUser) {
        setUser(amplifyUser);
      }
    } catch (error) {
      //   No current user signed-in
      setUser(null);
    }
  }

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export const useUser = (): UserContextType => useContext(UserContext);
