import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoWithIcon from "@/assets/logo-with-icon.png";
import { Menu, X, ShoppingBag } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  const navLinks = [
    { label: "কেন প্রটেক্ট?", href: "#why", isHash: true },
    { label: "কিভাবে কাজ করে", href: "#how", isHash: true },
    { label: "পণ্যের বিবরণ", href: "/product-details", isRoute: true },
    { label: "পার্টনারশিপ", href: "/partnership", isRoute: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md">
      <div className="section-container flex items-center justify-between h-16">
        <Link to="/">
          <img src={logoWithIcon} alt="SOHUB Protect" className="h-10 md:h-12" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </Link>
            ) : isHome ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={`/${link.href}`}
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          {isHome ? (
            <a
              href="#order"
              className="flex items-center gap-2 bg-primary-foreground text-primary px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              অর্ডার করুন
            </a>
          ) : (
            <Link
              to="/#order"
              className="flex items-center gap-2 bg-primary-foreground text-primary px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              অর্ডার করুন
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-primary/98 border-t border-primary-foreground/10 pb-6">
          <div className="section-container flex flex-col gap-4 pt-4">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground/80 hover:text-primary-foreground py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ) : isHome ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-primary-foreground/80 hover:text-primary-foreground py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={`/${link.href}`}
                  className="text-primary-foreground/80 hover:text-primary-foreground py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="#order"
              className="flex items-center justify-center gap-2 bg-primary-foreground text-primary px-5 py-3 rounded-full text-sm font-medium mt-2"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="w-4 h-4" />
              অর্ডার করুন
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
