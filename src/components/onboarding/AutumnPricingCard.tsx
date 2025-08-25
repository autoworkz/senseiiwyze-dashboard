import { Check, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AutumnPricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: string;
    period: string;
    popular: boolean;
    features: string[];
    color: string;
    buttonText: string;
  };
  selected: boolean;
  onSelect: (planId: string) => void;
  index: number;
}

export function AutumnPricingCard({ plan, selected, onSelect, index }: AutumnPricingCardProps) {
  return (
    <Card 
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:shadow-lg group",
        plan.color,
        selected && "ring-2 ring-primary shadow-lg scale-105",
        plan.popular && "border-primary shadow-md"
      )}
      onClick={() => onSelect(plan.id)}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-primary to-custom-blue text-white px-4 py-1 shadow-lg">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {/* Autumn Integration Indicator */}
      <div className="absolute top-4 right-4">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
      </div>

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
        
        {/* Price with Autumn Styling */}
        <div className="mt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-custom-blue bg-clip-text text-transparent">
              {plan.price}
            </span>
            {plan.price !== 'Custom' && (
              <span className="text-sm text-muted-foreground">/{plan.period.split('/')[1]}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{plan.period}</p>
          
          {/* Autumn Billing Info */}
          {plan.id !== 'enterprise' && (
            <p className="text-xs text-primary/70 mt-2">
              Billed through Autumn • Powered by Stripe
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features List */}
        <ul className="space-y-2">
          {plan.features.map((feature, featureIndex) => (
            <li
              key={featureIndex}
              className="flex items-start gap-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity"
            >
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Autumn-powered Select Button */}
        <Button
          className={cn(
            "w-full mt-6 text-white transition-all duration-200",
            "bg-gradient-to-r from-primary to-custom-blue hover:from-primary/90 hover:to-custom-blue/90",
            "shadow-lg hover:shadow-xl",
            selected && "ring-2 ring-primary/50 scale-105"
          )}
          variant={selected ? "default" : "outline"}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(plan.id);
          }}
        >
          {selected ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Selected
            </>
          ) : (
            plan.buttonText
          )}
        </Button>

        {/* Autumn Features Badge */}
        {plan.id !== 'enterprise' && (
          <div className="text-center pt-2">
            <Badge variant="secondary" className="text-xs">
              14-day free trial included
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
