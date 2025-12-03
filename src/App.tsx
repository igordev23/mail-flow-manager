import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmailProvider } from "@/contexts/EmailContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import PendingEmails from "./pages/PendingEmails";
import NewEmail from "./pages/NewEmail";
import EmailHistory from "./pages/EmailHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EmailProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pending" element={<PendingEmails />} />
              <Route path="/new" element={<NewEmail />} />
              <Route path="/history" element={<EmailHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </EmailProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
