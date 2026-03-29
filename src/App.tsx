import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Checkout from "./pages/Checkout.tsx";
import ProductDetails from "./pages/ProductDetails.tsx";
import Partnership from "./pages/Partnership.tsx";
import TermsAndPrivacy from "./pages/TermsAndPrivacy.tsx";
import Warranty from "./pages/Warranty.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/terms-and-privacy" element={<TermsAndPrivacy />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/thank-you" element={<ThankYou />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
