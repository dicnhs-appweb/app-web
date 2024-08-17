import { RouterProvider } from "@tanstack/react-router";
import { useAuthentication, useUser } from "./hooks/use-auth";
import { router } from "./main";

export function InnerApp() {
  const user = useUser();
  const authActions = useAuthentication();

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isAuthenticated: !!user,
          authActions: {
            fetchUser: authActions.fetchUser,
            emailPasswordLogin: authActions.emailPasswordLogin,
            emailPasswordSignup: authActions.emailPasswordSignup,
            logOutUser: authActions.logOutUser,
          },
          user: user,
        },
      }}
    />
  );
}
