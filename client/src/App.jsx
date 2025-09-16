// import { useContext, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Auth from "./pages/Auth.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import ForgotPassword from "./pages/ForgotPassword.jsx";
// import ResetPassword from "./pages/ResetPassword.jsx";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { Context } from "./main.jsx";
// import OtpVerification from "./pages/OtpVerification.jsx";
// import HPage from "../LandingPage/src/HApp.jsx";
// import ComplaintForm from "./components/complaintForm.jsx";
// import AppDept from "./deptdashboard/AppDept.jsx";

// // New Citizen Dashboard imports
// import FileComplaintStandalone from "./NewDashboard/pages/FileComplaintStandalone.jsx";
// import FileComplaintPage from "./NewDashboard/pages/FileComplaintPage.jsx";
// import CreateComplaintModal from "../src/components/complaintForm.jsx";
// import AppCitizenShell from "./NewDashboard/layout/AppCitizenShell.jsx";
// import ProtectedCitizenRoute from "./NewDashboard/layout/ProtectedCitizenRoute.jsx";
// import DashboardHome from "./NewDashboard/pages/DashboardHome.jsx";
// import MyComplaints from "./NewDashboard/pages/MyComplaints.jsx";
// import ComplaintDetail from "./NewDashboard/pages/ComplaintDetail.jsx";
// import DashboardF from "./pages/DashboardPage.jsx";

// // Mitra Dashboard imports
// import { MitraAuthProvider } from "./mitra-dashboard/hooks/useMitraAuth.jsx";
// import MitraLogin from "./mitra-dashboard/pages/MitraLogin.jsx";
// import MitraDashboard from "./mitra-dashboard/pages/MitraDashboard.jsx";
// import MitraComplaintDetail from "./mitra-dashboard/pages/MitraComplaintDetail.jsx";
// import AppMitraShell from "./mitra-dashboard/layout/AppMitraShell.jsx";
// import ProtectedMitraRoute from "./mitra-dashboard/layout/ProtectedMitraRoute.jsx";

// const App = () => {
//   const { setIsAuthenticated, setUser } = useContext(Context);

//   useEffect(() => {
//     const getUser = async () => {
//       await axios
//         .get("http://localhost:4000/api/v1/user/me", { withCredentials: true })
//         .then((res) => {
//           setUser(res.data.user);
//           setIsAuthenticated(true);
//         })
//         .catch(() => {
//           setUser(null);
//           setIsAuthenticated(false);
//         });
//     };
//     getUser();
//   }, [setIsAuthenticated, setUser]);

//   return (
//     <MitraAuthProvider>
//       <Router>
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<HPage />} />
//           <Route path="/auth" element={<Auth />} />
//           <Route path="/password/forgot" element={<ForgotPassword />} />
//           <Route path="/password/reset/:token" element={<ResetPassword />} />
//           <Route
//             path="/otp-verification/:email/:phone"
//             element={<OtpVerification />}
//           />

//           {/* Department Dashboard */}
//           <Route path="/department/*" element={<AppDept />} />

//           {/* Mitra Dashboard Routes */}
//           <Route path="/mitra/login" element={<MitraLogin />} />
//           <Route
//             path="/mitra/dashboard"
//             element={
//               <ProtectedMitraRoute>
//                 <AppMitraShell>
//                   <MitraDashboard />
//                 </AppMitraShell>
//               </ProtectedMitraRoute>
//             }
//           />
//           <Route
//             path="/mitra/complaints/:complaintId"
//             element={
//               <ProtectedMitraRoute>
//                 <AppMitraShell>
//                   <MitraComplaintDetail />
//                 </AppMitraShell>
//               </ProtectedMitraRoute>
//             }
//           />

//           {/* Citizen Complaint Routes */}
//           <Route
//             path="/filecomplaint"
//             element={
//               <ProtectedCitizenRoute>
//                 <CreateComplaintModal />
//               </ProtectedCitizenRoute>
//             }
//           />

//           {/* Citizen Dashboard Routes */}
//           <Route
//             path="/citizendashboard"
//             element={
//               <ProtectedCitizenRoute>
//                 <AppCitizenShell>
//                   <DashboardHome />
//                 </AppCitizenShell>
//               </ProtectedCitizenRoute>
//             }
//           />
//           <Route
//             path="/my-complaints"
//             element={
//               <ProtectedCitizenRoute>
//                 <AppCitizenShell>
//                   <MyComplaints />
//                 </AppCitizenShell>
//               </ProtectedCitizenRoute>
//             }
//           />
//           <Route
//             path="/complaint/:complaintId"
//             element={
//               <ProtectedCitizenRoute>
//                 <AppCitizenShell>
//                   <ComplaintDetail />
//                 </AppCitizenShell>
//               </ProtectedCitizenRoute>
//             }
//           />

//           {/* User Profile (protected) */}
//           <Route
//             path="/myprofile"
//             element={
//               <ProtectedRoute>
//                 <DashboardF />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//         <ToastContainer theme="colored" />
//       </Router>
//     </MitraAuthProvider>
//   );
// };

// export default App;

import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main.jsx";
import OtpVerification from "./pages/OtpVerification.jsx";
import HPage from "../LandingPage/src/HApp.jsx";
import ComplaintForm from "./components/complaintForm.jsx";
import AppDept from "./deptdashboard/AppDept.jsx";

// New Citizen Dashboard imports
import FileComplaintStandalone from "./NewDashboard/pages/FileComplaintStandalone.jsx";
import FileComplaintPage from "./NewDashboard/pages/FileComplaintPage.jsx";
import CreateComplaintModal from "../src/components/complaintForm.jsx";
import AppCitizenShell from "./NewDashboard/layout/AppCitizenShell.jsx";
import ProtectedCitizenRoute from "./NewDashboard/layout/ProtectedCitizenRoute.jsx";
import DashboardHome from "./NewDashboard/pages/DashboardHome.jsx";
import MyComplaints from "./NewDashboard/pages/MyComplaints.jsx";
import ComplaintDetail from "./NewDashboard/pages/ComplaintDetail.jsx";
import DashboardF from "./pages/DashboardPage.jsx";

// Mitra Dashboard imports
import { MitraAuthProvider } from "./mitra-dashboard/hooks/useMitraAuth.jsx";
import MitraLogin from "./mitra-dashboard/pages/MitraLogin.jsx";
import MitraDashboard from "./mitra-dashboard/pages/MitraDashboard.jsx";
import MitraComplaintDetail from "./mitra-dashboard/pages/MitraComplaintDetail.jsx";
import AppMitraShell from "./mitra-dashboard/layout/AppMitraShell.jsx";
import ProtectedMitraRoute from "./mitra-dashboard/layout/ProtectedMitraRoute.jsx";

// Super Admin Dashboard imports
import { SuperAdminProvider } from "./super-admin-dashboard/hooks/useSuperAdminAuth.jsx";
import SuperAdminLogin from "./super-admin-dashboard/pages/SuperAdminLogin.jsx";
import AdminDashboard from "./super-admin-dashboard/pages/AdminDashboard.jsx";
import Analytics from "./super-admin-dashboard/pages/Analytics.jsx";
import Reports from "./super-admin-dashboard/pages/Reports.jsx";
import ComplaintsList from "./super-admin-dashboard/pages/ComplaintsList.jsx";
import AdminComplaintDetail from "./super-admin-dashboard/pages/AdminComplaintDetail.jsx";
import { ProtectedSuperAdminRoute } from "./super-admin-dashboard/components/layout/index.js";
import HeatMapView from "./super-admin-dashboard/pages/HeatMapView.jsx";

//311 complaint form
import ComplaintForm311 from "./components/311Form.jsx";

//Dhawni
import DhwaniMitra from "./dhwani/components/DhwaniMitra.jsx";

import BirthCertificate from "./birthCertificate/components/birthCertificate.jsx";

const App = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const getUser = async () => {
      await axios
        .get("http://localhost:4000/api/v1/user/me", { withCredentials: true })
        .then((res) => {
          setUser(res.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setUser(null);
          setIsAuthenticated(false);
        });
    };
    getUser();
  }, [setIsAuthenticated, setUser]);

  return (
    <SuperAdminProvider>
      <MitraAuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/311Form/*" element={<ComplaintForm311 />} />
            <Route path="/" element={<HPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route
              path="/otp-verification/:email/:phone"
              element={<OtpVerification />}
            />
            {/* 🎤 DHWANI MITRA ROUTE - ADD THIS HERE */}
            <Route
              path="/dhwani-mitra"
              element={
                <ProtectedCitizenRoute>
                  <DhwaniMitra />
                </ProtectedCitizenRoute>
              }
            />
            {/* Department Dashboard */}
            <Route path="/department/*" element={<AppDept />} />

            {/* Mitra Dashboard Routes */}
            <Route path="/mitra/login" element={<MitraLogin />} />
            <Route
              path="/mitra/dashboard"
              element={
                <ProtectedMitraRoute>
                  <AppMitraShell>
                    <MitraDashboard />
                  </AppMitraShell>
                </ProtectedMitraRoute>
              }
            />
            <Route
              path="/mitra/complaints/:complaintId"
              element={
                <ProtectedMitraRoute>
                  <AppMitraShell>
                    <MitraComplaintDetail />
                  </AppMitraShell>
                </ProtectedMitraRoute>
              }
            />

            {/* Super Admin Dashboard Routes */}
            <Route path="/superadmin/login" element={<SuperAdminLogin />} />
            <Route
              path="/superadmin/dashboard"
              element={
                <ProtectedSuperAdminRoute>
                  <AdminDashboard />
                </ProtectedSuperAdminRoute>
              }
            />
            <Route
              path="/superadmin/analytics"
              element={
                <ProtectedSuperAdminRoute>
                  <Analytics />
                </ProtectedSuperAdminRoute>
              }
            />
            <Route
              path="/superadmin/reports"
              element={
                <ProtectedSuperAdminRoute>
                  <Reports />
                </ProtectedSuperAdminRoute>
              }
            />
            <Route
              path="/superadmin/complaints"
              element={
                <ProtectedSuperAdminRoute>
                  <ComplaintsList />
                </ProtectedSuperAdminRoute>
              }
            />
            <Route
              path="/superadmin/complaints/:complaintId"
              element={
                <ProtectedSuperAdminRoute>
                  <AdminComplaintDetail />
                </ProtectedSuperAdminRoute>
              }
            />
            <Route
              path="/superadmin/heatmap"
              element={
                <ProtectedSuperAdminRoute>
                  <HeatMapView />
                </ProtectedSuperAdminRoute>
              }
            />

            {/* Citizen Complaint Routes */}
            <Route
              path="/filecomplaint"
              element={
                <ProtectedCitizenRoute>
                  <CreateComplaintModal />
                </ProtectedCitizenRoute>
              }
            />

            {/* Citizen Dashboard Routes */}
            <Route
              path="/citizendashboard"
              element={
                <ProtectedCitizenRoute>
                  <AppCitizenShell>
                    <DashboardHome />
                  </AppCitizenShell>
                </ProtectedCitizenRoute>
              }
            />
            <Route
              path="/my-complaints"
              element={
                <ProtectedCitizenRoute>
                  <AppCitizenShell>
                    <MyComplaints />
                  </AppCitizenShell>
                </ProtectedCitizenRoute>
              }
            />
            <Route
              path="/complaint/:complaintId"
              element={
                <ProtectedCitizenRoute>
                  <AppCitizenShell>
                    <ComplaintDetail />
                  </AppCitizenShell>
                </ProtectedCitizenRoute>
              }
            />

            {/* User Profile (protected) */}
            <Route
              path="/myprofile"
              element={
                <ProtectedRoute>
                  <DashboardF />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<HPage />} />
            <Route path="/birth-certificate" element={<BirthCertificate />} />
          </Routes>
          <ToastContainer theme="colored" />
        </Router>
      </MitraAuthProvider>
    </SuperAdminProvider>
  );
};

export default App;
