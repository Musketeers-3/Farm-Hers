import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Shelf from "@/pages/Shelf";
import Routine from "@/pages/Routine";
import Compare from "@/pages/Compare";
import Conflicts from "@/pages/Conflicts";
import Shop from "@/pages/Shop";
import Advisory from "@/pages/Advisory";
import Assistant from "@/pages/Assistant";
import Progress from "@/pages/Progress";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shelf" element={<Shelf />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/conflicts" element={<Conflicts />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/advisory" element={<Advisory />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/progress" element={<Progress />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
