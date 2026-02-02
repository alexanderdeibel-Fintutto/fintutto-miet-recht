import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Formulare from "./pages/Formulare";
import Rechner from "./pages/Rechner";
import Dokumente from "./pages/Dokumente";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";

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
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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
