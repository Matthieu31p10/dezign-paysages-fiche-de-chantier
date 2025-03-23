
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./components/projects/ProjectDetail";
import ProjectNew from "./pages/ProjectNew";
import ProjectEdit from "./pages/ProjectEdit";
import WorkLogs from "./pages/WorkLogs";
import WorkLogDetail from "./components/worklogs/WorkLogDetail";
import WorkLogNew from "./pages/WorkLogNew";
import WorkLogEdit from "./pages/WorkLogEdit";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            
            {/* Project routes */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<ProjectNew />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/:id/edit" element={<ProjectEdit />} />
            
            {/* Work log routes */}
            <Route path="/worklogs" element={<WorkLogs />} />
            <Route path="/worklogs/new" element={<WorkLogNew />} />
            <Route path="/worklogs/:id" element={<WorkLogDetail />} />
            <Route path="/worklogs/:id/edit" element={<WorkLogEdit />} />
            
            {/* Report routes */}
            <Route path="/reports" element={<Reports />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
