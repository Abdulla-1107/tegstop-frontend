import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import MyRecords from '@/pages/MyRecords';
import AddRecord from '@/pages/AddRecord';
import NotFound from '@/pages/NotFound';
import './lib/i18n';

const queryClient = new QueryClient();

const App = () => {
  const { theme, setTheme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/my-records"
              element={
                <ProtectedRoute>
                  <MyRecords />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/add-record"
              element={
                <ProtectedRoute>
                  <AddRecord />
                // </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
