import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CheckCircle2, 
  Package, 
  Clock, 
  PhoneCall, 
  Phone, 
  Mail, 
  Home,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("tran_id") || "N/A";

  useEffect(() => {
    document.title = "Thank You - SOHUB Protect";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Thank You!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Your SOHUB Protect order has been successfully placed.
            </motion.p>
          </div>

          {/* Order Summary Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8"
          >
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 text-center">Order Summary</h2>
            </div>
            <div className="px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-gray-500 font-medium">Order Number:</span>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">{orderId}</span>
            </div>
          </motion.div>

          {/* Next Steps Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 text-center mb-12">What happens next?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center group">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <Package className="w-7 h-7 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Order Processing</h4>
                <p className="text-sm text-gray-500 leading-relaxed">We'll prepare your order for installation.</p>
              </div>

              <div className="text-center group">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <Clock className="w-7 h-7 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Delivery Time</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Expected within 1-2 business days.</p>
              </div>

              <div className="text-center group">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <PhoneCall className="w-7 h-7 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Stay Updated</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Our team will call you shortly with updates.</p>
              </div>
            </div>
          </motion.div>

          {/* Help Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0f172a] rounded-2xl p-8 border border-white/5 shadow-xl shadow-black/10 overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-primary/30 transition-all duration-700" />
            <div className="relative z-10 text-center">
              <h3 className="text-xl font-bold text-white mb-6">Need Help?</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/90">
                <a href="tel:09678076482" className="flex items-center gap-3 hover:text-primary transition-colors group/link">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/link:bg-primary/20">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold">09678-076482</span>
                </a>
                <a href="mailto:hello@sohub.com.bd" className="flex items-center gap-3 hover:text-primary transition-colors group/link">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/link:bg-primary/20">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold">hello@sohub.com.bd</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Checkout Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mt-12"
          >
            <Link
              to="/"
              className="group flex items-center gap-2 bg-[#0f172a] text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
