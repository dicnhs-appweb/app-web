import { Button } from "@/components/ui/button";
import { ProductCalculationForm } from "@/features/auth/product-calculation/components/product-calculation-form";
import { useAuthentication } from "@/hooks/use-auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { logOutUser } = useAuthentication();
  return (
    <div>
      <ProductCalculationForm />
      <Button onClick={logOutUser}>Logout</Button>
    </div>
  );
}

export default Dashboard;
