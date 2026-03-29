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
import { scrollToSection } from "@/lib/utils";

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

const INITIATIVES_API = "https://sohub.com.bd/api/initiatives.json";
const CURRENT_SITE_ID = "protect";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [initiativesOpen, setInitiativesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  const isHome = location.pathname === "/";

  const navLinks = [
    { label: "কেন প্রটেক্ট?", href: "#why", targetId: "why" },
    { label: "প্যাকেজ", href: "#packages", targetId: "packages" },
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
      .catch(() => { });
  }, []);

  // Scroll detection + Active section tracking
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection Observer for active section highlighting
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // Detect section when it's roughly in the middle of the viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Sections to observe
    const sections = ["why", "packages", "how", "order"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const getLogoUrl = (logoPath: string) => {
    if (logoPath.startsWith("http")) return logoPath;
    return `https://sohub.com.bd${logoPath}`;
  };

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    if (!isHome) return;
    e.preventDefault();
    scrollToSection(targetId, targetId === "hero" ? 0 : 32);
    setIsOpen(false);
    // Explicitly clear hash just in case
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* ── Top Bar — SOHUB branding + Initiatives ── */}
      <div
        className={`bg-[#f6fafc] backdrop-blur-sm transition-all duration-300 overflow-hidden ${isScrolled ? "max-h-0 opacity-0 border-none" : "max-h-24 opacity-100 border-b border-gray-200"
          }`}
      >
        <div className={`section-container transition-all duration-300 ${isScrolled ? "py-0" : "py-0.5 md:py-1"}`}>
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-0" : "h-6 md:h-8"}`}>
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
                  Solution Hub Technologies (SOHUB) Owned & Operated
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
                        className="flex items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
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
            <a href="/" onClick={(e) => handleNavClick(e, "hero")}>
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
            {navLinks.map((link) => {
              const isActive = activeSection === link.href || (location.pathname === link.href && !activeSection);
              
              return link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm transition-colors ${
                    location.pathname === link.href 
                      ? "text-primary-foreground font-semibold" 
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ) : isHome ? (
                <a
                  key={link.href}
                  href="/"
                  onClick={(e) => handleNavClick(e, link.targetId!)}
                  className={`text-sm transition-colors ${
                    activeSection === link.href 
                      ? "text-primary-foreground font-semibold" 
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={`/${link.href}`}
                  className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {isHome ? (
            <a
              href="/"
              onClick={(e) => handleNavClick(e, "order")}
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
                      href="/"
                      className="text-primary-foreground/80 hover:text-primary-foreground py-2"
                      onClick={(e) => handleNavClick(e, link.targetId!)}
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
                href="/"
                className="flex items-center justify-center gap-2 bg-primary-foreground text-primary px-5 py-3 rounded-full text-sm font-medium mt-2"
                onClick={(e) => handleNavClick(e, "order")}
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
