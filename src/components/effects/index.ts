/**
 * Effects Components
 *
 * Visual enhancement components for creating sophisticated UI effects
 * while maintaining professional appearance and accessibility standards.
 */

export { BlobAnimation } from './BlobAnimation'
export { EffectsDemo } from './EffectsDemo'
export { GradientBackground } from './GradientBackground'
export { GradientButton } from './GradientButton'
export { GradientText } from './GradientText'
export { GridPattern } from './GridPattern'

/**
 * Usage Examples:
 *
 * // Gradient text for headings
 * <GradientText variant="brand" size="2xl" animate>
 *   AI-Powered Learning Platform
 * </GradientText>
 *
 * // Enhanced buttons with visual effects
 * <GradientButton variant="brand" size="lg" animated glow>
 *   Get Started
 * </GradientButton>
 *
 * // Animated background effects
 * <div className="relative">
 *   <BlobAnimation variant="primary" size="lg" className="top-10 left-10" />
 *   <BlobAnimation variant="secondary" size="md" className="bottom-10 right-10" />
 *   <Content />
 * </div>
 *
 * // Full-page gradient backgrounds
 * <GradientBackground variant="astral" intensity="subtle" direction="radial" />
 *
 * // Subtle pattern overlays
 * <div className="relative">
 *   <GridPattern variant="dots" size="md" intensity="subtle" />
 *   <Content />
 * </div>
 */
