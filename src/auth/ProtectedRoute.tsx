import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
    children: React.ReactNode;
    isAdmin: boolean;
}

const ProtectedRoute = ({ children, isAdmin } : Props) => {
	const { user, loading } = useAuth();

	if (loading) return <div>Loading...</div>;

	if (!user) return <Navigate to="/login" />;

	if (isAdmin && !user.isAdmin) {
		return <Navigate to="/unauthorized" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
