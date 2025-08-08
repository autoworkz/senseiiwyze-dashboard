"use client";

import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import { useSession } from "@/lib/auth-client";

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

interface Navbar1Props {
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

const Navbar1 = ({
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
          icon: <Zap className="size-5 shrink-0" />,
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
          icon: <Zap className="size-5 shrink-0" />,
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
}: Navbar1Props) => {
  const { data: session, isPending } = useSession();
  
  const isAuthenticated = isPending ? null : !!session?.user;
  const userRole = session?.user?.role || null;

  // Get appropriate dashboard route - now unified for all users
  const getDashboardRoute = (role: string | null): string => {
    return '/app'; // Unified dashboard for all users
  };

  const renderAuthButtons = () => {
    if (isAuthenticated === null) {
      // Loading state
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Loading...
          </Button>
        </div>
      );
    }

    if (isAuthenticated) {
      // Authenticated - show dashboard button
      return (
        <div className="flex gap-2">
          <Button asChild size="sm">
            <a href={getDashboardRoute(userRole)}>{auth.dashboard.title}</a>
          </Button>
        </div>
      );
    }

    // Not authenticated - show login and signup buttons
    return (
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm">
          <a href={auth.login.url}>{auth.login.title}</a>
        </Button>
        <Button asChild size="sm">
          <a href={auth.signup.url}>{auth.signup.title}</a>
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
          <Button asChild>
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
        <Button asChild>
          <a href={auth.signup.url}>{auth.signup.title}</a>
        </Button>
      </div>
    );
  };

  return (
    <section className="py-4">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              {logo.src && (
                <img src={logo.src} className="max-h-8" alt={logo.alt} />
              )}
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          {renderAuthButtons()}
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              {logo.src && (
                <img src={logo.src} className="max-h-8" alt={logo.alt} />
              )}
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      {logo.src && (
                        <img src={logo.src} className="max-h-8" alt={logo.alt} />
                      )}
                      <span className="text-lg font-semibold tracking-tighter">
                        {logo.title}
                      </span>
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
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
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
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar1 };