import { UsersTable } from "../components/admin/UsersTable";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export function AdminUsersPage() {
  const { user } = useAuth();

  // Verifica se o usuário é admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto py-8">
      <UsersTable />
    </div>
  );
};