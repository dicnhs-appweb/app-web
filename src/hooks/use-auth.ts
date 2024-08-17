import { UserContext } from "@/context/auth-context";
import { useContext } from "react";

export const useAuthentication = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuthentication must be used within a UserProvider");
  }
  return {
    fetchUser: context.fetchUser,
    emailPasswordLogin: context.emailPasswordLogin,
    emailPasswordSignup: context.emailPasswordSignup,
    logOutUser: context.logOutUser,
  };
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
};
