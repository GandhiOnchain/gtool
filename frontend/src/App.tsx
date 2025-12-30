import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/providers/AuthProvider";
import { ThemeProvider } from "./lib/providers/ThemeProvider";
import { Layout } from "./components/Layout";
import RelaySwap from "./pages/RelaySwap";
import NotFound from "./pages/NotFound";
import { RouteSync } from "./components/RouteSync";
import { ThemeSync } from "./components/ThemeSync";

const basename = "/";

const App = () => (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <AuthProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter basename={basename}>
                    <Layout appName="Relay Swap" showHeader={false}>
                    	<RouteSync />
                    	<ThemeSync />
                        <Routes>
                            <Route path="/" element={<RelaySwap />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </TooltipProvider>
        </AuthProvider>
    </ThemeProvider>
);

export default App;
