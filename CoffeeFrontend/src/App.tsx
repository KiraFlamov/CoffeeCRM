import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style/App.css";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import POSPage from "./pages/POSPage";
import UsersPage from "./pages/UsersPage";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* публичная страница */}
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        <Route
          path="/products"
          element={
            <ProtectedRoute role="admin">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProductsPage />} />
        </Route>

        <Route
          path="/orders"
          element={
            <ProtectedRoute role="cashier">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OrdersPage />} />
        </Route>

        <Route
          path="/pos"
          element={
            <ProtectedRoute role="cashier">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<POSPage />} />
        </Route>
        
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UsersPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;