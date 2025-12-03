import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmailProvider } from "@/contexts/EmailContext";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardView from "./view/DashboardView";
import PendingEmailsView from "./view/PendingEmailsView";
import NewEmailView from "./view/NewEmailView";
import EmailHistoryView from "./view/EmailHistoryView";
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
              <Route path="/" element={<DashboardView />} />
              <Route path="/pending" element={<PendingEmailsView />} />
              <Route path="/new" element={<NewEmailView />} />
              <Route path="/history" element={<EmailHistoryView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </EmailProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
