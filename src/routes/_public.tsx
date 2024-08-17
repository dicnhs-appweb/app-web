import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: () => (
    <div className="h-screen">
      <Outlet />
    </div>
  ),
});
