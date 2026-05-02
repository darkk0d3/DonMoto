import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmergencyButton from "@/components/EmergencyButton";
import Index from "@/pages/Index";
import Services from "@/pages/Services";
import Shop from "@/pages/Shop";
import Book from "@/pages/Book";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/book" element={<Book />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <EmergencyButton />
        <Toaster theme="dark" position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
