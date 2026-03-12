import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoWithIcon from "@/assets/logo-with-icon.png";
import sohubLogo from "@/assets/ace41ae7-2ae1-4476-85cf-1d1637a02cb0.png";
import { Menu, X, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ─── Initiative type ─── */
interface Initiative {
  id: string;
  name: string;
  description: string;
  logo: string;
  href: string;
  order: number;
  isActive: boolean;
}

const INITIATIVES_API = "https://sohub.netlify.app/api/initiatives.json";
const CURRENT_SITE_ID = "protect";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [initiativesOpen, setInitiativesOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  const navLinks = [
    { label: "কেন প্রটেক্ট?", href: "#why", isHash: true },
    { label: "কিভাবে কাজ করে", href: "#how", isHash: true },
    { label: "পণ্যের বিবরণ", href: "/product-details", isRoute: true },
    { label: "পার্টনারশিপ", href: "/partnership", isRoute: true },
  ];

  // Fetch initiatives
  useEffect(() => {
    fetch(INITIATIVES_API, {
      mode: "cors",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : data.initiatives || [];
        setInitiatives(
          items.filter((i: Initiative) => i.isActive).sort((a: Initiative, b: Initiative) => a.order - b.order)
        );
      })
      .catch(() => {});
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLogoUrl = (logoPath: string) => {
    if (logoPath.startsWith("http")) return logoPath;
    return `https://sohub.netlify.app${logoPath}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* ── Top Bar — SOHUB branding + Initiatives ── */}
      <div
        className={`bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 transition-all duration-300 overflow-hidden ${
          isScrolled ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
        }`}
      >
        <div className="section-container py-0 md:py-2">
          <div className="flex items-center justify-between h-7 md:h-auto">
            {/* Left — SOHUB branding */}
            <a
              href="https://sohub.com.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 md:gap-2.5"
            >
              <img
                src={sohubLogo}
                alt="Solution Hub"
                className="h-4 md:h-6"
              />
              <p className="text-[10px] md:text-[13px] text-gray-500 font-medium tracking-tight">
                <span className="hidden md:inline">
                  Solution Hub Technologies(SOHUB) Owned & Operated
                </span>
                <span className="md:hidden">SOHUB Owned & Operated</span>
              </p>
            </a>

            {/* Right — Our Initiatives dropdown */}
            <DropdownMenu modal={false} onOpenChange={setInitiativesOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-[10px] md:text-[13px] text-gray-500 hover:text-gray-900 transition-colors -mr-1 md:mr-0 py-0 md:py-1 font-medium">
                  <span>Our Initiatives</span>
                  {initiativesOpen ? (
                    <ChevronUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  ) : (
                    <ChevronDown className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[320px] p-3 border-gray-200 shadow-xl bg-white z-[10000]"
              >
                <div className="grid grid-cols-3 gap-3">
                  {initiatives.map((initiative) => {
                    const isCurrent = initiative.id === CURRENT_SITE_ID;
                    return (
                      <a
                        key={initiative.id}
                        href={isCurrent ? "/" : initiative.href}
                        target={isCurrent ? undefined : "_blank"}
                        rel={isCurrent ? undefined : "noopener noreferrer"}
                        onMouseDown={(e) => e.preventDefault()}
                        style={{
                          WebkitTapHighlightColor: "transparent",
                          outline: "none",
                        }}
                        className={`flex items-center justify-center p-4 rounded-lg border transition-colors ${
                          isCurrent
                            ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <img
                          src={getLogoUrl(initiative.logo)}
                          alt={initiative.name}
                          className="w-full h-full object-contain"
                        />
                      </a>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className="bg-primary/95 backdrop-blur-md">
        <div className="section-container flex items-center justify-between h-16">
          {isHome ? (
            <a href="#hero">
              <img
                src={logoWithIcon}
                alt="SOHUB Protect"
                className="h-8 md:h-10"
              />
            </a>
          ) : (
            <Link to="/#hero">
              <img
                src={logoWithIcon}
                alt="SOHUB Protect"
                className="h-8 md:h-10"
              />
            </Link>
          )}

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
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
          </div>

          {isHome ? (
            <a
              href="#order"
              className="hidden md:flex items-center gap-2 bg-primary-foreground text-primary px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              অর্ডার করুন
            </a>
          ) : (
            <Link
              to="/#order"
              className="hidden md:flex items-center gap-2 bg-primary-foreground text-primary px-5 py-2 rounded-full text-sm font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              অর্ডার করুন
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
      </div>
    </nav>
  );
};

export default Navbar;
