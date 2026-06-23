import { AdminLayout } from "@/components/layout/AdminLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminRoute } from "@/components/routing/AdminRoute";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import { StaffRoute } from "@/components/routing/StaffRoute";
import { Analytics } from "@/pages/admin/Analytics";
import { AuditLogs } from "@/pages/admin/AuditLogs";
import { PricingRules } from "@/pages/admin/PricingRules";
import { ReviewsModeration } from "@/pages/admin/ReviewsModeration";
import { RoomsManage } from "@/pages/admin/RoomsManage";
import { ServiceOrdersManage } from "@/pages/admin/ServiceOrdersManage";
import { ServicesManage } from "@/pages/admin/ServicesManage";
import { UsersManage } from "@/pages/admin/UsersManage";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { BookingWizardPage } from "@/pages/BookingWizardPage";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { Reviews } from "@/pages/Reviews";
import { RoomDetail } from "@/pages/RoomDetail";
import { Rooms } from "@/pages/Rooms";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Services } from "@/pages/Services";
import { Dashboard } from "@/pages/guest/Dashboard";
import { MyBookings } from "@/pages/guest/MyBookings";
import { MyServices } from "@/pages/guest/MyServices";
import { Profile } from "@/pages/guest/Profile";
import { WriteReview } from "@/pages/guest/WriteReview";
import { StaffServiceOrders } from "@/pages/staff/StaffServiceOrders";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/rooms/:id/book" element={<ProtectedRoute><BookingWizardPage /></ProtectedRoute>} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/guest" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/guest/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/guest/orders" element={<ProtectedRoute><MyServices /></ProtectedRoute>} />
        <Route path="/guest/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/guest/loyalty" element={<Navigate to="/guest" replace />} />
        <Route path="/guest/reviews/write" element={<ProtectedRoute><WriteReview /></ProtectedRoute>} />
        <Route
          path="/staff/orders"
          element={
            <StaffRoute>
              <StaffServiceOrders />
            </StaffRoute>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="analytics" replace />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="rooms" element={<RoomsManage />} />
        <Route path="services" element={<ServicesManage />} />
        <Route path="service-orders" element={<ServiceOrdersManage />} />
        <Route path="reviews" element={<ReviewsModeration />} />
        <Route path="pricing" element={<PricingRules />} />
        <Route path="users" element={<UsersManage />} />
        <Route path="audit" element={<AuditLogs />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
