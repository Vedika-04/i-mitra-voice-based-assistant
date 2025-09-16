// client/src/deptdashboard/AppDept.jsx
import { Routes, Route } from "react-router-dom"; // ✅ Remove BrowserRouter
import { DeptProvider } from "./DeptContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout components
import AppDeptShell from "./layout/AppDeptShell";
import ProtectedDeptRoute from "./layout/ProtectedDeptRoute";

// Pages
import DeptLogin from "./pages/DeptLogin";
import DashboardHome from "./pages/DashboardHome";
import ComplaintsList from "./pages/ComplaintsList";
import EscalatedComplaints from "./pages/EscalatedComplaints";
import ComplaintDetail from "./pages/ComplaintDetail";
import MitraList from "./pages/MitraList";
import MitraRegister from "./pages/MitraRegister";

//3111
import Complaint311List from "./pages/Complaint311List";
import Complaint311Detail from "./pages/Complaint311Detail";

const AppDept = () => {
  return (
    <DeptProvider>
      {/* ✅ No BrowserRouter here - only Routes */}
      <Routes>
        {/* Public department route */}
        <Route path="login" element={<DeptLogin />} />

        {/* Protected department routes */}
        <Route
          path=""
          element={
            <ProtectedDeptRoute>
              <AppDeptShell>
                <DashboardHome />
              </AppDeptShell>
            </ProtectedDeptRoute>
          }
        />

        <Route
          path="complaints"
          element={
            <ProtectedDeptRoute>
              <AppDeptShell>
                <ComplaintsList />
              </AppDeptShell>
            </ProtectedDeptRoute>
          }
        />

        <Route
          path="complaints/escalated"
          element={
            <ProtectedDeptRoute>
              <AppDeptShell>
                <EscalatedComplaints />
              </AppDeptShell>
            </ProtectedDeptRoute>
          }
        />

        {/* 🆕 Add this new route */}
        <Route
          path="complaint311"
          element={
            <ProtectedDeptRoute>
              <AppDeptShell>
                <Complaint311List />
              </AppDeptShell>
            </ProtectedDeptRoute>
          }
        />

        <Route
          path="complaint311/:id"
          element={
            <ProtectedDeptRoute>
              <AppDeptShell>
                <Complaint311Detail />
              </AppDeptShell>
            </ProtectedDeptRoute>
          }
        />

        <Route
          path="complaints/:id"
          element={
            <ProtectedDeptRoute>
              <AppDeptShell>
                <ComplaintDetail />
              </AppDeptShell>
            </ProtectedDeptRoute>
          }
        />

        <Route
          path="mitras"
          element={
            <ProtectedDeptRoute>
              <AppDeptShell>
                <MitraList />
              </AppDeptShell>
            </ProtectedDeptRoute>
          }
        />

        <Route
          path="mitras/register"
          element={
            <ProtectedDeptRoute>
              <AppDeptShell>
                <MitraRegister />
              </AppDeptShell>
            </ProtectedDeptRoute>
          }
        />
      </Routes>

      <ToastContainer theme="colored" position="top-right" />
    </DeptProvider>
  );
};

export default AppDept;
