import { UserContextType } from "@/context/auth-context";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface UserRouteContext {
  auth: {
    isAuthenticated: boolean;
    authActions: Omit<UserContextType, "user" | "setUser">;
    user: Realm.User | null;
  };
}

export const Route = createRootRouteWithContext<UserRouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
