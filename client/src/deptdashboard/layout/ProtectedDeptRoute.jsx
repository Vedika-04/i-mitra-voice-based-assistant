import { Navigate } from "react-router-dom";
import { useDeptContext } from "../DeptContext.jsx";

const ProtectedDeptRoute = ({ children }) => {
  const { isAuthenticated, loading } = useDeptContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/department/login" replace />;
  }

  return children;
};

export default ProtectedDeptRoute;
