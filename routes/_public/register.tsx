import { RegisterForm } from "@/features/public/register/component/register-form";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/register")({
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
      <RegisterForm />
    </div>
  ),
});
