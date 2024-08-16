import { Button } from "@/components/ui/button";
import { useAuthentication } from "@/hooks/use-auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { logOutUser } = useAuthentication();
  return (
    <div>
      <Button onClick={logOutUser}>Logout</Button>
    </div>
  );
}

export default Dashboard;
