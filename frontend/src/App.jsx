import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { checkAuth } from "./features/authSlice";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);
  if (!authChecked) {
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);
  if (!authChecked) {
    return null;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-neutral-50 text-black">
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </main>
  )
}

export default App
