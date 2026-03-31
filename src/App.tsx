import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";

const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const AITutor = lazy(() => import("./pages/AITutor"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function RouteLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );
}

function ProtectedShell() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <AnimatedRoutes>
          <Outlet />
        </AnimatedRoutes>
      </AppLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes location={location}>
        <Route path="/landing" element={<AnimatedRoutes><Landing /></AnimatedRoutes>} />
        <Route path="/auth" element={<AnimatedRoutes><Auth /></AnimatedRoutes>} />

        <Route element={<ProtectedShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
