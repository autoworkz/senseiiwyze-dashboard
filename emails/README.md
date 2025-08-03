# Email Tokens Library

This tokens library provides consistent design tokens for React Email templates, including colors, fonts, spacing, borders, and shadows.

## Available Exports

### Direct Token Imports

```typescript
import { colors, fonts, spacing, borders, shadows } from './tokens';

// Use individual tokens
const primaryColor = colors.primary;
const baseSpacing = spacing.md;
const systemFont = fonts.family;
```

### Combined Tokens Object

```typescript
import { designTokens } from './tokens';
// or
import designTokens from './tokens'; // default export

// Access nested tokens
const primaryColor = designTokens.colors.primary;
const baseFont = designTokens.fonts.size.base;
```

### useTokens Hook

For React components that need dynamic access to tokens:

```typescript
import { useTokens } from './tokens';

export const MyEmailComponent = () => {
  const tokens = useTokens();
  
  return (
    <Text style={{ color: tokens.colors.primary }}>
      Hello World
    </Text>
  );
};
```

### Pre-built Email Styles

Use `createEmailStyles()` for common email styling patterns:

```typescript
import { createEmailStyles } from './tokens';

export const MyEmail = () => {
  const styles = createEmailStyles();
  
  return (
    <Html>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>My Title</Heading>
          <Text style={styles.paragraph}>My content</Text>
          <Button style={styles.buttonPrimary}>Click Me</Button>
        </Container>
      </Body>
    </Html>
  );
};
```

## Available Tokens

### Colors

```typescript
colors = {
  // Brand colors
  primary: '#2754C5',
  secondary: '#656ee8',
  accent: '#556cd6',
  
  // Backgrounds
  background: '#f6f9fc',
  white: '#ffffff',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#525f7f',
  textMuted: '#898989',
  textLight: '#8898aa',
  
  // Borders and neutrals
  border: '#e6ebf1',
  borderLight: '#eeeeee',
  neutralLight: '#f4f4f4',
  neutralDark: '#898989',
  
  // State colors
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
}
```

### Fonts

```typescript
fonts = {
  family: "system font stack",
  size: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '24px',
    xxxl: '32px',
  },
  lineHeight: {
    tight: '16px',
    base: '20px',
    normal: '22px',
    relaxed: '24px',
    loose: '28px',
  },
  weight: {
    normal: 'normal',
    medium: '500',
    semibold: '600',
    bold: 'bold',
  },
}
```

### Spacing

```typescript
spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
}
```

### Borders

```typescript
borders = {
  radius: {
    none: '0px',
    sm: '3px',
    base: '5px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  width: {
    none: '0px',
    thin: '1px',
    base: '2px',
    thick: '4px',
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
}
```

## Pre-built Styles

The `createEmailStyles()` function returns these commonly used styles:

- `main` - Main email container
- `container` - Content container
- `box` - Section/Box container
- `h1`, `h2` - Heading styles
- `paragraph` - Body text
- `small` - Small text
- `link` - Link styling
- `button` - Secondary button
- `buttonPrimary` - Primary button
- `hr` - Horizontal rule
- `code` - Code blocks
- `footer` - Footer text

## Usage Examples

### Basic Usage

```typescript
import { colors, fonts, spacing } from './tokens';

const myStyle = {
  color: colors.primary,
  fontFamily: fonts.family,
  fontSize: fonts.size.lg,
  padding: spacing.md,
};
```

### With createEmailStyles

```typescript
import { createEmailStyles, colors, spacing } from './tokens';

export const WelcomeEmail = () => {
  const styles = createEmailStyles();
  
  return (
    <Html>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Text style={styles.h1}>Welcome!</Text>
          <Text style={styles.paragraph}>
            Thanks for joining us.
          </Text>
          <Button 
            style={{
              ...styles.buttonPrimary,
              marginTop: spacing.lg,
            }}
          >
            Get Started
          </Button>
        </Container>
      </Body>
    </Html>
  );
};
```

### With useTokens Hook

```typescript
import { useTokens } from './tokens';

export const DynamicEmail = ({ theme = 'light' }) => {
  const tokens = useTokens();
  
  const dynamicStyle = {
    backgroundColor: theme === 'dark' 
      ? tokens.colors.textPrimary 
      : tokens.colors.background,
    color: theme === 'dark' 
      ? tokens.colors.white 
      : tokens.colors.textPrimary,
  };
  
  return <Text style={dynamicStyle}>Dynamic content</Text>;
};
```

## TypeScript Support

The library includes TypeScript definitions:

```typescript
import type { 
  EmailColors, 
  EmailFonts, 
  EmailSpacing, 
  EmailTokens 
} from './tokens';
```

## Backward Compatibility

The `typography` export is maintained for backward compatibility:

```typescript
import { typography } from './tokens';
// Same as: import { fonts } from './tokens';
```
