import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Shop Pages
import ShopLanding from "./pages/shop/ShopLanding";
import CategoryPage from "./pages/shop/CategoryPage";
import FormDetailPage from "./pages/shop/FormDetailPage";
import BundleDetailPage from "./pages/shop/BundleDetailPage";
import MyForms from "./pages/shop/MyForms";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import Formulare from "./pages/Formulare";
import Rechner from "./pages/Rechner";
import Dokumente from "./pages/Dokumente";
import Profil from "./pages/Profil";

// Property Management Pages
import OrganizationSetup from "./pages/OrganizationSetup";
import PropertyDashboard from "./pages/PropertyDashboard";
import Buildings from "./pages/Buildings";
import Units from "./pages/Units";
import Leases from "./pages/Leases";
import Tenants from "./pages/Tenants";
import Meters from "./pages/Meters";
import Tasks from "./pages/Tasks";
import Messages from "./pages/Messages";
import PropertySettings from "./pages/PropertySettings";

// Calculators
import RenditeRechner from "./pages/calculators/RenditeRechner";
import FinanzierungsRechner from "./pages/calculators/FinanzierungsRechner";
import NebenkostenRechner from "./pages/calculators/NebenkostenRechner";
import KaufnebenkostenRechner from "./pages/calculators/KaufnebenkostenRechner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Shop Routes */}
            <Route path="/" element={<ShopLanding />} />
            <Route path="/vermieter" element={<CategoryPage />} />
            <Route path="/mieter" element={<CategoryPage />} />
            <Route path="/formulare/:slug" element={<FormDetailPage />} />
            <Route path="/bundles/:slug" element={<BundleDetailPage />} />
            <Route path="/meine-formulare" element={<MyForms />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success" element={<Success />} />

            {/* Organization Setup */}
            <Route
              path="/organization/setup"
              element={
                <ProtectedRoute>
                  <OrganizationSetup />
                </ProtectedRoute>
              }
            />

            {/* Property Management Routes */}
            <Route
              path="/property"
              element={
                <ProtectedRoute>
                  <PropertyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/buildings"
              element={
                <ProtectedRoute>
                  <Buildings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/units"
              element={
                <ProtectedRoute>
                  <Units />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/leases"
              element={
                <ProtectedRoute>
                  <Leases />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/tenants"
              element={
                <ProtectedRoute>
                  <Tenants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/meters"
              element={
                <ProtectedRoute>
                  <Meters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/settings"
              element={
                <ProtectedRoute>
                  <PropertySettings />
                </ProtectedRoute>
              }
            />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<Navigate to="/dashboard/formulare" replace />} />
            <Route
              path="/dashboard/formulare"
              element={
                <ProtectedRoute>
                  <Formulare />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/rechner"
              element={
                <ProtectedRoute>
                  <Rechner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/rechner/rendite"
              element={
                <ProtectedRoute>
                  <RenditeRechner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/rechner/finanzierung"
              element={
                <ProtectedRoute>
                  <FinanzierungsRechner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/rechner/nebenkosten"
              element={
                <ProtectedRoute>
                  <NebenkostenRechner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/rechner/kaufnebenkosten"
              element={
                <ProtectedRoute>
                  <KaufnebenkostenRechner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/dokumente"
              element={
                <ProtectedRoute>
                  <Dokumente />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profil"
              element={
                <ProtectedRoute>
                  <Profil />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
