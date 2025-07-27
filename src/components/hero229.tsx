"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

const Hero229 = () => {
  return (
    <section className="relative h-[100dvh] w-[100dvw] overflow-hidden border bg-background py-32">
      <div className="relative z-20 container flex flex-col items-center justify-center gap-4 text-center">
        <Button
          variant="secondary"
          className="group text-md mt-42 flex w-fit items-center justify-center gap-3 rounded-full bg-muted/60 px-5 py-1 tracking-tight"
        >
          <span className="size-2 rounded-full bg-foreground" />
          <span>See Pricing</span>
        </Button>
        <h1 className="max-w-3xl text-5xl font-medium tracking-tighter text-foreground md:text-7xl">
          Blocks Built <br /> With Shadcn & Tailwind.
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground/80">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum animi,
          ipsam provident optio delectus neque aliquid cumque. Beatae, odio!
        </p>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="group text-md flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
          >
            <span>Documentation</span>
            <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
          </Button>
          <Button
            variant="default"
            className="group text-md flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
          >
            <span>Get Started</span>
            <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
          </Button>
        </div>
      </div>

      <Illustration1
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0, 0, 0, 1.12] }}
        className="absolute top-0 left-1/2 -translate-x-1/2"
      />
      <Illustration1
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0, 0, 0, 1.12] }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 scale-y-[-1]"
      />
      <Illustration2
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0, 0, 0, 1.12] }}
        className="absolute top-1/2 left-0 z-99 hidden -translate-y-1/2 md:block"
      />
      <Illustration2
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0, 0, 0, 1.12] }}
        className="absolute top-1/2 right-0 z-99 hidden -translate-y-1/2 scale-x-[-1] md:block"
      />
    </section>
  );
};

export { Hero229 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Illustration1 = (props: any) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={460}
      height={233}
      fill="none"
      {...props}
    >
      <path stroke="url(#a)" d="M141.338 232.625V5.075" />
      <path stroke="url(#b)" d="M176.338 232.625V5.075" />
      <path stroke="url(#c)" d="M212.338 231.625V4.075" />
      <path stroke="url(#d)" d="M248.338 230.625V3.075" />
      <path stroke="url(#e)" d="M284.338 229.625V2.075" />
      <path stroke="url(#f)" d="M320.338 228.625V1.075" />
      <path
        stroke="url(#g)"
        d="M459.649 152.723 351.613 69.264a11 11 0 0 1-4.275-8.705V.074"
      />
      <path
        stroke="url(#h)"
        d="m.338 152.723 108.036-83.459a11 11 0 0 0 4.275-8.705V.074"
      />
      <defs>
        <linearGradient
          id="a"
          x1={141.838}
          x2={141.838}
          y1={232.625}
          y2={5.074}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#999" />
        </linearGradient>
        <linearGradient
          id="b"
          x1={176.838}
          x2={176.838}
          y1={232.625}
          y2={5.074}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#999" />
        </linearGradient>
        <linearGradient
          id="c"
          x1={212.838}
          x2={212.838}
          y1={231.625}
          y2={4.074}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#999" />
        </linearGradient>
        <linearGradient
          id="d"
          x1={248.838}
          x2={248.838}
          y1={230.625}
          y2={3.074}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#999" />
        </linearGradient>
        <linearGradient
          id="e"
          x1={284.838}
          x2={284.838}
          y1={229.625}
          y2={2.074}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#999" />
        </linearGradient>
        <linearGradient
          id="f"
          x1={320.838}
          x2={320.838}
          y1={228.625}
          y2={1.074}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#999" />
        </linearGradient>
        <linearGradient
          id="g"
          x1={403.494}
          x2={403.494}
          y1={152.723}
          y2={0.074}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#999" />
        </linearGradient>
        <linearGradient
          id="h"
          x1={56.494}
          x2={56.494}
          y1={152.723}
          y2={0.074}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset={1} stopColor="#999" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Illustration2 = (props: any) => {
  return (
    <motion.svg
      {...props}
      width="200"
      height="444"
      viewBox="0 0 323 444"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 442.957L209.048 442.957C212.366 442.957 215.508 441.458 217.596 438.879L321.802 310.196"
        stroke="url(#paint0_linear_290_207)"
      />
      <path
        d="M0 1.19531L209.048 1.19557C212.366 1.19558 215.508 2.69391 217.596 5.27302L321.802 133.956"
        stroke="url(#paint1_linear_290_207)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_290_207"
          x1="160.901"
          y1="442.957"
          x2="160.901"
          y2="310.196"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#999999" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_290_207"
          x1="160.901"
          y1="1.19531"
          x2="160.901"
          y2="133.956"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#999999" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};
