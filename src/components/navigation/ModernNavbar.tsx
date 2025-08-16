"use client";

import { Book, Menu, Sunset, Trees, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface ModernNavbarProps {
  logo?: {
    url: string;
    src?: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
    dashboard: {
      title: string;
    };
  };
}

const ModernNavbar = ({
  logo = {
    url: "/",
    alt: "SenseiiWyze Logo",
    title: "SenseiiWyze",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Products",
      url: "#",
      items: [
        {
          title: "Readiness Index",
          description: "AI-powered skill assessment and success prediction",
          icon: <Book className="size-5 shrink-0" />,
          url: "#readiness",
        },
        {
          title: "AI Coaching",
          description: "24/7 personalized learning guidance and support",
          icon: <Book className="size-5 shrink-0" />,
          url: "#coaching",
        },
        {
          title: "Analytics",
          description: "Real-time insights into training ROI and outcomes",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#analytics",
        },
        {
          title: "Success Guarantee",
          description: "Outcome-based pricing with partial refunds for missed targets",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#guarantee",
        },
      ],
    },
    {
      title: "Solutions",
      url: "#",
      items: [
        {
          title: "For Enterprises",
          description: "Corporate L&D programs with team analytics",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#enterprise",
        },
        {
          title: "For Professionals",
          description: "Individual skill development and career advancement",
          icon: <Book className="size-5 shrink-0" />,
          url: "#professionals",
        },
        {
          title: "For Institutions",
          description: "Educational programs with improved student outcomes",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#institutions",
        },
        {
          title: "Integrations",
          description: "Connect with existing HR and learning systems",
          icon: <Book className="size-5 shrink-0" />,
          url: "#integrations",
        },
      ],
    },
    {
      title: "Pricing",
      url: "#pricing",
    },
    {
      title: "Resources",
      url: "#resources",
    },
  ],
  auth = {
    login: { title: "Sign In", url: "/auth/login" },
    signup: { title: "Get Started", url: "/auth/signup" },
    dashboard: { title: "Dashboard" },
  },
}: ModernNavbarProps) => {
  const { data: session, isPending } = useSession();
  const [scrolled, setScrolled] = useState(false);
  
  const isAuthenticated = isPending ? null : !!session?.user;
  const userRole = session?.user?.role || null;

  // Get appropriate dashboard route - now unified for all users
  const getDashboardRoute = (role: string | null): string => {
    return '/app'; // Unified dashboard for all users
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderAuthButtons = () => {
    if (isAuthenticated === null) {
      // Loading state
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="bg-transparent border-muted-foreground/20">
            Loading...
          </Button>
        </div>
      );
    }

    if (isAuthenticated) {
      // Authenticated - show dashboard button
      return (
        <div className="flex gap-2">
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <a href={getDashboardRoute(userRole)} className="flex items-center gap-1">
              {auth.dashboard.title}
              <ArrowRight className="size-3" />
            </a>
          </Button>
        </div>
      );
    }

    // Not authenticated - show login and signup buttons
    return (
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="bg-transparent border-muted-foreground/20 hover:bg-muted/20">
          <a href={auth.login.url}>{auth.login.title}</a>
        </Button>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
          <a href={auth.signup.url} className="flex items-center gap-1">
            {auth.signup.title}
            <ArrowRight className="size-3" />
          </a>
        </Button>
      </div>
    );
  };

  const renderMobileAuthButtons = () => {
    if (isAuthenticated === null) {
      // Loading state
      return (
        <div className="flex flex-col gap-3">
          <Button variant="outline" disabled>
            Loading...
          </Button>
        </div>
      );
    }

    if (isAuthenticated) {
      // Authenticated - show dashboard button
      return (
        <div className="flex flex-col gap-3">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <a href={getDashboardRoute(userRole)}>{auth.dashboard.title}</a>
          </Button>
        </div>
      );
    }

    // Not authenticated - show login and signup buttons
    return (
      <div className="flex flex-col gap-3">
        <Button asChild variant="outline">
          <a href={auth.login.url}>{auth.login.title}</a>
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <a href={auth.signup.url}>{auth.signup.title}</a>
        </Button>
      </div>
    );
  };

  return (
    <motion.header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg" 
          : "bg-gradient-to-b from-background/50 to-transparent backdrop-blur-sm"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Menu */}
        <div className="hidden justify-between lg:flex py-4">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <motion.a 
              href={logo.url} 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-[200px] h-10">
                <Image
                  src="/assets/images/logo.jpeg"
                  alt={logo.alt}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </motion.a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {renderAuthButtons()}
        </div>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <motion.a 
              href={logo.url} 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-[200px] h-10">
                <Image
                  src="/assets/images/logo.jpeg"
                  alt={logo.alt}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </motion.a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-transparent border-muted-foreground/20">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-background/95 backdrop-blur-xl">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <div className="relative w-[200px] h-10">
                        <Image
                          src="/assets/images/logo.jpeg"
                          alt={logo.alt}
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  {renderMobileAuthButtons()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="bg-transparent data-[state=open]:bg-muted/50">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-lg min-w-[400px]">
          <div className="grid grid-cols-2 gap-2 p-4">
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title}>
                <SubMenuLink item={subItem} />
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all hover:bg-muted/50 hover:text-primary"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <motion.a
      className="flex flex-row gap-4 rounded-lg p-4 leading-none no-underline transition-all outline-none select-none hover:bg-muted/50 focus:bg-muted/50 group border border-transparent hover:border-border/30"
      href={item.url}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-primary group-hover:text-secondary transition-colors">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold mb-1">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </motion.a>
  );
};

export { ModernNavbar };