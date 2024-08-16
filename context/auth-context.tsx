import { APP_ID } from "@/constants/realm";
import { createContext, ReactNode, useEffect, useState } from "react";
import { App, Credentials, User } from "realm-web";

const app = new App(APP_ID);

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<User | false>;
  emailPasswordLogin: (email: string, password: string) => Promise<User>;
  emailPasswordSignup: (email: string, password: string) => Promise<User>;
  logOutUser: () => Promise<boolean>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initUser = async () => {
      if (app.currentUser) {
        await app.currentUser.refreshCustomData();
        setUser(app.currentUser);
      }
    };
    initUser();
  }, []);

  const emailPasswordLogin = async (email: string, password: string) => {
    const credentials = Credentials.emailPassword(email, password);
    const authenticatedUser = await app.logIn(credentials);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const emailPasswordSignup = async (email: string, password: string) => {
    await app.emailPasswordAuth.registerUser({ email, password });
    return emailPasswordLogin(email, password);
  };

  const fetchUser = async () => {
    if (!app.currentUser) return false;
    await app.currentUser.refreshCustomData();
    setUser(app.currentUser);
    return app.currentUser;
  };

  const logOutUser = async () => {
    if (!app.currentUser) return false;
    await app.currentUser.logOut();
    setUser(null);
    location.reload();
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        emailPasswordLogin,
        emailPasswordSignup,
        logOutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
