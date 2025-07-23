import { Navbar7 as Navbar } from "@/components/Navbar";
import { Hero12 } from "@/components/hero12";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
          <img
            alt="background"
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
            className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
          />
        </div>
        <div className="relative z-10 container">
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
                  alt="logo"
                  className="h-16"
                />
              </div>
              <div>
                <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                  Welcome to{" "}
                  <span className="text-primary">SenseiiWyze</span>
                </h1>
                <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                  Your intelligent dashboard for managing heritage collections and vintage portfolios.
                  We help you preserve, organize, and showcase your most valuable assets with cutting-edge AI technology.
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <Button className="shadow-sm transition-shadow hover:shadow" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
                <Button variant="outline" className="group" asChild>
                  <Link href="/auth/login">
                    Sign In{" "}
                    <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
              <div className="mt-20 flex flex-col items-center gap-5">
                <p className="font-medium text-muted-foreground lg:text-left">
                  Built with open-source technologies
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="#"
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                      "group flex aspect-square h-12 items-center justify-center p-0",
                    )}
                  >
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-icon.svg"
                      alt="shadcn/ui logo"
                      className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    />
                  </a>
                  <a
                    href="#"
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                      "group flex aspect-square h-12 items-center justify-center p-0",
                    )}
                  >
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/typescript-icon.svg"
                      alt="TypeScript logo"
                      className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    />
                  </a>
                  <a
                    href="#"
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                      "group flex aspect-square h-12 items-center justify-center p-0",
                    )}
                  >
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-icon.svg"
                      alt="React logo"
                      className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    />
                  </a>
                  <a
                    href="#"
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                      "group flex aspect-square h-12 items-center justify-center p-0",
                    )}
                  >
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-icon.svg"
                      alt="Tailwind CSS logo"
                      className="h-6 saturate-0 transition-all group-hover:saturate-100"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
