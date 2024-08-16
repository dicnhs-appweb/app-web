import { LoginForm } from "@/features/public/login/component/login-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/login")({
  beforeLoad: async ({
    context: {
      auth: {
        authActions: { fetchUser },
      },
    },
  }) => {
    const user = await fetchUser();
    if (user) {
      throw redirect({
        to: "/dashboard",
        replace: true,
      });
    }
  },
  component: () => (
    <div className="flex flex-col items-center justify-center h-full">
      <LoginForm />
    </div>
  ),
});
