"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Target, TrendingUp, Shield, Star } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const AstralHero = () => {
  const { data: session, isPending } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  const isAuthenticated = isPending ? null : !!session?.user;
  const userRole = session?.user?.role || null;

  // Get appropriate dashboard route - now unified for all users
  const getDashboardRoute = (role: string | null): string => {
    return '/app'; // Unified dashboard for all users
  };

  const features = [
    { icon: Brain, label: "AI-Powered", value: "87% Accuracy" },
    { icon: Target, label: "Success Rate", value: "2-3x Faster" },
    { icon: TrendingUp, label: "ROI Boost", value: "40% Better" },
  ];
  
  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div 
        className="absolute inset-0 bg-astral-radial"
        style={{ y: backgroundY }}
      />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-1 rounded-full bg-gradient-to-br from-primary to-secondary"
            initial={{ 
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              transition: {
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              },
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <section className="relative z-10 flex min-h-screen items-center justify-center pt-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col items-center justify-center gap-6 text-center max-w-6xl mx-auto"
            style={{ y: textY }}
          >
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge 
              variant="outline" 
              className="group px-4 py-1.5 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer"
            >
              <Sparkles className="size-3 mr-1.5 text-primary animate-pulse" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">
                Powered by Readiness Index™ Algorithm
              </span>
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="block bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text text-custom-blue">
              Predict Training Success
            </span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-x">
              Before You Begin
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            SenseiiWyze's AI-powered Behviour Informatics Engine platform transforms corporate learning with predictive assessments, 
            delivering <span className="text-foreground font-semibold">2-3x faster skill acquisition</span> and 
            <span className="text-foreground font-semibold"> 40% better certification pass rates</span>.
          </motion.p>

          {/* Feature Pills */}
          <motion.div 
            className="flex flex-wrap gap-3 justify-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--muted) / 0.7)" }}
              >
                <feature.icon className="size-4 text-primary" />
                <span className="text-sm font-medium">{feature.label}:</span>
                <span className="text-sm text-primary font-semibold">{feature.value}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="group text-base px-8 py-6 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            >
              <span>Watch Demo</span>
              <ArrowRight className="size-4 ml-2 transition-all group-hover:translate-x-1" />
            </Button>
            
            {isAuthenticated === null ? (
              // Loading state
              <Button
                size="lg"
                className="text-base px-8 py-6 bg-primary hover:bg-primary/90"
                disabled
              >
                <span>Loading...</span>
              </Button>
            ) : isAuthenticated ? (
              // Authenticated - show dashboard button
              <Link href={getDashboardRoute(userRole)}>
                <Button
                  size="lg"
                  className="group text-base px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="size-4 ml-2 transition-all group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              // Not authenticated - show get started button
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="group text-base px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="size-4 ml-2 transition-all group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="flex items-center gap-6 mt-12 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-1.5">
              <Shield className="size-4 text-primary" />
              <span>SOC2 Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="size-4 text-primary" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="size-4 text-primary" />
              <span>Success Guarantee</span>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Animated Orbs */}
      <motion.div
        className="absolute top-20 right-10 size-96 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-10 size-96 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export { AstralHero };