import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Eagerly load the landing page for fast initial render
import ShopLanding from "./pages/shop/ShopLanding";

// Lazy load all other pages for code splitting
const CategoryPage = lazy(() => import("./pages/shop/CategoryPage"));
const FormDetailPage = lazy(() => import("./pages/shop/FormDetailPage"));
const BundleDetailPage = lazy(() => import("./pages/shop/BundleDetailPage"));
const MyForms = lazy(() => import("./pages/shop/MyForms"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Success = lazy(() => import("./pages/Success"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Formulare = lazy(() => import("./pages/Formulare"));
const Rechner = lazy(() => import("./pages/Rechner"));
const Dokumente = lazy(() => import("./pages/Dokumente"));
const Profil = lazy(() => import("./pages/Profil"));

const OrganizationSetup = lazy(() => import("./pages/OrganizationSetup"));
const PropertyDashboard = lazy(() => import("./pages/PropertyDashboard"));
const Buildings = lazy(() => import("./pages/Buildings"));
const Units = lazy(() => import("./pages/Units"));
const Leases = lazy(() => import("./pages/Leases"));
const Tenants = lazy(() => import("./pages/Tenants"));
const Meters = lazy(() => import("./pages/Meters"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Messages = lazy(() => import("./pages/Messages"));
const PropertySettings = lazy(() => import("./pages/PropertySettings"));

const RenditeRechner = lazy(() => import("./pages/calculators/RenditeRechner"));
const FinanzierungsRechner = lazy(() => import("./pages/calculators/FinanzierungsRechner"));
const NebenkostenRechner = lazy(() => import("./pages/calculators/NebenkostenRechner"));
const KaufnebenkostenRechner = lazy(() => import("./pages/calculators/KaufnebenkostenRechner"));

const queryClient = new QueryClient();

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
