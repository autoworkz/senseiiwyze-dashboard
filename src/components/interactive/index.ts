// Interactive wrapper components that enhance shadcn/ui components
// without modifying the original components

export type { InteractiveButtonProps } from './InteractiveButton'
export { InteractiveButton } from './InteractiveButton'
export type { InteractiveCardProps } from './InteractiveCard'
export {
  InteractiveCard,
  InteractiveCardAction,
  InteractiveCardContent,
  InteractiveCardDescription,
  InteractiveCardFooter,
  InteractiveCardHeader,
  InteractiveCardTitle,
} from './InteractiveCard'
export type { InteractiveInputProps } from './InteractiveInput'
export { InteractiveInput } from './InteractiveInput'
export type { UseInteractiveOptions, UseInteractiveReturn } from './useInteractive'
// Re-export the hook when it's created
export { useInteractive } from './useInteractive'
