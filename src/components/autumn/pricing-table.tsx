'use client';

import React from "react";
// import { usePricingTable } from "autumn-js/react";
// import { useCustomer } from "@/hooks/useAutumnCustomer";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Check, Loader2 } from "lucide-react";
// import AttachDialog from "@/components/autumn/attach-dialog";
// import { getPricingTableContent } from "@/lib/autumn/pricing-table-content";
// import { Product, ProductItem } from "autumn-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingTable({
  productDetails,
}: {
  productDetails?: any;
}) {
  // const { attach } = useCustomer();
  const [isAnnual, setIsAnnual] = useState(false);
  // const { products, isLoading, error } = usePricingTable({ productDetails });

  // Temporarily disable Autumn integration
  const isLoading = false;
  const error = null;
  const products = productDetails || [];

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-muted-foreground">Something went wrong...</div>;
  }

  const intervals = Array.from(
    new Set(
      products?.map((p: any) => p.properties?.interval_group).filter((i: any) => !!i)
    )
  );

  const multiInterval = intervals.length > 1;

  const intervalFilter = (product: any) => {
    if (!product.properties?.interval_group) {
      return true;
    }

    if (multiInterval) {
      if (isAnnual) {
        return product.properties?.interval_group === "year";
      } else {
        return product.properties?.interval_group === "month";
      }
    }

    return true;
  };

  return (
    <div className={cn("w-full")}>
      {products && (
        <PricingTableContainer
          products={products as any}
          isAnnualToggle={isAnnual}
          setIsAnnualToggle={setIsAnnual}
          multiInterval={multiInterval}
        >
          {products.filter(intervalFilter).map((product: any, index: number) => (
            <PricingCard
              key={index}
              productId={product.id}
              buttonProps={{
                disabled:
                  product.scenario === "active" ||
                  product.scenario === "scheduled",

                onClick: async () => {
                  // Temporarily disable Autumn attach functionality
                  console.log('Pricing table interaction disabled - Autumn integration disabled');
                  if (product.display?.button_url) {
                    window.open(product.display?.button_url, "_blank");
                  }
                },
              }}
            />
          ))}
        </PricingTableContainer>
      )}
    </div>
  );
}

const PricingTableContext = createContext<{
  isAnnualToggle: boolean;
  setIsAnnualToggle: (isAnnual: boolean) => void;
  products: any[]; // Changed to any[] as Product type is removed
  showFeatures: boolean;
}>({
  isAnnualToggle: false,
  setIsAnnualToggle: () => {},
  products: [],
  showFeatures: true,
});

export const usePricingTableContext = (componentName: string) => {
  const context = useContext(PricingTableContext);

  if (context === undefined) {
    throw new Error(`${componentName} must be used within <PricingTable />`);
  }

  return context;
};

export const PricingTableContainer = ({
  children,
  products,
  showFeatures = true,
  className,
  isAnnualToggle,
  setIsAnnualToggle,
  multiInterval,
}: {
  children?: React.ReactNode;
  products?: any[]; // Changed to any[] as Product type is removed
  showFeatures?: boolean;
  className?: string;
  isAnnualToggle: boolean;
  setIsAnnualToggle: (isAnnual: boolean) => void;
  multiInterval: boolean;
}) => {
  if (!products) {
    throw new Error("products is required in <PricingTable />");
  }

  if (products.length === 0) {
    return <></>;
  }

  const hasRecommended = products?.some((p) => p.display?.recommend_text);
  
  return (
    <PricingTableContext.Provider
      value={{ isAnnualToggle, setIsAnnualToggle, products, showFeatures }}
    >
      <div className={cn("w-full", className)}>
        {multiInterval && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 bg-muted p-1 rounded-lg">
              <span className={cn(
                "px-3 py-1 text-sm font-medium transition-colors",
                !isAnnualToggle && "text-foreground"
              )}>
                Monthly
              </span>
              <Switch
                checked={isAnnualToggle}
                onCheckedChange={setIsAnnualToggle}
              />
              <span className={cn(
                "px-3 py-1 text-sm font-medium transition-colors",
                isAnnualToggle && "text-foreground"
              )}>
                Annual
                <Badge variant="secondary" className="ml-2">Save 20%</Badge>
              </span>
            </div>
          </div>
        )}
        
        <div className={cn(
          "grid gap-8",
          products.length === 2 && "md:grid-cols-2 max-w-4xl mx-auto",
          products.length === 3 && "md:grid-cols-3 max-w-6xl mx-auto",
          products.length > 3 && "md:grid-cols-2 lg:grid-cols-4"
        )}>
          {children}
        </div>
      </div>
    </PricingTableContext.Provider>
  );
};

export const PricingCard = ({
  productId,
  className,
  buttonProps,
}: {
  productId: string;
  className?: string;
  buttonProps?: any;
}) => {
  const { products } = usePricingTableContext("PricingCard");
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return null;
  }

  const isRecommended = product.display?.recommend_text;
  const priceItem = product.items?.find((item: any) => item.type === "flat" && item.id?.includes("price"));
  const features = product.items?.filter((item: any) => item.type === "unit");

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md",
        isRecommended && "border-primary shadow-md scale-105 hover:shadow-lg",
        className
      )}
    >
      {isRecommended && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          {product.display?.recommend_text}
        </Badge>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold">{product.display?.name || product.name}</h3>
        <p className="mt-2 text-muted-foreground">
          {product.display?.description || (product as any).description}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">
            {priceItem?.display?.primary_text || "Custom"}
          </span>
          {priceItem?.display?.secondary_text && (
            <span className="ml-2 text-muted-foreground">
              {priceItem.display.secondary_text}
            </span>
          )}
        </div>
        {product.display?.everything_from && (
          <p className="mt-1 text-sm text-primary font-medium">
            {product.display.everything_from}
          </p>
        )}
      </div>

      <Button
        className="w-full mb-8"
        variant={isRecommended ? "default" : "outline"}
        size="lg"
        {...buttonProps}
      >
        {product.scenario === "active" ? "Current Plan" : 
         product.display?.button_text || "Get Started"}
      </Button>

      <div className="space-y-3">
        {features?.map((feature: any, index: number) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">{feature.display?.primary_text}</span>
              {feature.display?.secondary_text && (
                <span className="text-muted-foreground ml-1">
                  {feature.display.secondary_text}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};